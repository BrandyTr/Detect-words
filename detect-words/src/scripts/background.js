chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "injectAndHide") {
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(request.tabId, {
        action: "hideMultipleWords",
        words: request.words
      });
    });
    return true; 
  }
  
  else if (request.action === "injectAndFind") {
    console.log("Reach injectandFind")
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(request.tabId, {
        action: "findMultipleWords",
        words: request.words
      },(response)=>{
        sendResponse(response)
      });
    });
    return true; 
  }

  else if (request.action === "clearHighlights") {
    console.log("Reach clearHighlights");
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(request.tabId, {
        action: "clearHighlights"
      }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});