from ultralytics import YOLO
import supervision as sv
import cv2
import numpy as np
from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS
import threading
import sys
import argparse
import time

# Flask API Setup
app = Flask(__name__)

# Security Patch: Restrict CORS to specific local frontend origins
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "null"])

latest_data = {"count": 0, "level": "SAFE", "timestamp": None}
latest_frame = None
frame_lock = threading.Lock()

@app.route('/api/crowd-data')
def get_crowd_data():
    return jsonify(latest_data)

def generate_frames():
    import time
    from flask import Response
    global latest_frame
    while True:
        with frame_lock:
            frame_data = latest_frame
            
        if frame_data is None:
            time.sleep(0.05)
            continue
            
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')

@app.route('/video_feed')
def video_feed():
    from flask import Response
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

model = YOLO("yolov8m.pt")
byte_tracker = sv.ByteTrack()
box_annotator = sv.BoxAnnotator(thickness=2)
label_annotator = sv.LabelAnnotator(text_scale=0.5)

ZONE_NAMES = {
    "crowd1.mp4": "Zone A: Main Gate",
    "crowd2.mp4": "Zone B: Stage Front",
    "crowd3.mp4": "Zone C: Aerial View",
}

def get_writer(filename, frame):
    h, w = frame.shape[:2]
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    return cv2.VideoWriter(f"output_{filename}", fourcc, 20.0, (w, h))

