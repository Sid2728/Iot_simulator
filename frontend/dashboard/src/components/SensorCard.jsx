import React, { useState } from "react";
import TemperatureChart from "./TemperatureChart";


const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  background: "#2B00FF",  
  color: "white",          
  textAlign: "left",
  fontWeight: "600",
  fontSize: "14px"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  fontSize: "14px"
};

const pageStyle = {
  fontFamily: "'Segoe UI', Arial, sans-serif",
  margin: "24px",
  backgroundColor: "#f8f9fa",
  color: "#2c3e50"
};

const headerStyle = {
  marginBottom: "24px",
  color: "#2c3e50",
  fontSize: "28px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const tableStyle = {
  width: "70vw",
  borderCollapse: "collapse",
  marginTop: "1rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  borderRadius: "8px",
  overflow: "hidden"
};

const buttonStyle = {
  padding: "6px 12px",
  backgroundColor: "#2B00FF",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s",
  fontSize: "13px",
  fontWeight: "500"
};

export default function SensorTable({ sensors }) {
  const [visibleCharts, setVisibleCharts] = useState({});
  const user = JSON.parse(localStorage.getItem("user")); 

  const filteredSensors = user?.role === "Staff"
    ? sensors.filter(s => s.device_id === user.device_alloted)
    : sensors;
  const toggleChart = (device_id) => {
    setVisibleCharts(prev => ({
      ...prev,
      [device_id]: !prev[device_id]
    }));
  };

  return (
    <div style={pageStyle}>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            {["Device ID", "Status", "Temperature (°C)","Average Temperature (°C)", "Battery (%)", "Latitude", 
              "Longitude", "Time", "Chart"].map((header, index) => (
              <th key={index} style={thStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
  {filteredSensors.map((s) => {
    const isOffline = s.status === "offline" || s.isFailed;

    return (
      <React.Fragment key={`${s.device_id}-${s.time}`}>
        <tr style={{ backgroundColor: isOffline ? "#ddd" : "white" }}>
          <td style={tdStyle}>{s.device_id}</td>
          <td style={tdStyle} className="status">
            <span style={{ color: isOffline ? "red" : "green", fontWeight: 600 }}>
              {isOffline ? "OFFLINE" : "ONLINE"}
            </span>
          </td>
          <td style={tdStyle}>
            {!isOffline ? (
              <>
                {s.temperature}
                {s.temperature > 30 && (
                  <span style={{ color: "#e74c3c", marginLeft: "8px" }}>
                    🔥 High Temp Alert!
                  </span>
                )}
              </>
            ) : (
              "--"
            )}
          </td>
          <td style={tdStyle}>
            {!isOffline ? s.avgTemperature : "--"}
          </td>
          <td style={tdStyle}>{s.battery}%</td>
          <td style={tdStyle}>{s.latitude}</td>
          <td style={tdStyle}>{s.longitude}</td>
          <td style={tdStyle}>
            {new Date(s.time).toLocaleString()}
          </td>
          <td style={tdStyle}>
            <button 
              onClick={() => toggleChart(s.device_id)}
              style={buttonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = "#2B00FF"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#2B00FF"}
              disabled={isOffline}
            >
              {visibleCharts[s.device_id] ? "Hide" : "Show"} Chart
            </button>
          </td>
        </tr>
        {visibleCharts[s.device_id] && !isOffline && (
          <tr>
            <td colSpan="9" style={{ padding: "20px", backgroundColor: "#fff" }}>
              <TemperatureChart device_id={s.device_id} />
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  })}
</tbody>
      </table>
    </div>
  );
}
