import { useEffect, useRef } from "react";

export function useWakeWord({ startRecording, wakeword, setWakeWord, status, setStatus}) {

    const statusRef = useRef(status);

    // Keep statusRef updated, but don't re-run effect
    useEffect(() => {
        statusRef.current = status;
        console.log("Current status: ", status)
    }, [status]);

    // --- Wake word detection ---
    useEffect(() => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = "en-US";
        recognition.interimResults = false

        recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
        // console.log(transcript)
        if(statusRef.current === "Idle"){
            if (transcript.includes("hey navi") || transcript.includes("hey nabi") || transcript.includes("hi nabi") || transcript.includes("hi navi") || transcript.includes("hay navi")) {
                startRecording();
            }
        }
        };

        recognition.onerror = (e) => console.error("Wake-word error:", e);
        // console.log("Current status in useEffect: ", status)

        recognition.onend = () => {
            // console.log("Wake word recognition ended");

            // Restart if still enabled and status is Idle
            if (wakeword && statusRef.current === "Idle") {
                // console.log("Restarting wake word recognition...");
                setTimeout(() => {
                try {
                    recognition.start();
                } catch (err) {
                    console.warn("Recognition restart failed:", err.message);
                }
                }, 100);
            }
        };

        if (wakeword) recognition.start();
        else recognition.stop();

        return () => recognition.stop();
    }, [wakeword]);

}

