import React, { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(username, password);
      console.log(result)
      setMessage(result.msg);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
      <form onSubmit={handleSignup} style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#2c3e50",
          marginBottom: "1rem",
          fontSize: "1.8rem"
        }}>
          Create Account
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={{
              padding: "0.8rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              transition: "border-color 0.3s",
              outline: "none"
            }}
          />
          
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            style={{
              padding: "0.8rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              transition: "border-color 0.3s",
              outline: "none"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.8rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.3s"
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#45a049"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#4CAF50"}
        >
          Sign Up
        </button>

        {message && <p style={{ 
          color: message.includes("success") ? "#2ecc71" : "#e74c3c",
          textAlign: "center", 
          margin: "0.5rem 0",
          fontSize: "0.9rem"
        }}>{message}</p>}

        <div style={{ 
          textAlign: "center", 
          marginTop: "1rem",
          color: "#7f8c8d"
        }}>
          Already have an account? 
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              marginLeft: "0.5rem",
              backgroundColor: "transparent",
              border: "none",
              color: "#3498db",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "color 0.3s"
            }}
            onMouseOver={e => e.currentTarget.style.color = "#2980b9"}
            onMouseOut={e => e.currentTarget.style.color = "#3498db"}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}
