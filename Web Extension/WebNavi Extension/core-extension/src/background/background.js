chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open landing page on first install
    chrome.tabs.create({ url: chrome.runtime.getURL("landingpage.html") });
  }
});

chrome.sidePanel
  .setOptions({ enabled: true })
  .catch((err) => console.error("Side panel setup error:", err));

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});