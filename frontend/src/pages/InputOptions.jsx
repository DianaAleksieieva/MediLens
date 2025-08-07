import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InputOptions() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const [pillName, setPillName] = useState("");
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const triggerFile = () => fileRef.current.click();
  const triggerCamera = () => cameraRef.current.click();

  const handleImage = (e, source) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgURL = URL.createObjectURL(file);
    setPreview(imgURL);
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      setLoading(false);
      setMessage(`${source} uploaded. Simulating analysis...`);
    }, 1500);
  };

  const handleSubmit = () => {
  if (!pillName && !preview) return;
  setLoading(true);
  setMessage("");

  setTimeout(() => {
    const msg = pillName ? `Searching for "${pillName}"` : "Analyzing image...";
    setLoading(false);
    if (pillName) setHistory((prev) => [...prev, pillName]);
    navigate("/result");
  }, 1500);
};


  const handleReset = () => {
    setPillName("");
    setPreview(null);
    setMessage("");
    setHistory([]);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "2rem",
      background: dark ? "#1e293b" : "#ffc8d0ff",
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
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1rem",
    },
    button: {
      background: "#e5e7eb",
      border: "none",
      borderRadius: "0.75rem",
      padding: "0.75rem 1.5rem",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    submitBtn: {
      background: "#FF6B6B",
      color: "white",
    },
    resetBtn: {
      background: dark ? "#475569" : "#e2e8f0",
      color: dark ? "#f8fafc" : "#1e293b",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1rem",
      borderRadius: "0.5rem",
      border: "1px solid #cbd5e1",
    },
    preview: {
      maxHeight: "200px",
      marginBottom: "1rem",
      borderRadius: "1rem",
    },
    message: {
      background: dark ? "#475569" : "#fef3c7",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
    },
    toggle: {
      cursor: "pointer",
      float: "right",
      marginBottom: "1rem",
    },
    history: {
      marginTop: "1.5rem",
    },
    historyItem: {
      fontSize: "0.875rem",
      marginBottom: "0.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.toggle} onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </div>
        <h1 style={styles.title}>MediLens</h1>

        {preview && <img src={preview} alt="Preview" style={styles.preview} />}
        {message && <div style={styles.message}>{message}</div>}
        {loading && <div>⏳ Loading...</div>}

        <button style={styles.button} onClick={triggerCamera}>
          📷 Take Photo
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => handleImage(e, "Camera")}
        />

        <button style={styles.button} onClick={triggerFile}>
          📁 Upload File
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleImage(e, "File")}
        />

        <div style={{ textAlign: "center", margin: "1rem 0", color: dark ? "#94a3b8" : "#64748b" }}>
          or
        </div>

        <input
          type="text"
          placeholder="Type pill name..."
          style={styles.input}
          value={pillName}
          onChange={(e) => setPillName(e.target.value)}
        />

        <button
          style={{ ...styles.button, ...styles.submitBtn }}
          onClick={handleSubmit}
          disabled={loading || (!pillName && !preview)}
        >
          🔍 Submit
        </button>

        <button
          style={{ ...styles.button, ...styles.resetBtn }}
          onClick={handleReset}
        >
          🔄 Reset
        </button>

        {history.length > 0 && (
          <div style={styles.history}>
            <strong>Search History:</strong>
            {history.map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                • {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
