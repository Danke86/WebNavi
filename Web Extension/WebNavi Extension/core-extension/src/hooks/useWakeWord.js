import { useRef, useEffect } from "react";

export function useWakeWord({ listening, recording, status, startRecording, setStatus, setListening }) {

  // --- Wake word detection ---
  useEffect(() => {
    // if processing or offline, skip wake word
    // if (status === "Processing" || status === "Offline") return;

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

}