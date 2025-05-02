from random import choice
from fastapi import APIRouter, Depends, HTTPException
from app.models import SensorPayload, User
from app.db import write_sensor_data, get_latest_readings,get_device_history,get_avg_temperature
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.auth import create_access_token, verify_password, get_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

available_device_ids = [f"sensor_{i}" for i in range(1, 7)]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()
users_db = {}
users_db[os.getenv("ADMIN_USERNAME")]={
    "hashed_password" : get_password_hash(os.getenv("ADMIN_PASSWORD")),
    "role": "Admin",
    "device_alloted":""
}
@router.post("/ingest")
def ingest(data: SensorPayload):
    try:
        write_sensor_data(data.dict())
        return  {"message":"Data ingested successfully"}
    except Exception as e:
        return HTTPException(status_code=500,detail=str(e))

@router.get("/latest")
def latest():
    result = get_latest_readings()
    return {"data": result}

@router.get("/average")
def average():
    result = get_avg_temperature()
    return result


@router.get("/history/{device_id}")
def generateChart(device_id:str):
    result = get_device_history(device_id=device_id)
    return result


@router.post("/signup")
def signup(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    role = "Staff"
    device_alloted = choice(available_device_ids)
    users_db[user.username] = {
        "hashed_password": get_password_hash(user.password),
        "role": role,
        "device_alloted": device_alloted
    }

    return {
        "msg": "User created",
        "role": role,
        "device_alloted": device_alloted
    } 

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_hash = users_db.get(form_data.username)
    print(user_hash)
    if not user_hash or not verify_password(form_data.password, user_hash["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": form_data.username})
    return {
        "username":form_data.username,
        "access_token": token,
        "token_type": "bearer",
        "role": user_hash["role"],
        "device_alloted": user_hash["device_alloted"]
    }

