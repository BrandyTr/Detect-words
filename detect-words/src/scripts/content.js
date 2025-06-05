chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Reach content.js");
  console.log({ request, words: request.words });
  if (request.action === "hideMultipleWords") {
    const words = request.words;

    if (!Array.isArray(words) || words.length === 0) return;

    // Build one big regex: \b(word1|word2|word3)\b
    const escapedWords = words.map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");

    function walk(node) {
      if (node.nodeType === 3) {
        const matches = node.textContent.match(regex);
        if (matches) {
          const span = document.createElement("span");
          span.innerHTML = node.textContent.replace(
            regex,
            (match) => `<s>${match}</s>`
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
    sendResponse({ success: true });
    return true;
  }
  if (request.action === "findMultipleWords") {
    const words = request.words;
    let count = 0;

    if (!Array.isArray(words) || words.length === 0) return;

    // Build one big regex: \b(word1|word2|word3)\b
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
          span.innerHTML = node.textContent.replace(
            regex,
            (match) => `<mark>${match}</mark>`
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
});
