import { useState } from "react";
import "./app.css";

import { useWakeWord } from "./hooks/useWakeWord.js";
import { useCheckServer } from "./hooks/useCheckServer.js";

import { GrantPermissionsButton } from "./components/GrantPermissionsButton";
import { StatusBar } from "./components/StatusBar.jsx";

function App() {
  const [text, setText] = useState("");
  const [wakeword, setWakeWord] = useState(true); //WAKE WORD ENABLE
  // const [recording, setRecording] = useState(false); //RECORDING FOR LLM/TEXT MESSAGE

  const [status, setStatus] = useState("Idle"); // Offline, Idle, Recording, Processing, Error
  const [history, setHistory] = useState([]); // store all transcriptions

  // -- Check if backend is responding --
  useCheckServer({status, setStatus})
  
  // --- Voice recording + Whisper call ---
  const startRecording = async () => {
    try {
    setStatus("Recording");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      // console.log("Data available, size:", e.data.size);
      chunks.push(e.data);
    };

    recorder.onstop = async () => {
      // console.log("Recorder stopped, chunks:", chunks.length);
      setStatus("Processing");
      
      const blob = new Blob(chunks, { type: "audio/webm" });
      // console.log("Blob created, size:", blob.size);

      if (blob.size === 0) {
        console.error("No audio data recorded");
        
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      try {
        // console.log("Sending to backend...");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transcribe`, {
          method: "POST",
          body: formData,
        });

        // console.log("Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Transcription failed:", errorText);
          return;
        }

        const data = await res.json();
        // console.log("Full response:", data);

        const transcript = data.text?.trim();
        console.log("Transcription:", transcript);
        
        if (transcript) {
          // setHistory((prev) => [...prev, { sender: "user", msg: transcript }]);
          await handleSend("user", transcript);

         
        } else {
          console.warn("Empty transcript received");
        }
      } catch (err) {
        console.error("Transcription error:", err);
      } finally {
         // Restart wake word detection after a short delay
          setTimeout(() => {
            setStatus("Idle");
          }, 500);
      }
    };

    recorder.start();
    console.log("Recording started...");

    // --- Setup AudioContext for silence detection ---
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; // Explicit size
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    let silenceStart = null; // Start as null
    const SILENCE_THRESHOLD = 10;
    const SILENCE_DURATION = 3000;
    const MIN_RECORDING_TIME = 1000; // Minimum 1 second recording
    const recordingStartTime = performance.now();

    const checkSilence = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      const recordingTime = performance.now() - recordingStartTime;

      if (average < SILENCE_THRESHOLD) {
        if (silenceStart === null) {
          silenceStart = performance.now();
        }
        
        const silenceDuration = performance.now() - silenceStart;
        
        // Only stop if we've recorded for minimum time AND had silence
        if (recordingTime > MIN_RECORDING_TIME && silenceDuration > SILENCE_DURATION) {
          console.log("Silence detected after", recordingTime, "ms. Stopping...");
          recorder.stop();
          stream.getTracks().forEach((track) => track.stop());
          audioContext.close();
          return;
        }
      } else {
        silenceStart = null; // Reset on sound
      }

      if (recorder.state === "recording") {
        requestAnimationFrame(checkSilence);
      }
    };

    // Start checking immediately
    console.log("Starting silence detection...");
    requestAnimationFrame(checkSilence);
    
  } catch (err) {
    console.error("Recording error:", err);
    setStatus("Idle");
    // setWakeWord(true)
  }
  };

  // --- Wake word detection ---
  useWakeWord({
    startRecording,
    wakeword,
    setWakeWord,
    status,
    setStatus
  });

  // --- Manual text submission ---
  const handleSend = async (sender, text) => {
    if (!text.trim()) return;

    const message = text.trim();
    setHistory((prev) => [...prev, { sender: sender, msg: message }]);
    setText("");


    // ADD LLM COMMAND HERE 
    // Send message to service worker
    // Service worker 
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

      <div className="input-bar">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={status === "Idle" ? false : true }
        />
        <button disabled={status === "Idle" ? false : true } onClick={() => handleSend(text)}>➤</button>
      </div>

      <StatusBar 
        status = {status}
        wakeword = {wakeword}
        setWakeWord = {setWakeWord}
      />

      <GrantPermissionsButton/>
      
    </div>
  );
}

export default App;