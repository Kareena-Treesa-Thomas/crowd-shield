import os
from dotenv import load_dotenv

load_dotenv()

def get_zone():
    return {
        "id": 1,
        "name": os.getenv("ZONE_NAME", "Main Gate"),
        "camera_source": int(os.getenv("CAMERA_SOURCE", 0))
    }
