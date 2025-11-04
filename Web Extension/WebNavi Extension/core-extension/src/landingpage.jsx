// import { useEffect, useState } from "react";

// export default function LandingPage() {
//   const [permission, setPermission] = useState("pending");

//   useEffect(() => {
//     navigator.permissions
//       ?.query({ name: "microphone" })
//       .then((status) => {
//         setPermission(status.state);
//         status.onchange = () => setPermission(status.state);
//       })
//       .catch(() => setPermission("unknown"));
//   }, []);

//   const requestMic = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//       alert("✅ Microphone permission granted! You can now use WebNavi.");
//       setPermission("granted");
//     } catch (err) {
//       alert("⚠️ Please allow microphone access to use WebNavi.");
//       console.error(err);
//     }
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "Poppins, sans-serif",
//         background: "linear-gradient(135deg, #6366f1, #4338ca)",
//         color: "white",
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         textAlign: "center",
//         padding: "2rem",
//       }}
//     >
//       <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👋 Welcome to WebNavi</h1>
//       <p style={{ fontSize: "1.1rem", maxWidth: "400px", opacity: 0.9 }}>
//         Your voice-powered web assistant. To get started, please allow microphone access so WebNavi can hear your commands.
//       </p>

//       <button
//         onClick={requestMic}
//         style={{
//           backgroundColor: "#ffffff",
//           color: "#4f46e5",
//           fontWeight: "600",
//           border: "none",
//           borderRadius: "10px",
//           padding: "12px 24px",
//           marginTop: "1.5rem",
//           cursor: "pointer",
//           fontSize: "1rem",
//           transition: "transform 0.2s ease",
//         }}
//         onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
//         onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
//       >
//         🎙️ Grant Microphone Access
//       </button>

//       {permission === "granted" && (
//         <p style={{ marginTop: "1rem", fontWeight: "500" }}>
//           ✅ Mic access granted! You can close this tab now.
//         </p>
//       )}
//     </div>
//   );
// }

import React from "react";
import { useEffect, useState } from "react";
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