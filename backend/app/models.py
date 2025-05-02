from pydantic import BaseModel
from typing import Literal, Dict
from datetime import datetime

class Location(BaseModel):
    latitude: float
    longitude: float


class SensorPayload(BaseModel):
    device_id: str
    temperature: float
    timestamp: datetime
    unit: Literal["C"]
    battery: float
    location: Location
    status: Literal["online","offline"]

class User(BaseModel):
    username: str
    password: str