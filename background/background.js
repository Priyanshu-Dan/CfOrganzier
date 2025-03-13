chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background script:", request);
  
    // Handle different actions
    switch (request.action) {
      case "logMessage":
        console.log("Logging message:", request.message);
        sendResponse({ status: "success", message: "Message logged successfully!" });
        break;
  
      case "fetchData":
        fetch("https://codeforces.com/api/problemset.problems")
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetched data:", data);
            sendResponse({ status: "success", data: data });
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            sendResponse({ status: "error", error: error.message });
          });
        return true; 
  
      default:
        sendResponse({ status: "error", message: "Unknown action" });
    }
  });
  
 
  chrome.alarms.create("fetchProblems", { periodInMinutes: 5 });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "fetchProblems") {
      console.log("Fetching problems from Codeforces API...");
      fetch("https://codeforces.com/api/problemset.problems")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched problems:", data);
          // Store the data in chrome.storage.local
          chrome.storage.local.set({ problems: data }, () => {
            console.log("Problems stored in chrome.storage.local");
          });
        })
        .catch((error) => {
          console.error("Error fetching problems:", error);
        });
    }
  });