def draw_status_bar(frame, zone, count, video):
    now = datetime.now().strftime("%H:%M:%S")
    if count > 20:
        color = (0, 0, 255)
        level = "CRITICAL"
    elif count > 10:
        color = (0, 165, 255)
        level = "WARNING"
    else:
        color = (0, 255, 0)
        level = "SAFE"
    cv2.rectangle(frame, (0, 0), (frame.shape[1], 60), (0, 0, 0), -1)
    cv2.putText(frame, f"CrowdShield | {zone} | {level}: {count} people | {now}",
                (15, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
    return frame, level

def process_normal_video(video):
    # Track the original intended video
    original_video = video
    if isinstance(video, int):
        zone = "Zone D: Live Camera"
        out_name = "webcam"
    else:
        zone = ZONE_NAMES.get(video, "Zone X: Unknown")
        out_name = video

    # Surveillance Mode ensures the feed never stops
    while True:
        cap = cv2.VideoCapture(video)
        if not cap.isOpened():
            if isinstance(video, int) and video == 0:
                print("⚠️ Camera busy or not found. Falling back to Active Demonstration...")
                # Search for any available crowd video or image
                fallbacks = ["crowd1.mp4", "maha_kumbh_2025.jpg", "hajj_2015.jpg"]
                import os
                found = False
                for f in fallbacks:
                    if os.path.exists(f):
                        video = f
                        found = True
                        break
                if found:
                    zone = f"Recovery Node: {video}"
                    continue
                else:
                    print("❌ No recovery sources found (video or image).")
                    break
            else:
                print(f"⚠️ Source {video} not found or busy.")
                break

        writer = None
        # Verify first frame output to detect locked/busy camera
        ret_initial, frame_initial = cap.read()
        if not ret_initial:
            if isinstance(video, int) and video == 0:
                print("⚠️ Camera stream is empty (likely in use). Activating Neural Fallback...")
                video = "crowd1.mp4"
                zone = ZONE_NAMES.get(video, "Zone A: Fallback")
                cap.release()
                continue
            else:
                print(f"⚠️ Source {video} yielded no data.")
                cap.release()
                break

        while cap.isOpened():
            # If we just checked the initial frame, use it; otherwise read new
            if 'frame_initial' in locals() and frame_initial is not None:
                ret, frame = True, frame_initial
                del frame_initial
            else:
                ret, frame = cap.read()

            if not ret:
                break

            frame = cv2.resize(frame, (1280, 720))

            if writer is None and out_name and not isinstance(video, int):
                writer = get_writer(out_name, frame)

            results = model(frame, classes=[0], verbose=False)[0]
            detections = sv.Detections.from_ultralytics(results)
            detections = byte_tracker.update_with_detections(detections)
            labels = [f"#{tid}" for tid in detections.tracker_id]
            frame = box_annotator.annotate(scene=frame, detections=detections)
            frame = label_annotator.annotate(scene=frame, detections=detections, labels=labels)

            count = len(detections)
            frame, level = draw_status_bar(frame, zone, count, video)
            
            # Update live stats for the web API
            global latest_data, latest_frame
            latest_data["count"] = count
            latest_data["level"] = level
            latest_data["timestamp"] = datetime.now().isoformat()
            
            # Encode frame for web streaming
            ret_enc, buffer = cv2.imencode('.jpg', frame)
            if ret_enc:
                with frame_lock:
                    latest_frame = buffer.tobytes()

            if writer:
                writer.write(frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                cap.release()
                if writer: writer.release()
                return # Exit completely

        cap.release()
        if writer:
            writer.release()
            print(f"✅ Saved: output_{out_name}")
        
        # If in CLI mode and not looping, break after one pass
        if not ("--loop" in sys.argv or "--web" in sys.argv or args.input is None):
            break
        print(f"🔄 Restarting surveillance on {zone}...")

def process_aerial_video(video):
    zone = ZONE_NAMES.get(video, "Zone C: Aerial View")
    
    # Surveillance Mode ensures the feed never stops
    while True:
        cap = cv2.VideoCapture(video)
        if not cap.isOpened():
            print(f"⚠️ Source {video} not found.")
            break

        writer = None
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.resize(frame, (1280, 720))

            if writer is None and not isinstance(video, int):
                writer = get_writer(video, frame)

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (21, 21), 0)
            edges = cv2.Canny(blurred, 30, 100)

            grid_rows, grid_cols = 4, 4
            h, w = edges.shape
            cell_h, cell_w = h // grid_rows, w // grid_cols
            total = 0

            for r in range(grid_rows):
                for c in range(grid_cols):
                    cell = edges[r*cell_h:(r+1)*cell_h, c*cell_w:(c+1)*cell_w]
                    density = int(np.sum(cell) / 255 / 60)
                    total += density
                    if density > 50:
                        color = (0, 0, 255)
                    elif density > 20:
                        color = (0, 165, 255)
                    else:
                        color = (0, 255, 0)
                    x1, y1 = c*cell_w, r*cell_h
                    x2, y2 = (c+1)*cell_w, (r+1)*cell_h
                    cv2.rectangle(frame, (x1+2, y1+2), (x2-2, y2-2), color, 2)
                    cv2.putText(frame, f"~{density}", (x1+10, y1+35),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

            now = datetime.now().strftime("%H:%M:%S")
            if total > 200:
                color = (0, 0, 255)
                level = "CRITICAL"
            elif total > 100:
                color = (0, 165, 255)
                level = "WARNING"
            else:
                color = (0, 255, 0)
                level = "SAFE"

            cv2.rectangle(frame, (0, 0), (frame.shape[1], 60), (0, 0, 0), -1)
            cv2.putText(frame, f"CrowdShield Aerial | {zone} | {level}: ~{total} people | {now}",
                        (15, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

            if writer:
                writer.write(frame)

            # Encode frame for web streaming
            global latest_frame
            ret_enc, buffer = cv2.imencode('.jpg', frame)
            if ret_enc:
                with frame_lock:
                    latest_frame = buffer.tobytes()

            if cv2.waitKey(1) & 0xFF == ord('q'):
                cap.release()
                if writer: writer.release()
                return

        cap.release()
        if writer:
            writer.release()
            print(f"✅ Saved: output_{video}")
        
        # If in CLI mode and not looping, break after one pass
        if not ("--loop" in sys.argv or "--web" in sys.argv or args.input is None):
            break
        print(f"🔄 Restarting aerial surveillance on {zone}...")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CrowdShield AI Engine")
    parser.add_argument("input", nargs="?", default=None, help="Video file path or 0 for webcam")
    parser.add_argument("--loop", action="store_true", help="Loop the video file")
    parser.add_argument("--web", action="store_true", help="Start the web API server even in file mode")
    args = parser.parse_args()

    # Determine if we should start the Web API (default if no file passed)
    should_run_api = (args.input is None) or args.web

    if should_run_api:
        def run_api():
            # Localhost bind for security and consistency
            app.run(host='localhost', port=5050, debug=False, use_reloader=False)

        api_thread = threading.Thread(target=run_api, daemon=True)
        api_thread.start()
        print("▶ Neural Bridge Active: http://localhost:5050")
    
    if args.input is None:
        print("▶ Initializing Live Surveillance...")
        process_normal_video(0)
    else:
        print(f"▶ Direct Processing Mode: {args.input}")
        # Detect if camera index was passed as string
        source = int(args.input) if args.input.isdigit() else args.input
        
        # Check if aerial in filename
        if "aerial" in str(source).lower() or "view" in str(source).lower() or "crowd3" in str(source).lower():
            process_aerial_video(source)
        else:
            process_normal_video(source)

    cv2.destroyAllWindows()
    print("\n✅ Intelligence session terminated.")