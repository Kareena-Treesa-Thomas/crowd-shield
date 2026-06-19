"""
CrowdShield AI - Alert Logger
Logs WARNING/CRITICAL alerts to alerts.json with timestamp and resolve support.
"""

import json
import os
import datetime

ALERTS_FILE = "alerts.json"


def load_alerts() -> list:
    if not os.path.exists(ALERTS_FILE):
        return []
    try:
        with open(ALERTS_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []


def log_alert(zone_id: str, zone_name: str, count: int, level: str):
    alerts = load_alerts()

    # Avoid duplicate alerts — skip if last alert for this zone is same level and unresolved
    for alert in reversed(alerts):
        if alert["zone_id"] == zone_id and alert["level"] == level and not alert["resolved"]:
            return

    alert = {
        "id": len(alerts) + 1,
        "zone_id": zone_id,
        "zone_name": zone_name,
        "count": count,
        "level": level,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "resolved": False
    }

    alerts.append(alert)

    with open(ALERTS_FILE, "w") as f:
        json.dump(alerts, f, indent=2)


def resolve_alert(alert_id: int):
    alerts = load_alerts()

    for alert in alerts:
        if alert["id"] == alert_id:
            alert["resolved"] = True
            alert["resolved_at"] = datetime.datetime.utcnow().isoformat() + "Z"
            break

    with open(ALERTS_FILE, "w") as f:
        json.dump(alerts, f, indent=2)