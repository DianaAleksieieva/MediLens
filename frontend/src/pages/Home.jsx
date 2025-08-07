import React from "react";
import { useNavigate } from "react-router-dom";

const styles = (dark) => ({
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: dark ? "#1e293b" : "#ffc8d0ff", // light pink background
    color: dark ? "#f1f5f9" : "#1e293b",
    fontFamily: "sans-serif",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    background: dark ? "#334155" : "white",  // white container for light mode
    borderRadius: "1rem",
    padding: "3rem 2rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  emoji: {
    fontSize: "5rem",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  description: {
    color: dark ? "#CBD5E1" : "#4A5568",
    fontSize: "1.1rem",
    lineHeight: "1.5",
    marginBottom: "3rem",
  },
  button: {
    width: "100%",
    background: "#FF6B6B",
    color: "white",
    padding: "1rem",
    borderRadius: "9999px",
    fontSize: "1.25rem",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
});

export default function Home({ dark = false }) {
  const navigate = useNavigate();
  const style = styles(dark);

  return (
    <div style={style.container}>
      <div style={style.card}>
        <div style={style.emoji}>💊</div>
        <h1 style={style.title}>PillSense</h1>
        <p style={style.description}>
          Understand what you're taking. Quickly identify pill effects and ingredients with a photo or a few words.
        </p>

        <button
          style={style.button}
          onClick={() => navigate("/input")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e55a5a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF6B6B")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
