<div align="center">

<img src="https://img.shields.io/badge/CrowdShield-AI%20Crowd%20Safety-red?style=for-the-badge&logo=shield&logoColor=white" alt="CrowdShield" height="40"/>

### Real-time crowd intelligence that turns density data into early warnings — before a crowd becomes a crisis.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=opencv&logoColor=white)](https://opencv.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-00FFFF?style=flat-square&logoColor=black)](https://ultralytics.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 🔴 The Problem

Crowd disasters don't happen because events are unmanaged. They happen at **organized, staffed, fully monitored gatherings** — where the missing ingredient is real-time visibility into crowd behavior:

| Incident | Deaths | Setting |
|---|---|---|
| Hillsborough, UK (1989) | 97 | Football stadium with full police presence |
| Hajj Tunnel Tragedy (1990) | 1,426 | Managed religious pilgrimage |
| Love Parade, Germany (2010) | 21 | Licensed music festival |
| Kumbh Mela (2013) | 36+ | Extensive crowd management plans in place |
| Astroworld Festival (2021) | 10 | Fully ticketed, professionally staffed concert |
| Hathras, India (2024) | 121 | Religious congregation with designated organizers |

In every case, the crisis was **detectable minutes before it became fatal** — if the right system had been in place.

---

## 🛡️ What CrowdShield Does

CrowdShield is a real-time crowd safety and intelligence platform for event organizers, venue operators, religious site authorities, and public safety teams. It combines three layers:

```
📷 Webcam / IP Camera Feed
          │
          ▼
🤖 AI Detection Layer       YOLOv8n + ByteTrack  (individual tracking)
   (CrowdShield-Ai/)   +   CSRNet               (high-density estimation)
          │
          ▼
⚙️  Intelligence Layer      Flask API — risk classification, alert logging, live stream
          │
          ▼
🖥️  Operator Dashboard      Live map · Alerts · Analytics · Evacuation routing
```

**What operators get in real time:**
- Live crowd count with color-coded risk status (Safe / Warning / Critical)
- Instant alerts the moment density crosses a configured threshold
- Full alert history with timestamps and resolve tracking
- Crowd flow analytics and bottleneck identification
- Exit congestion tracking and evacuation route guidance
- Runs on **standard webcams** and **CPU-only hardware** — no enterprise equipment required

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Python 3, Flask, Flask-CORS |
| Object Detection | YOLOv8n (Ultralytics) |
| Multi-Object Tracking | ByteTrack (via Supervision) |
| Density Estimation | CSRNet (PyTorch + TorchVision, VGG-16 backbone) |
| Video Processing | OpenCV |
| Configuration | python-dotenv |
| Deployment | Vercel (frontend) · Python server (AI backend) |

---

## 🗂️ Project Structure

```
crowd-shield/
│
├── index.html               # Landing page — problem statement, incident timeline
├── dashboard.html           # Main operator dashboard
├── dashboard.js             # Dashboard rendering and zone status logic
├── ai-demo.html             # Live AI detection demo with video overlay
├── event-entry.html         # Event access page
├── live-data.js                # Connects dashboard to backend, falls back to JSON
├── detection_data.json         # Sample/fallback crowd detection data (count, level, fps)
├── styles.css                   # Global styling, including responsive layout rules
├── vercel.json                   # Vercel deployment configuration
└── CrowdShield-Ai/
    ├── server.py            # Flask backend — serves APIs and MJPEG stream using detect.py
    ├── detect.py            # YOLOv8 + ByteTrack detection engine (runnable standalone)
    ├── csrnet.py            # CSRNet crowd density estimation model
    ├── zones.py             # Zone configuration loader
    ├── alert_logger.py      # Alert logging and resolve system
    ├── test_classify.py     # Unit tests for risk classification
    ├── .env.example         # Environment variable template
    └── requirements.txt     # Python dependencies
```

---
## 🧩 Python Backend Files

- `CrowdShield-Ai/server.py` — runs the Flask backend, exposes `/video_feed` and `/api/*` endpoints, and uses `CrowdShield-Ai/detect.py` internally for live object detection.
- `CrowdShield-Ai/detect.py` — the standalone detection engine that loads YOLOv8, runs ByteTrack, and annotates frames. It can be executed directly for local testing.

---
## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Kareena-Treesa-Thomas/crowd-shield.git
cd crowd-shield
```

### 2. Set up the AI backend
```bash
cd CrowdShield-Ai
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

> YOLOv8n weights are downloaded automatically on first run — no manual download needed.

### 3. Configure your zone (optional)
Edit `CrowdShield-Ai/.env`:
```env
ZONE_NAME=Main Gate
CAMERA_SOURCE=0        # 0 = default webcam
SAFE_LIMIT=10
WARNING_LIMIT=20
```

### 4. Start the AI backend
```bash
python server.py
```

This launches the Flask backend and uses `CrowdShield-Ai/detect.py` internally for real-time video detection. If you want to run the detection engine by itself for local testing, use:
```bash
python detect.py --source 0 --zone "Main Gate"
```

Server starts at `http://localhost:5050`:

| Endpoint | Method | Description |
|---|---|---|
| `/video_feed` | GET | Live MJPEG stream with detection overlay |
| `/api/crowd-data` | GET | Current count, risk level, and FPS |
| `/api/health` | GET | Server status, device, and model info |
| `/api/alerts` | GET | Full alert history with timestamps |
| `/api/alerts/<id>/resolve` | POST | Mark an alert as resolved |

### 5. Open the dashboard
Open `dashboard.html` or `ai-demo.html` in your browser. Auto-connects to the backend; falls back to `detection_data.json` if no server is running.

---

## 🚦 Risk Classification

| Level | Count | Indicator | Action |
|---|---|---|---|
| **SAFE** | ≤ 10 | 🟢 Normal occupancy — no action needed |
| **WARNING** | 11 – 20 | 🟡 Elevated density — monitor closely |
| **CRITICAL** | > 20 | 🔴 High risk — immediate intervention recommended |

Thresholds are fully configurable via `CrowdShield-Ai/.env` to suit any venue size or zone layout.

---

## 🚀 Key Features

- Live crowd count and zone risk status
- Real-time alert logging and resolve tracking
- MJPEG `/video_feed` stream with detection overlay
- Backend API for crowd data, health, and alerts
- Lightweight YOLOv8n + ByteTrack tracking pipeline
- Configurable `SAFE_LIMIT` and `WARNING_LIMIT` thresholds

---

## 📜 License

No license specified.
