<div align="center">

# 🛡️ CrowdShield

> Real-time crowd intelligence that turns density data into early warnings — before a crowd becomes a crisis.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

</div>

---

## 📖 Overview

**CrowdShield** is a real-time crowd safety and intelligence platform built to help event organizers, venue operators, religious site authorities, and public safety teams **detect, monitor, and respond to dangerous crowd densities before they escalate into stampedes or crush incidents**.

### The Problem

Crowd disasters are rarely the result of chaos at unmanaged events — they overwhelmingly occur at **organized gatherings where management, security personnel, and infrastructure are already in place**:

| Incident | Year | Deaths | Context |
|---|---|---|---|
| Hillsborough Stadium | 1989 | 97 | Full police presence, managed stadium |
| Hajj Tunnel, Mecca | 1990 | 1,426 | Organized pilgrimage with designated routes |
| Love Parade, Germany | 2010 | 21 | Licensed music festival |
| Kumbh Mela | 2013 | 36+ | Extensive crowd management plans in place |
| Astroworld Festival | 2021 | 10 | Fully ticketed, professionally staffed concert |
| Hathras, India | 2024 | 121 | Religious congregation with designated organizers |

In every case, organizers and authorities were present. What was missing was **real-time, data-driven visibility into how the crowd was actually behaving** — and a structured system to act on that information before conditions became fatal.

### The Solution

CrowdShield closes this gap by combining three layers into a single deployable system:

1. **AI Detection Layer** — YOLOv8n + ByteTrack for individual person tracking; CSRNet for high-density area estimation. Processes camera feeds to produce accurate, continuous crowd counts per zone.
2. **Intelligence Layer** — Flask backend classifies live data into risk levels (Safe / Warning / Critical), logs alerts with timestamps, and exposes everything via a clean REST API.
3. **Operator Layer** — Web dashboard presents live maps, alerts, analytics, thermal views, and exit-routing guidance — giving decision-makers the situational awareness they need in real time.

### Design Philosophy

CrowdShield is built to be **practical and deployable**, not just technically impressive:

- Runs on **consumer-grade cameras** and standard hardware — no proprietary surveillance equipment required
- Uses **YOLOv8n (nano)** optimized for CPU-only environments, so it works without expensive GPU infrastructure
- **Frontend and backend are fully decoupled** — dashboard runs as a static site; AI engine runs independently wherever a camera feed is available
- **Modular architecture** — detection engine, dashboard, and analytics can each be adopted or extended independently

This makes CrowdShield viable not just for large commercial events, but for **community gatherings, religious sites, college fests, and local administrations** that need crowd safety tools without enterprise surveillance budgets.

---

## 🚀 Key Features

| Feature | What It Does | Why It Matters |
|---|---|---|
| 🗺️ **Live Venue Map** | Zones color-coded in real time as Safe / Caution / Critical based on current occupancy | Single-glance venue status — enables faster prioritization during busy periods |
| 🚨 **Real-Time Alert System** | Auto-raises alerts when density thresholds are crossed; filterable Active vs Resolved feed | Removes manual monitoring burden — flags problems as they emerge and tracks resolution |
| 📊 **Crowd Analytics** | Density trends over time, flow paths, bottleneck highlighting via charts | Helps organizers understand patterns, not just snapshots — useful live and for post-event planning |
| 🌡️ **Thermal Occupancy Monitor** | Renders zone occupancy as a heatmap with occupancy tables | Intuitive secondary view, especially useful when camera angles make direct counting difficult |
| 🚪 **Exit Routing & Evacuation** | Live gate congestion status (Clear / Moderate / Congested) with step-by-step evacuation recommendations | Knowing which exits are usable *right now* directly reduces crush risk in emergencies |
| 🎥 **YOLOv8 + ByteTrack Engine** | Detects individuals per frame; ByteTrack maintains consistent IDs across frames for reliable live counts | Core data source — accurate counts drive every alert, zone status, and analytic on the dashboard |
| 📈 **CSRNet Density Estimation** | For overhead/aerial angles at high densities — generates a density heatmap and estimates headcount via VGG-16 dilated convolutions | Extends accurate estimation to scenarios where person-by-person bounding boxes break down |
| 📋 **Post-Event Reporting** | Zone usage summaries, entry/exit patterns, historical comparisons | Supports retrospective analysis so organizers can plan safer layouts for future events |

---

## 🧰 Tech Stack

