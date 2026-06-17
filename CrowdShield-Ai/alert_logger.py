import json
import os
from datetime import datetime

LOG_FILE = os.getenv("ALERT_LOG_FILE", "alerts.json")

def load_alerts():
    if not os.path.exists(LOG_FILE):
        return []
    with open(LOG_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def log_alert(zone_id, zone_name, count, level):
    alerts = load_alerts()
    alert = {
        "id": len(alerts) + 1,
        "zone_id": zone_id,
        "zone_name": zone_name,
        "count": count,
        "level": level,
        "timestamp": datetime.now().isoformat(),
        "resolved": False
    }
    alerts.append(alert)
    with open(LOG_FILE, "w") as f:
        json.dump(alerts, f, indent=2)
    return alert

def resolve_alert(alert_id):
    alerts = load_alerts()
    for alert in alerts:
        if alert["id"] == alert_id:
            alert["resolved"] = True
            alert["resolved_at"] = datetime.now().isoformat()
    with open(LOG_FILE, "w") as f:
        json.dump(alerts, f, indent=2)
