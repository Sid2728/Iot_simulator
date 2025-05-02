import time
import random
import threading
import requests
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

SENSORS = [f"sensor_{i}" for i in range(1, 7)]
failed_sensor = random.randint(1, 6)
lock = threading.Lock()
BACKEND_URL = os.getenv("BASE_API") + "/ingest"

def generate_payload(device_id):
    return {
        "device_id": device_id,
        "temperature": round(random.uniform(20.0, 35.0), 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "unit": "C",
        "battery": random.randint(30, 100),
        "location": {
            "latitude": round(random.uniform(-90, 90), 4),
            "longitude": round(random.uniform(-180, 180), 4)
        },
        "status": random.choice(["online", "offline"])
    }

def simulate_sensor(device_id):
    while True:
        with lock:
            is_failed = (device_id == f"sensor_{failed_sensor}")
        if is_failed:
            time.sleep(1)
            continue

        payload = generate_payload(device_id)
        try:
            response = requests.post(BACKEND_URL, json=payload)
            print(f"[{device_id}] Status: {response.status_code}")
        except Exception as e:
            print(f"[{device_id}] Failed to send data: {e}")
        time.sleep(5)

def update_failed_sensor():
    global failed_sensor
    while True:
        with lock:
            failed_sensor = random.randint(1, 6)
            print(f"Failed sensor is now: sensor_{failed_sensor}")
        time.sleep(45)

def main():
 
    fail_thread = threading.Thread(target=update_failed_sensor)
    fail_thread.daemon = True
    fail_thread.start()


    for device_id in SENSORS:
        t = threading.Thread(target=simulate_sensor, args=(device_id,))
        t.daemon = True
        t.start()

    while True:
        time.sleep(60)

if __name__ == "__main__":
    main()
