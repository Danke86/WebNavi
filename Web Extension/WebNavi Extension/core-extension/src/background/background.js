const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL

function initializeExtension(){
  setupEventListeners()


}

function setupEventListeners(){
  //First install listener
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      // Open landing page on first install
      chrome.tabs.create({ url: chrome.runtime.getURL("landingpage.html") });
    }
  });

  // Opening Side Panel
  chrome.sidePanel
    .setOptions({ enabled: true })
    .catch((err) => console.error("Side panel setup error:", err));

  chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
  });

  //attach to a 


}

initializeExtension()