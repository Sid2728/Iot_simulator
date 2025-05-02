import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchSensorHistory } from "../api";
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend);

export default function TemperatureChart({ device_id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getHistory = async () => {
      const res = await fetchSensorHistory(device_id);
      
      const sortedData = [...res].sort((a, b) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      
      setData(sortedData);
    };

    getHistory();
    const interval = setInterval(getHistory, 20000);
    return () => clearInterval(interval);
  }, [device_id]);

  const chartData = {
    datasets: [{
      id: `temp-${device_id}`, 
      label: "Temperature (°C)",
      data: data.map(d => ({
        x: new Date(d.time), 
        y: d.temperature
      })),
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1
    }]
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute"
        },
        title: {
          display: true,
          text: "Time"
        }
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)"
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  return (
    <div style={{ height: "50vh" }}>
      <Line data={chartData} options={options} datasetIdKey="id" />
    </div>
  );
}
