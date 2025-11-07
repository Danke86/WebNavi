// --- Ask mic permission manually (required on first popup open) ---
  const requestMicAccess = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    alert("Microphone access already granted!");
  } catch (err) {
    chrome.tabs.create({ url: chrome.runtime.getURL("landingpage.html") });
  }
  };

function GrantPermissionsButton() {
    return (
        <button className="mic-btn" onClick={requestMicAccess}>
        🎙️ Grant Permissions
      </button>
    )
}

export { GrantPermissionsButton }