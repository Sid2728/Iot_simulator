import os
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from dotenv import load_dotenv

load_dotenv()

INFLUX_URL = os.getenv("INFLUXDB_URL")
INFLUX_TOKEN = os.getenv("INFLUXDB_TOKEN")
INFLUX_ORG = os.getenv("INFLUXDB_ORG")
INFLUX_BUCKET = os.getenv("INFLUXDB_BUCKET")

client = InfluxDBClient(
    url=INFLUX_URL,
    token=INFLUX_TOKEN,
    org=INFLUX_ORG
)

write_api = client.write_api(write_options=SYNCHRONOUS)
query_api = client.query_api()

def write_sensor_data(data: dict):
    point = (
        Point("temperature")
        .tag("device_id", data["device_id"])
        .field("temperature", data["temperature"])
        .field("battery", data["battery"])
        .field("latitude", data["location"]["latitude"])
        .field("longitude", data["location"]["longitude"])
        .time(data["timestamp"])
    )
    print(point)
    write_api.write(bucket=INFLUX_BUCKET, record=point)

def get_latest_readings():
    query = f'''
    from(bucket: "{INFLUX_BUCKET}")
      |> range(start: -30m)
      |> filter(fn: (r) => r._measurement == "temperature")
      |> group(columns: ["device_id", "_field"])
      |> sort(columns: ["_time"], desc: true)
      |> limit(n:1)
      |> group(columns: ["device_id"])
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    '''
    result = query_api.query(org=INFLUX_ORG, query=query)
    
    readings = []
    
    for table in result:
        for record in table.records:
            readings.append({
                "device_id": record["device_id"],
                "temperature": record["temperature"],
                "battery": record["battery"],
                "latitude": record["latitude"],
                "longitude": record["longitude"],
                "time": record.get_time()
            })
    return readings


def get_avg_temperature():
    query = f'''
    from(bucket: "{INFLUX_BUCKET}")
      |> range(start: -30m)
      |> filter(fn: (r) => r._measurement == "temperature")
      |> filter(fn: (r) => r._field == "temperature")
      |> group(columns: ["device_id"])
      |> mean()
    '''
    result = query_api.query(org=INFLUX_ORG, query=query)
    readings = []
    
    for table in result:
        for record in table.records:
            readings.append({
                "device_id": record["device_id"],
                "temperature": record.get_value(),
            })
    return readings

def get_device_history(device_id: str):
    query = f'''
    from(bucket: "{INFLUX_BUCKET}")
      |> range(start: -30m)
      |> filter(fn: (r) => r._measurement == "temperature")
      |> filter(fn: (r) => r.device_id == "{device_id}")
      |> filter(fn: (r) => r._field == "temperature")
      |> sort(columns: ["_time"])
    '''
    result = query_api.query(org=INFLUX_ORG, query=query)
    
    history = [
        {
            "time": record.get_time().isoformat(),
            "temperature": record.get_value()
        }
        for table in result
        for record in table.records
    ]
    return history