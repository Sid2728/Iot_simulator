# 🚀 IoT Simulation Dashboard

An end-to-end full-stack web application for simulating and visualizing IoT sensor data. Built using **FastAPI** for the backend, **React.js** for the frontend, and fully containerized using **Docker**.

---

## 🧰 Tech Stack

- **Frontend**: React.js
- **Backend**: FastAPI + Uvicorn, InfluxDB
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker + Docker Compose

---

## 📦 Features

- 🔐 User Signup and Login with JWT Authentication
- 👥 Role-based access (admin / user)
- 📡 Live IoT sensor location and data visualization 
- 📊 Average and latest data endpoints
- ⚠️ **Realistic Sensor Failure Simulation**
  - Randomly simulates sensor dropout 
  - Helps in testing robustness of dashboards and APIs
- 🐳 Dockerized full-stack application
- 🌐 Clean and responsive UI

---
![image](https://github.com/user-attachments/assets/6c5a99b4-052c-4f9d-b863-46a93f1358e2)
![image](https://github.com/user-attachments/assets/12cf7ac2-b865-420a-b12d-3a624d1fa2bb)
![image](https://github.com/user-attachments/assets/ab977f1a-4a7f-4206-844c-8038d22b03ec)




## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/your-username//Iot_simulator.git

- cd /Iot_simulator


### 2. Run with Docker Compose

- docker-compose up --build

This will start both the FastAPI backend and the React frontend in separate containers.

---

### 🌍 Access the App

- **Frontend:** http://localhost:3000
- **Backend API Docs (Swagger):** http://localhost:8000/docs

---

### 🔐 API Endpoints

| Method | Endpoint  | Description                   |
|--------|-----------|-------------------------------|
| POST   | /signup   | Register a new user           |
| POST   | /token    | User login and token issue    |
| GET    | /latest   | Get the latest sensor data    |
| GET    | /average  | Get average sensor metrics    |
| POST   | /ingest   | Ingest sensor data to DB      |
| GET    | /history  | Get sensor for last 30 min    |

---

### ⚠️ Sensor Failure Simulation

To mimic real-world IoT environments, this project includes realistic sensor failure simulation, which involves:

- Unresponsive sensors for short durations

This failure is handled gracefully in the API and can be visualized through the frontend.

---

### 🛠️ Customization

- To change simulation frequency or failure probability, modify logic in `backend/app/routes.py`.
- To add new metrics, extend the data model and include them in the frontend dashboard.

---

## 📦 Building Without Docker (Optional)

If you prefer to run locally without Docker:

### **Backend**

**1) Start the server**

- cd backend
- pip install -r requirements.txt
- uvicorn app.main:app --reload

**2) Run the simulation script**


- cd backend/sensor_simulator
- python simulator_script.py

**Frontend**

- cd frontend/dashboard
- npm install
- npm start
