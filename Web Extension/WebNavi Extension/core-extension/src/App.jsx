import { useState, useEffect } from "react";
import { GrantPermissionsButton } from "./components/GrantPermissionsButton";
import "./app.css";

function App() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(true);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [history, setHistory] = useState([]); // store all transcriptions

  // -- Check if backend is responding --
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ping`);
        if (res.ok) {
          setStatus("Idle"); // server is online
        } else {
          setStatus("Offline");
        }
      } catch (err) {
        console.log(err)
        setStatus(`Offline`); // server unreachablew
      }
    };

    checkServer(); // check immediately
    const interval = setInterval(checkServer, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // --- Wake word detection ---
  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
      console.log(transcript)
      if (transcript.includes("hey navi") || transcript.includes("hey nabi") || transcript.includes("hi nabi") || transcript.includes("hi navi") || transcript.includes("hay navi")) {
        startRecording();
      }
    };

    recognition.onerror = (e) => console.error("Wake-word error:", e);

    if (listening) recognition.start();
    else recognition.stop();

    return () => recognition.stop();
  }, [listening]);

  // --- Voice recording + Whisper call ---
  const startRecording = async () => {
    try {
      setListening(false);
      setStatus("Recording...");
      setRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      // --- Setup AudioContext for silence detection ---
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      const dataArray = new Uint8Array(analyser.fftSize);
      source.connect(analyser);

      let silenceStart = performance.now();
      const SILENCE_THRESHOLD = 10; // volume level (0–255)
      const SILENCE_DURATION = 3000; // 3 seconds of silence

      // Function to check for silence
      const checkSilence = () => {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (average < SILENCE_THRESHOLD) {
          // Low volume
          if (performance.now() - silenceStart > SILENCE_DURATION) {
            console.log("Silence detected. Stopping recorder...");
            recorder.stop();
            stream.getTracks().forEach((track) => track.stop());
            audioContext.close();
            return;
          }
        } else {
          silenceStart = performance.now(); // Reset timer if sound is detected
        }

        requestAnimationFrame(checkSilence);
      };

      checkSilence();

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        setStatus("Processing...");
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");

        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transcribe`, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          const transcript = data.text?.trim();

          if (transcript) {
              setHistory((prev) => [...prev, { sender: "user", msg: transcript }]);

              const reply = await handleSend(transcript);
            }
        } catch (err) {
          console.error("Transcription error:", err);
          setStatus("Error");
        } finally {
          setRecording(false);
          setStatus("Idle");
          setListening(true);
        }
      };

      recorder.start();
      console.log("Recording started...");
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setRecording(false);
      setListening(true);
    }
  };

  // --- Manual text submission ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const message = text.trim();
    setHistory((prev) => [...prev, { sender: "user", msg: message }]);
    setText("");
  };

   return (
    <div className="app-container">
      <h2 className="app-title">WebNavi</h2>

      <div className="chat-box">
        {history.length === 0 ? (
          <div className="placeholder">Say “Hey Navi” or type below to begin...</div>
        ) : (
          history.map((entry, i) => (
            <div
              key={i}
              className={`chat-bubble ${entry.sender === "user" ? "user" : "bot"}`}
            >
              {entry.msg}
            </div>
          ))
        )}
      </div>

      <form className="input-bar" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={recording}
        />
        <button type="submit">➤</button>
      </form>
      
      <div className="status-bar">
        <div className="status-indicator">
          <div className={`status-dot ${recording ? "recording" : status.toLowerCase()}`}></div>
          <span className="status-txt">{status}</span>
        </div>
        <button
          className={`wake-toggle ${listening ? "on" : "off"}`}
          onClick={() => setListening(!listening)}
        >
          {listening ? "Wake: ON" : "Wake: OFF"}
        </button>
      </div>

      <GrantPermissionsButton/>
      
    </div>
  );
}

export default App;