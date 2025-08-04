import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "2rem",
      background: dark ? "#1e293b" : "#fff",
      color: dark ? "#f1f5f9" : "#1e293b",
      fontFamily: "sans-serif",
      transition: "all 0.3s ease",
    },
    card: {
      maxWidth: "500px",
      margin: "0 auto",
      background: dark ? "#334155" : "#f8fafc",
      borderRadius: "1rem",
      padding: "2rem",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    },
    toggle: {
      cursor: "pointer",
      float: "right",
      marginBottom: "1rem",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1.5rem",
      color: dark ? "#93c5fd" : "#dc2626",
    },
    resultCard: {
      background: dark ? "#475569" : "#fef2f2",
      border: "1px solid",
      borderColor: dark ? "#64748b" : "#fecaca",
      padding: "1rem",
      borderRadius: "1rem",
      marginBottom: "1.5rem",
    },
    resultTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: dark ? "#f1f5f9" : "#dc2626",
    },
    resultList: {
      marginTop: "0.5rem",
      paddingLeft: "1.25rem",
      color: dark ? "#e2e8f0" : "#1e293b",
      fontSize: "0.9rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.75rem",
      border: "1px solid #cbd5e1",
      marginBottom: "1rem",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      fontWeight: "bold",
      borderRadius: "0.75rem",
      cursor: "pointer",
      transition: "0.2s",
      marginBottom: "1rem",
    },
    askBtn: {
      background: "#dc2626",
      color: "#fff",
    },
    backBtn: {
      background: "#2dd4bf",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.toggle} onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </div>

        <h1 style={styles.title}>🔍 Here's what we found</h1>

        <div style={styles.resultCard}>
          <div style={styles.resultTitle}>Ibuprofen</div>
          <ul style={styles.resultList}>
            <li>Active ingredient: Ibuprofen 200mg</li>
            <li>Anti-inflammatory</li>
            <li>Pain relief, fever reducer</li>
          </ul>
        </div>

        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>
            💬 Have a follow-up question?
          </label>
          <input type="text" placeholder="Type your question..." style={styles.input} />
          <button style={{ ...styles.button, ...styles.askBtn }}>Ask</button>
        </div>

        <button
          style={{ ...styles.button, ...styles.backBtn }}
          onClick={() => navigate("/")}
        >
          🔁 Check another pill
        </button>
      </div>
    </div>
  );
}
