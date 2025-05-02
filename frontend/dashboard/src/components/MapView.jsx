import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ sensors }) {
  const user = JSON.parse(localStorage.getItem("user")); 

  const filteredSensors = user?.role === "Staff"
    ? sensors.filter(s => s.device_id === user.device_alloted)
    : sensors;
  return (
    <MapContainer center={[20, 78]} zoom={2} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {filteredSensors.map((sensor) => (
        <Marker
          key={sensor.device_id}
          position={[sensor.latitude, sensor.longitude]}
          icon={DefaultIcon}
        >
          <Popup>
            {sensor.device_id}<br />Temp: {sensor.temperature}°C
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
