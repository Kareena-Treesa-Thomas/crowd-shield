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
| Tunneling (live demo) | ngrok |

---

## 🗂️ Project Structure

```
crowd-shield/
│
├── index.html               # Landing page — problem statement, incident timeline
├── dashboard.html           # Main operator dashboard
├── dashboard.js             # Dashboard rendering and zone status logic
├── ai-demo.html             # Live AI detection demo with video overlay
├── event-entry.html         # Event session access page
├── detection_data.json      # Fallback crowd detection data
├── styles.css               # Global styles and responsive layout
├── requirements.txt         # Python dependencies (root level)
│
└── CrowdShield-Ai/
    ├── server.py            # Flask server — all API endpoints
    ├── detect.py            # YOLOv8 + ByteTrack detection engine
    ├── csrnet.py            # CSRNet crowd density estimation model
    ├── zones.py             # Zone configuration loader
    ├── alert_logger.py      # Alert logging and resolve system
    ├── test_classify.py     # Unit tests for risk classification
    └── .env.example         # Environment variable template
```

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
pip install -r ../requirements.txt
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

### 4. Start the detection server
```bash
python server.py
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
Open `dashboard.html` or `ai-demo.html` in your browser. Auto-connects to the backend at `localhost:5050`; falls back to `detection_data.json` if no server is running.

---

## 🚦 Risk Classification

| Level | Count | Indicator | Action |
|---|---|---|---|
| **SAFE** | ≤ 10 | 🟢 Green | Normal — monitor as usual |
| **WARNING** | 11–20 | 🟡 Yellow | Elevated — increase attention |
| **CRITICAL** | > 20 | 🔴 Red | High risk — intervene immediately |

Thresholds are fully configurable via `CrowdShield-Ai/.env` to suit any venue size or zone layout.

---

## 🚀 Key Features

### 🗺️ Live Venue Map
Zone-by-zone color-coded status updated in real time from the live camera feed. Single-glance situational awareness across the entire venue.

### 🚨 Real-Time Alert System
Alerts fire automatically when density crosses its threshold and are logged with full timestamps. Active and Resolved alerts are tracked in a filterable feed — operators never lose context on what's been handled.

### 📊 Crowd Analytics Dashboard
Time-series density charts, crowd flow paths, and bottleneck heatmaps — useful for both live decisions and post-event planning.

### 🌡️ Thermal Occupancy Monitor
Heatmap view of zone occupancy, especially useful when camera angles make direct counting difficult.

### 🚪 Exit Routing & Evacuation Guidance
Real-time congestion status per exit (Clear / Moderate / Congested) with step-by-step evacuation recommendations. Knowing which exits are usable right now reduces crush risk.

### 🎥 YOLOv8n + ByteTrack Detection Engine
Per-frame person detection with persistent identity tracking across frames. Frame-skipping combined with ByteTrack interpolation maintains smooth, consistent tracking without processing every frame.

### 📈 CSRNet Density Estimation
For aerial or overhead angles where bounding-box detection becomes unreliable at high densities, CSRNet (VGG-16 dilated CNN) generates density heatmaps and accurate headcount estimates.

### 📋 Post-Event Reporting
Summary reports covering most-visited zones, entry/exit usage patterns, and historical alert logs for future event planning.

---

## ⚙️ Performance Optimizations

- **YOLOv8n (nano)** — ~4× faster inference than YOLOv8m with minimal accuracy trade-off for person detection
- **640×480 input resolution** — reduces per-frame compute without impacting detection quality
- **Frame skipping (every 2nd frame)** — halves detection load; ByteTrack interpolation fills gaps seamlessly
- **FP16 half-precision** — automatically enabled when a CUDA GPU is detected
- **Threaded Flask server** — video capture and API responses run concurrently without blocking each other

---

## 🌐 Deployment

### Frontend — Static Hosting
The frontend is plain HTML/JS with no build step. Deploy to any static host (GitHub Pages, Netlify, etc.) by uploading the root-level HTML/JS/CSS files.

### AI Backend — Local Machine with Camera

```bash
cd CrowdShield-Ai
python server.py
```

### Exposing the Backend Publicly (for live demos)

To make your local backend accessible from a public URL during a demo:

```bash
# Install ngrok from https://ngrok.com/download
ngrok http 5050
```

ngrok will give you a public URL (e.g. `https://abc123.ngrok.io`). Update the API base URL in `dashboard.html` to point to that URL for the duration of the demo.

The frontend and backend are **fully decoupled** — the dashboard works as a standalone static site with fallback data, and connects to the AI engine over any network.

---

## 🧪 Running Tests

```bash
cd CrowdShield-Ai
python test_classify.py
```

Expected output:
```
All tests passed.
```

---

## 👥 Team

Built at **Muthoot Institute of Technology and Science (MITS), Kochi**
Under the guidance of **Dr. Roy C.J.**

| Name | Role |
|---|---|
| **Kareena Treesa Thomas** | Project Lead · AI Backend · Detection Pipeline |
| **Christy George** | AI Backend · Flask Server · API Integration |
| **Anjana Priya V P** | YOLOv8 Model Integration · Frontend Integration |
| **Alan T Anoop** | Frontend Development · Dashboard & UI |

---

## 🔗 Links

- **Repository:** [github.com/Kareena-Treesa-Thomas/crowd-shield](https://github.com/Kareena-Treesa-Thomas/crowd-shield)
- **Live Demo:** Coming soon

---

## 📜 License

No license specified. All rights reserved by the authors.

---

<div align="center">

*CrowdShield — built so that the next organized event isn't the next disaster.*

</div>