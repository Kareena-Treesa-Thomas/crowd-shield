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
from detect import CrowdDetector

app = Flask(__name__)
CORS(app)

detector = CrowdDetector()
latest_data = {"count": 0, "level": "SAFE", "fps": 0}
lock = threading.Lock()

cap = None
running = False


def gen_frames():
    global cap, running, latest_data
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    running = True
    frame_count = 0

    while running:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        t0 = time.time()

        if frame_count % 2 == 0:
            frame, count, level = detector.detect(frame)
            fps = round(1 / (time.time() - t0 + 1e-6), 1)
            with lock:
                latest_data = {"count": count, "level": level, "fps": fps}

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


@app.route('/stop')
def stop():
    global running
    running = False
    return jsonify({"status": "stopped"})


if __name__ == '__main__':
    print("CrowdShield AI Server running at http://localhost:5050")
    app.run(host='0.0.0.0', port=5050, threaded=True)