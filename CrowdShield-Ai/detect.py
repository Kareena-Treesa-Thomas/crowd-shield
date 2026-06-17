
"""
CrowdShield AI - Detection Engine
Optimizations:
  - YOLOv8n (nano) instead of YOLOv8m -> ~4x faster
  - 640x480 resolution
  - Frame skipping (every 2nd frame)
  - CUDA half precision if GPU available
"""

from ultralytics import YOLO
import supervision as sv
import cv2
import torch
import time
from dotenv import load_dotenv
import os

load_dotenv()

MODEL_PATH = "yolov8n.pt"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

model = YOLO(MODEL_PATH)
model.to(DEVICE)
if DEVICE == "cuda":
    model.model.half()

byte_tracker = sv.ByteTrack()
box_annotator = sv.BoxAnnotator(thickness=1)
label_annotator = sv.LabelAnnotator(text_scale=0.4)

SAFE_LIMIT = int(os.getenv("SAFE_LIMIT", 10))
WARNING_LIMIT = int(os.getenv("WARNING_LIMIT", 20))

STATUS_COLORS = {
    "SAFE": (45, 212, 168),
    "WARNING": (255, 184, 116),
    "CRITICAL": (255, 59, 48),
}


def classify(count: int) -> str:
    if count <= SAFE_LIMIT:
        return "SAFE"
    if count <= WARNING_LIMIT:
        return "WARNING"
    return "CRITICAL"


def draw_status_bar(frame, zone: str, count: int, level: str):
    color = STATUS_COLORS[level]
    h, w = frame.shape[:2]
    overlay = frame.copy()
    cv2.rectangle(overlay, (0, h - 40), (w, h), (10, 10, 10), -1)
    frame = cv2.addWeighted(overlay, 0.6, frame, 0.4, 0)
    text = f"Zone: {zone}  |  Count: {count}  |  {level}"
    cv2.putText(frame, text, (12, h - 12),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2, cv2.LINE_AA)
    return frame


class CrowdDetector:
    def __init__(self, zone: str = "Live Camera"):
        self.zone = zone
        self._frame_count = 0
        self._last_detections = sv.Detections.empty()
        self._last_count = 0
        self._last_level = "SAFE"

    def detect(self, frame):
        self._frame_count += 1

        if self._frame_count % 2 == 0:
            frame = cv2.resize(frame, (640, 480))
            results = model(frame, classes=[0], verbose=False, stream=True)

            detections = sv.Detections.empty()
            for r in results:
                detections = sv.Detections.from_ultralytics(r)

            detections = byte_tracker.update_with_detections(detections)
            self._last_detections = detections
            self._last_count = len(detections)
            self._last_level = classify(self._last_count)
        else:
            frame = cv2.resize(frame, (640, 480))
            # Preserve the most recent tracked detections on skipped frames so
            # ByteTrack IDs remain visible instead of clearing them with an empty update.
            # If the tracker library supports prediction, that should be added here.
            self._last_detections = self._last_detections

        tracker_ids = self._last_detections.tracker_id
        labels = [f"#{tid}" for tid in tracker_ids] if tracker_ids is not None and tracker_ids.size > 0 else []
        frame = box_annotator.annotate(scene=frame, detections=self._last_detections)
        frame = label_annotator.annotate(scene=frame, detections=self._last_detections, labels=labels)
        frame = draw_status_bar(frame, self.zone, self._last_count, self._last_level)

        return frame, self._last_count, self._last_level


def process_video(source=0, zone="Zone A"):
    detector = CrowdDetector(zone=zone)
    cap = cv2.VideoCapture(source)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    print(f"[CrowdShield] Running on {DEVICE.upper()} | Model: {MODEL_PATH}")
    print("Press Q to quit.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        t0 = time.time()
        frame, count, level = detector.detect(frame)
        fps = round(1 / (time.time() - t0 + 1e-6), 1)

        cv2.putText(frame, f"FPS: {fps}", (10, 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)

        cv2.imshow("CrowdShield Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("[CrowdShield] Stopped.")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="CrowdShield Crowd Detector")
    parser.add_argument("--source", default=0)
    parser.add_argument("--zone", default="Zone A")
    args = parser.parse_args()

    src = int(args.source) if str(args.source).isdigit() else args.source
    process_video(source=src, zone=args.zone)