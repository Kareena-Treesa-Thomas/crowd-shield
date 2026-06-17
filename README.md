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

- **Hillsborough (1989)** — 97 deaths at a football stadium with full police presence
- **Hajj Tunnel Tragedy (1990)** — 1,426 deaths during a managed pilgrimage
- **Love Parade, Germany (2010)** — 21 deaths at a licensed music festival
- **Kumbh Mela (2013)** — over 36 deaths despite extensive crowd management plans
- **Hathras (2024)** — 121 deaths at a religious congregation with designated organizers
- **Astroworld Festival (2021)** — 10 deaths at a fully ticketed, professionally staffed concert

In every case, organizers and authorities were present — what was missing was **real-time, data-driven visibility into how the crowd was actually behaving**, and a structured system to act on that information before conditions became fatal.

### The Solution

CrowdShield closes this gap by combining three layers into a single, deployable system:

1. **AI Detection Layer** — Computer vision models (YOLOv8 + ByteTrack for individual tracking, CSRNet for high-density area estimation) process camera feeds to produce accurate, continuous crowd counts per zone.
2. **Intelligence Layer** — A Flask-based backend classifies live data into risk levels (Safe / Warning / Critical), exposes it via a simple API, and serves the processed video stream.
3. **Operator Layer** — A web-based dashboard presents this information through live maps, alerts, analytics, thermal views, and exit-routing guidance — giving decision-makers the situational awareness they need in real time.

### Design Philosophy

CrowdShield is built to be **practical and accessible**, not just technically impressive:

- Runs on **consumer-grade cameras** and standard computing hardware — no proprietary surveillance equipment required
- Uses **lightweight AI models** (YOLOv8n) optimized for CPU-only environments, so it remains usable without expensive GPU infrastructure
- **Frontend and backend are decoupled** — the dashboard can run as a static site (deployable on platforms like Vercel) while the AI engine runs independently wherever a camera feed is available
- Designed with **modularity** in mind, so individual components (detection engine, dashboard, analytics) can be adopted independently or extended for specific venues

This makes CrowdShield viable not just for large commercial events, but for **community gatherings, religious sites, college fests, and local administrations** that need crowd safety tools but lack the budget for enterprise surveillance systems.

---

## � Key Features

| Feature | What It Does | Why It Matters |
|---|---|---|
| 🗺️ **Live Venue Map** | Divides the venue into monitored zones, each color-coded in real time as **Safe (green)**, **Caution (yellow)**, or **Critical (red)** based on current occupancy. | Gives operators a single-glance understanding of the entire venue's safety status, enabling faster prioritization during busy periods. |
| 🚨 **Real-Time Alert System** | Automatically raises alerts the moment a zone crosses a configured density threshold, and maintains a filterable feed of **Active** vs **Resolved** alerts. | Removes the need for manual monitoring of every camera feed — the system flags problems as they emerge, and tracks whether they've been handled. |
| 📊 **Crowd Analytics Dashboard** | Visualizes density trends over time, crowd flow paths between zones, and highlights recurring bottleneck areas through bar charts and comparative views. | Helps organizers understand *patterns*, not just snapshots — useful for both live decision-making and improving layouts for future events. |
| 🌡️ **Thermal Occupancy Monitor** | Renders zone occupancy as a heatmap with corresponding temperature/occupancy tables. | Provides an intuitive secondary view of crowd concentration, especially useful when camera angles make direct counting difficult. |
| 🚪 **Exit Routing & Evacuation Guidance** | Continuously tracks the congestion status of each gate/exit (Clear, Moderate, Congested) and surfaces step-by-step evacuation recommendations. | In an emergency, knowing *which exits are usable right now* — not just where exits are located — can directly reduce crush risk. |
| 🎥 **AI Detection Engine (YOLOv8 + ByteTrack)** | Runs object detection on each video frame to identify individuals, then uses ByteTrack to maintain consistent identity tracking across frames, producing a reliable live person count. | Forms the core data source for the entire platform — accurate counts drive every alert, zone status, and analytic shown on the dashboard. |
| 📈 **Density Estimation Engine (CSRNet)** | For aerial or overhead camera angles where individual bounding-box detection becomes unreliable at high densities, CSRNet generates a density heatmap and estimates total headcount using a VGG-16-based dilated convolutional neural network. | Extends accurate crowd estimation to high-density scenarios (e.g., large open grounds, religious gatherings) where person-by-person detection breaks down. |
| 📋 **Post-Event Reporting** | Compiles summary reports covering most-visited zones, entry/exit usage patterns, and historical comparisons across events. | Supports retrospective analysis — organizers can identify what worked, what didn't, and plan safer layouts for future events. |

