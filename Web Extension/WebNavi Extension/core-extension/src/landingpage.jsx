import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";

export default function LandingPage() {
    const [permission, setPermission] = useState("pending");

    const requestMic = async () => {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        alert("✅ Microphone permission granted! You can now use WebNavi.");
        setPermission("granted");
    } catch (err) {
        alert("⚠️ Please allow microphone access to use WebNavi.");
        console.error(err);
    }
    };

    return (
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontFamily: "Poppins, sans-serif",
            background: "#f3f4f6",
        }}
        >
        <h1>Welcome to WebNavi 👋</h1>
        <p>Click below to grant microphone permission.</p>
        <button
            style={{
            marginTop: "1rem",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
            }}
            onClick={requestMic}
        >
            Grant Microphone Access
        </button>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>
);