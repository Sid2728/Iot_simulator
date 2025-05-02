import React, { useEffect, useState } from "react";
import { fetchReadings,fetchAverageValue } from "./api";
import SensorCard from "./components/SensorCard";
import MapView from "./components/MapView";


const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{
      width: "250px",
      height: "100vw",
      backgroundColor: "#2B00FF",
      padding: "20px",
      boxShadow: "2px 0 5px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "30px", color: "white" }}>IoT Dashboard</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'map', label: 'Map' }
          ].map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "8px",
                  textAlign: "left",
                  backgroundColor: activeTab === tab.id ? "#e9ecef" : "transparent",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  fontSize: "16px"
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default function App() {
  const [sensors, setSensors] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) {
      window.location.href = "/login"; 
    }
    const getData = async () => {
      const data = await fetchReadings();
      const averageData = await fetchAverageValue();
      const latestByDevice = {};
      const now = Date.now()

      for (const sensor of data.data) {
        const id = sensor.device_id;
        const time = new Date(sensor.time).getTime();
        
 
        if (!latestByDevice[id] || time > new Date(latestByDevice[id].time).getTime()) {
          latestByDevice[id] = {
            ...sensor,
            _time: time,  
          };
        }
      }

      for (const id in latestByDevice) {
        const lastSeen = latestByDevice[id]._time
        const match = averageData.find((e) => e.device_id === id);
        const avgTemp = match ? match.temperature : null;
        latestByDevice[id] = {
          ...latestByDevice[id],
          avgTemperature: avgTemp ? avgTemp.toFixed(1) : "N/A",
          isFailed: (now - lastSeen)>45000
        };
      }

      setSensors(Object.values(latestByDevice));
    };

    getData();
    const interval = setInterval(getData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    
    <div style={{ position: "relative" }}>
      <div style={{
        position: "fixed",
        top: 24,
        right: 36,
        zIndex: 1000
      }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 24px",
            fontSize: "1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "background 0.2s"
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#c0392b"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#e74c3c"}
        >
          Logout
        </button>
      </div>
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ 
        flex: 1, 
        padding: "30px",
        backgroundColor: "#ffffff",
      }}>
        {activeTab === "home" ? (
          <div>
            <h1 style={{ marginBottom: "24px", color: "#2c3e50" }}>Sensor Data</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <SensorCard sensors={sensors} />
            </div>
          </div>
        ) : (
          <div>
            <h1 style={{ marginBottom: "24px", color: "#2c3e50" }}>Device Map</h1>
            <MapView sensors={sensors}/>
            <div style={{
              height: "500px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              color: "#6c757d"
            }}>
             
            </div>
          </div>
        )}
      </main>
    </div>
    </div>
  );
}
