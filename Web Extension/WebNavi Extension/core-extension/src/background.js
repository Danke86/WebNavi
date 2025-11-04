chrome.sidePanel
  .setOptions({ enabled: true })
  .catch((err) => console.error("Side panel setup error:", err));

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});