"""
CrowdShield AI - Flask Backend Server
Serves /video_feed (MJPEG stream) and /api/crowd-data (JSON)
Run: python server.py
"""

from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import threading
import time
from detect import CrowdDetector, DEVICE, MODEL_PATH
from zones import get_zone
from alert_logger import log_alert, load_alerts, resolve_alert

app = Flask(__name__)
CORS(app)

zone = get_zone()
detector = CrowdDetector(zone=zone["name"])
latest_data = {"count": 0, "level": "SAFE", "fps": 0}
lock = threading.Lock()
running = False
cap = None


def gen_frames():
    global cap, running, latest_data
    cap = cv2.VideoCapture(zone["camera_source"])
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    running = True

    while running:
        ret, frame = cap.read()
        if not ret:
            break

        t0 = time.time()
        frame, count, level = detector.detect(frame)
        fps = round(1 / (time.time() - t0 + 1e-6), 1)

        with lock:
            latest_data = {"count": count, "level": level, "fps": fps}

        if level in ("WARNING", "CRITICAL"):
            log_alert(
                zone_id=zone["id"],
                zone_name=zone["name"],
                count=count,
                level=level
            )

        ret2, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        if not ret2:
            continue
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    if cap:
        cap.release()


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/api/crowd-data')
def crowd_data():
    with lock:
        return jsonify(latest_data)


@app.route('/api/health')
def health():
    return jsonify({
        "status": "ok",
        "zone": zone["name"],
        "device": DEVICE,
        "model": MODEL_PATH
    })


@app.route('/api/alerts')
def get_alerts():
    return jsonify(load_alerts())


@app.route('/api/alerts/<int:alert_id>/resolve', methods=['POST'])
def resolve(alert_id):
    resolve_alert(alert_id)
    return jsonify({"status": "resolved", "alert_id": alert_id})


@app.route('/stop')
def stop():
    global running
    running = False
    return jsonify({"status": "stopped"})


if __name__ == '__main__':
    print(f"CrowdShield AI Server running at http://localhost:5050")
    print(f"Zone: {zone['name']} | Camera: {zone['camera_source']} | Device: {DEVICE}")
    app.run(host='0.0.0.0', port=5050, threaded=True)
