import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionAsked, setQuestionAsked] = useState(false);

  const qaMap = {
    "Can I give it to my 8 years old child?":
      "Yes, an 8-year-old can likely take Ibuprofen, but the correct dosage is crucial and depends on their weight. Always follow the instructions on the packaging or consult a doctor or pharmacist.",
    "Can I take it with coffee?":
      "🤖 While I can't give medical advice, here's some general information about taking ibuprofen with or without food: *   If you have a sensitive stomach or have experienced stomach issues with ibuprofen in the past, it's generally recommended to take it with food. * If you need fast pain relief and don't have a history of stomach problems, you can try taking it on an empty stomach, but be mindful of any discomfort.",
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
    toggle: {
      cursor: "pointer",
      float: "right",
      marginBottom: "1rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1.5rem",
      color: dark ? "#93c5fd" : "#FF6B6B",
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
      color: dark ? "#f1f5f9" : "#FF6B6B",
    },
    resultList: {
      marginTop: "0.5rem",
      marginBottom: "1rem",
      paddingLeft: "1.25rem",
      color: dark ? "#e2e8f0" : "#1e293b",
      fontSize: "0.9rem",
    },
    input: {
      background: "#fff",
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
      background: "#FF6B6B",
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
          {dark ? "☀️ Light" : "🌙 Dark"}
        </div>

        <h1 style={styles.title}>🔍 Here's what we found</h1>

        {!questionAsked ? (
          <div style={styles.resultCard}>
            <div style={styles.resultTitle}>Ibuprofen</div>
            <div style={styles.resultList}>
              <b>📋 Directions for Use:</b>
              <p>
                DOSAGE Adults - Take 4 or 6 Pellets by mouth, three times daily
                or as suggested by physician. Children 2 years and older - take
                1/2 the adult dose.
              </p>
              <br />
              <b>⚠️ Warnings:</b>
              <p>
                This product is to be used for self-limiting conditions. If
                symptoms do not improve in 4 days or worsen, discontinue use and
                seek assistance of health professional. As with any drug, if you
                are pregnant or nursing a baby, seek professional advice before
                taking this product. Keep this and all medication out of reach
                of children. Do not use if capseal is broken or missing. Close
                the cap tightly after use.
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Type your question..."
                style={styles.input}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                style={{ ...styles.button, ...styles.askBtn }}
                onClick={() => {
                  const response = qaMap[inputMessage.trim()];
                  setAnswer(
                    response || "Sorry, I don’t have an answer for that yet."
                  );
                  setQuestionAsked(true);
                }}
              >
                Ask
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.resultCard}>
            <div style={styles.resultTitle}>Answer to your question</div>
            <div style={styles.resultList}>
              <b>❓ You asked:</b>
              <p>{inputMessage}</p>
              <b>💬 Answer:</b>
              <p>{answer}</p>
            </div>
            <button
              style={{ ...styles.button, ...styles.askBtn }}
              onClick={() => {
                setQuestionAsked(false);
                setInputMessage("");
                setAnswer("");
              }}
            >
              🔙 Back to pill info
            </button>
          </div>
        )}

        <button
          style={{ ...styles.button, ...styles.backBtn }}
          onClick={() => navigate("/input")}
        >
          🔁 Check another pill
        </button>
      </div>
    </div>
  );
}
