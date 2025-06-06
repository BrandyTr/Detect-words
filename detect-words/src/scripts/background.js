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

  // clear all previous 2lai
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

  // unhide word if word is deleted on List page
  else if (request.action === "unhideWord") {
    console.log("Reach unhideWord");
    chrome.scripting.executeScript({
      target: {tabId: request.tabId},
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(request.tabId, {
        action: "unhideWord",
        word: request.word
      }, () => {
        sendResponse({success: true})
      })
    })
    return true
  }
});