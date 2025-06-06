let processStuff = {};
let tabStuff = new Map();

/*
setInterval grabs all tabs every 5 seconds and updates the tabStuff Map.
This turns out to be a failure. The id contained here is a system ID, not the tab ID.
This means that the tabStuff Map will not be able to match the tab ID with the process ID.
*/
setInterval(() => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      // console.log(tab);
      
      // console.log(`Tab ID: ${tab.id}, Title: ${tab.title || "IDK"}, URL: ${tab.url || "IDK"}`);
      if (tab.url) {
        tabStuff.set(tab.id, {
          title: tab.title || "IDK",
          url: tab.url,
        });
      }
    }
  });
  
}, 5000);

/*
For each process
  if its renderer process, gathers info, stores cpu, memory, network usage
*/
chrome.processes.onUpdatedWithMemory.addListener((processes) => {
  processStuff = {}; 

  for (const [pid, proc] of Object.entries(processes)) {
    if (!proc || proc.type !== "renderer") continue;    
    
    const tabDetails = [];
    if (Array.isArray(proc.tabs)) {
      for (const tabId of proc.tabs) {
        const info = tabStuff.get(tabId) || {};
        tabDetails.push({
          id: tabId,
          title: info.title || "IDK",
          url: info.url || "",
        });
      }
    }

    processStuff[pid] = {
      cpu: typeof proc.cpu === "number" ? proc.cpu.toFixed(1) : "N/A",
      memory:
        typeof proc.privateMemory === "number"
          ? (proc.privateMemory / (1024 * 1024)).toFixed(1)
          : "N/A",
      network:
        typeof proc.network === "number"
          ? (proc.network / 1024).toFixed(1)
          : "N/A",
      tabs: tabDetails,
    };    
  }
});


//This listener just sends back the populated processStuff object

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "getProcesses") {
    sendResponse(processStuff);
    return true;
  }
});


// Opens the side panel when the extension icon is clicked
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(console.error);
});