---

## 🧰 Tech Stack

```
Frontend         : HTML5, CSS3, JavaScript
Backend          : Python, Flask, Flask-CORS
Computer Vision  : OpenCV, YOLOv8 (Ultralytics), ByteTrack, CSRNet (PyTorch, TorchVision)
Deployment       : Vercel (frontend) — AI backend hosted/run separately
```

---

## 🗂️ Project Structure

```
crowd-shield/
├── index.html               # Landing page — overview, problem statement, incident timeline
├── dashboard.html            # Operator dashboard — live map, alerts, analytics, reports
├── dashboard.js               # Dashboard rendering logic and zone status handling
├── ai-demo.html               # AI detection demo — live video feed with detection overlay
├── event-entry.html           # Event access page for entering an event session
├── live-data.js                # Connects dashboard to live AI backend, falls back to JSON
├── detection_data.json         # Sample/fallback crowd detection data (count, level, fps)
├── styles.css                   # Global styling, including responsive layout rules
├── vercel.json                   # Vercel deployment configuration
└── CrowdShield-Ai/
    ├── server.py                 # Flask server exposing /video_feed and /api/crowd-data
    ├── detect.py                  # YOLOv8 + ByteTrack detection and tracking engine
    ├── csrnet.py                   # CSRNet model for crowd density estimation
    ├── requirements.txt            # Python dependency list
    └── .env.example                 # Template for environment configuration
```

---

## ⚡ Quick Start

**1. Clone the repository**
```bash
git clone https://github.com/Kareena-Treesa-Thomas/crowd-shield.git
cd crowd-shield
```

**2. Set up the AI backend environment**
```bash
cd CrowdShield-Ai
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

**3. Start the detection server**
```bash
python server.py
```
The server starts at `http://localhost:5050` and exposes:
- `GET /video_feed` — live MJPEG stream with detection overlay
- `GET /api/crowd-data` — JSON response with current count, risk level, and FPS

> The YOLOv8n model weights are downloaded automatically on first run via the Ultralytics library — no manual setup required.

**4. Open the interface**
Open `dashboard.html` or `ai-demo.html` in your browser to view the live operator interface and detection demo.

---

## 🎯 Risk Classification

Crowd density per zone is classified into three levels, used consistently across the dashboard, alert system, and detection engine:

| Level | Person Count | Indicator | Meaning |
|---|---|---|---|
| SAFE | ≤ 10 | 🟢 | Normal occupancy — no action needed |
| WARNING | 11 – 20 | 🟡 | Elevated density — monitor closely |
| CRITICAL | > 20 | 🔴 | High risk — immediate intervention recommended |

These thresholds are configurable via `CrowdShield-Ai/.env` to suit different venue sizes and zone layouts.

---

## ⚙️ Performance Notes

- Uses **YOLOv8n (nano)** for fast inference on CPU-only systems — substantially faster than larger YOLO variants while remaining accurate for person detection
- Input frames are resized to **640×480** before detection to reduce processing load
- **Frame-skipping** combined with **ByteTrack** interpolation maintains smooth, consistent tracking between detection frames
- Automatically enables **FP16 (half-precision)** acceleration when a CUDA-compatible GPU is available

---

## 🔗 Links

- **Repository:** [github.com/Kareena-Treesa-Thomas/crowd-shield](https://github.com/Kareena-Treesa-Thomas/crowd-shield)
- **Live Demo:** Coming soon

---

## 👥 Authors

- **Christy George**
- **Kareena Treesa Thomas**
- **Anjana Priya V P**
- **Alan T Anoop**

---

## 📜 License

No license has been specified for this project.