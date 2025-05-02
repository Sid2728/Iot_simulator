import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_BASE_API;
console.log(API_BASE)

export const fetchReadings = async () => {
  const res = await axios.get(`${API_BASE}/latest`);
  console.log(res)
  return res.data;
};

export const fetchAverageValue = async () =>{
  const res = await axios.get(`${API_BASE}/average`);
  return res.data;
}

export const fetchAllReadings = async ()=>{
  const res = await axios.get(`${API_BASE}/all`);
  return res.data;
}

export const fetchSensorHistory = async (device_id) => {
    const res = await fetch(`${API_BASE}/history/${device_id}`);
    return await res.json();
  };
  

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
  return await response.json(); 
}

export const signup= async (username, password)=> {
  const response = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Signup failed");
  }

  return await response.json();
}

export function logout() {
  localStorage.removeItem("token");
}