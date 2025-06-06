chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Reach content.js");
  console.log({ request, words: request.words });

  if (request.action === "hideMultipleWords") {
    const words = request.words;

    if (!Array.isArray(words) || words.length === 0) return;

    const escapedWords = words.map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");

    function walk(node) {
      if (node.nodeType === 3) {
        const matches = node.textContent.match(regex);
        if (matches) {
           node.parentNode.style.display = "none";
        }
      } else if (
        node.nodeType === 1 &&
        node.childNodes &&
        !["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.nodeName)
      ) {
        for (let i = 0; i < node.childNodes.length; i++) {
          walk(node.childNodes[i]);
        }
      }
    }

    walk(document.body);
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "findMultipleWords") {
    const words = request.words;
    let count = 0;

    if (!Array.isArray(words) || words.length === 0) return;

    const escapedWords = words.map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");

    function walk(node) {
      if (node.nodeType === 3) {
        const matches = node.textContent.match(regex);
        if (matches) {
          count += matches.length;
          const span = document.createElement("span");
          // hanged from <mark> to <mark class="highlighted-word"> for easier clearing
          span.innerHTML = node.textContent.replace(
            regex,
            (match) => `<mark class="highlighted-word">${match}</mark>`
          );
          node.parentNode.replaceChild(span, node);
        }
      } else if (
        node.nodeType === 1 &&
        node.childNodes &&
        !["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.nodeName)
      ) {
        for (let i = 0; i < node.childNodes.length; i++) {
          walk(node.childNodes[i]);
        }
      }
    }

    walk(document.body);
    console.log({ count });
    sendResponse({ count });
    return true;
  }

  // Clear all highlights
  if (request.action === "clearHighlights") {
    console.log("Clearing highlights...");

    const highlights = document.querySelectorAll("mark.highlighted-word");
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      const textNode = document.createTextNode(highlight.textContent);
      parent.replaceChild(textNode, highlight);
      parent.normalize(); // Merge text nodes
    });

    sendResponse({ success: true });
    return true;
  }
});

function hideWords(words) {
  const escapedWords = words.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");

  function walk(node) {
    if (node.nodeType === 3) {
      const matches = node.textContent.match(regex);
      if (matches) {
        const container = node.parentNode.closest('div') || node.parentNode;
        container.style.display = "none"; 
      }
    } else if (
      node.nodeType === 1 &&
      node.childNodes &&
      !["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.nodeName)
    ) {
      for (let i = 0; i < node.childNodes.length; i++) {
        walk(node.childNodes[i]);
      }
    }
  }

  walk(document.body);

  // Observe future DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          walk(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// 🧠 Khi content.js load, tự lấy từ storage
chrome.storage.sync.get(['savedWords_v2'], (result) => {
  const savedWords = result.savedWords_v2 || [];
  const allWords = savedWords.flatMap(w => [w.word, ...w.variants]);
  
  if (allWords.length > 0) {
    hideWords(allWords);
  }
});