```
Frontend         : HTML5, CSS3, JavaScript
Backend          : Python, Flask, Flask-CORS
Computer Vision  : OpenCV, YOLOv8n (Ultralytics), ByteTrack (supervision), CSRNet (PyTorch)
Infrastructure   : ngrok (local tunnel for live demos), static hosting for frontend
```

---

## 🗂️ Project Structure

```
crowd-shield/
├── index.html               # Landing page — overview, problem statement, incident timeline
├── dashboard.html           # Operator dashboard — live map, alerts, analytics, reports
├── dashboard.js             # Dashboard rendering logic and zone status handling
├── ai-demo.html             # AI detection demo — live video feed with detection overlay
├── event-entry.html         # Event access page for entering an event session
├── detection_data.json      # Fallback crowd detection data (count, level, fps)
├── styles.css               # Global stylesheet
├── requirements.txt         # Root-level Python dependencies
└── CrowdShield-Ai/
    ├── server.py            # Flask server — /video_feed, /api/crowd-data, /api/alerts
    ├── detect.py            # YOLOv8n + ByteTrack detection and tracking engine
    ├── csrnet.py            # CSRNet density estimation model
    ├── alert_logger.py      # Alert logging, loading, and resolve support (alerts.json)
    ├── zones.py             # Zone configuration (name, camera source, thresholds)
    ├── test_classify.py     # Unit tests for risk classification logic
    └── .env.example         # Environment variable template
```

---

## ⚡ Quick Start

**1. Clone the repository**
```bash
git clone https://github.com/Kareena-Treesa-Thomas/crowd-shield.git
cd crowd-shield
```

**2. Set up the AI backend**
```bash
cd CrowdShield-Ai
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r ../requirements.txt
cp .env.example .env
```

**3. Configure your zone**

Edit `.env`:
```env
SAFE_LIMIT=10
WARNING_LIMIT=20
CAMERA_INDEX=0
PORT=5050
```

**4. Start the detection server**
```bash
python server.py
```

Server starts at `http://localhost:5050`

> YOLOv8n model weights download automatically on first run — no manual setup required.

**5. Open the interface**

Open `dashboard.html` or `ai-demo.html` in your browser.

---

## 🔌 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/video_feed` | GET | MJPEG stream with bounding boxes and tracking IDs overlaid |
| `/api/crowd-data` | GET | JSON — current count, risk level, FPS, timestamp |
| `/api/health` | GET | Server status, zone name, device, model info |
| `/api/alerts` | GET | All logged alerts with timestamps and resolve status |
| `/api/alerts/<id>/resolve` | POST | Mark a specific alert as resolved |
| `/stop` | GET | Gracefully stop the detection loop and release camera |

**Sample `/api/crowd-data` response:**
```json
{
  "count": 14,
  "level": "WARNING",
  "fps": 18.3,
  "timestamp": "2025-06-15T10:42:00.000Z"
}
```

---

## 🎯 Risk Classification

| Level | Count | Indicator | Action |
|---|---|---|---|
| SAFE | ≤ 10 | 🟢 | Normal occupancy — no action needed |
| WARNING | 11 – 20 | 🟡 | Elevated density — monitor closely |
| CRITICAL | > 20 | 🔴 | High risk — immediate intervention required |

Thresholds are configurable via `.env` to suit different venue sizes and zone layouts.

---

## ⚙️ Performance

| Setting | Detail |
|---|---|
| Model | YOLOv8n (nano) — fastest YOLO variant, accurate for person detection |
| Input resolution | 640 × 480 |
| Frame skipping | Odd frames processed; ByteTrack interpolates on skipped frames |
| GPU acceleration | FP16 half-precision enabled automatically when CUDA is available |
| CPU-only estimate | ~12–18 FPS on a mid-range laptop |

---

## 👥 Team

| Name | Role |
|---|---|
| Kareena Treesa Thomas | Project Lead · AI & Backend |
| Christy George | AI & Backend |
| Anjana Priya V P | AI & YOLO Model |
| Alan T Anoop | Frontend & Integration |

---

## 🔗 Links

- **Repository:** [github.com/Kareena-Treesa-Thomas/crowd-shield](https://github.com/Kareena-Treesa-Thomas/crowd-shield)
- **Live Demo:** Coming soon

---

## 📜 License

No license has been specified for this project. All rights reserved by the authors.

---

<div align="center">
Built to prevent the next Hillsborough. The next Astroworld. The next Hathras.
</div>