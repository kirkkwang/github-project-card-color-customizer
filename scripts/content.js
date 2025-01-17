console.log("Github Board Colorizer Extension Loaded");
observeBoardChanges() // starts observing board change on load

let globalRepoColorMapping = {};

function observeBoardChanges() {
  const boardNode = document.querySelector(
    '[data-dnd-drop-id="board"]'
  );

  if (!boardNode) return;

  const config = {
    childList: true,
    subtree: true,
    attributes: true, // Observe attribute changes
    attributeFilter: ["aria-disabled", "class"], // Focus on specific attributes
  };

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        applyCustomStyles();
      }
    }
  });

  observer.observe(boardNode, config);
}

function applyCustomStyles() {
  const cards = document.querySelectorAll(
    '.board-view-column-card'
  );

  cards.forEach((card) => {
    const repoSpan = card.querySelector("span");
    if (repoSpan) {
      const repoName = repoSpan.textContent.split(" ")[0];
      const customColor = globalRepoColorMapping[repoName];
      if (customColor) {
        const sanitizedRepoName = sanitizeRepoName(repoName);
        const className = `custom-color-${sanitizedRepoName}-${customColor.replace(
          "#",
          ""
        )}`;
        const firstChildDiv = card.querySelector("div:first-child"); // Targeting the first child div of the card
        if (firstChildDiv) {
          firstChildDiv.classList.add(className);
          injectStyle(className, customColor);
        }
      }
    }
  });
}

function injectStyle(className, color) {
  // Use a data attribute to mark your style tags
  const styleId = `style-for-${className}`;

  if (!document.head.querySelector(`style[data-style-id="${styleId}"]`)) {
    const style = document.createElement("style");
    style.setAttribute("data-style-id", styleId); // Set the data attribute
    style.textContent = `.${className} { background-color: ${color} !important; }`;
    document.head.append(style);
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "updateStyles") {
    globalRepoColorMapping = message.data.reduce((acc, item) => {
      acc[item.repoName] = item.color;
      return acc;
    }, {});

    applyCustomStyles();
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "updateStylesAfterRemoval") {
    // Update globalRepoColorMapping
    globalRepoColorMapping = message.data.reduce((acc, item) => {
      acc[item.repoName] = item.color;
      return acc;
    }, {});

    // Remove the old style and update affected cards
    removeOldStyleAndApplyNewStyles(globalRepoColorMapping);
  }
});

// Load and apply user preferences
chrome.storage.sync.get("repoColors", function (data) {
  if (data.repoColors) {
    globalRepoColorMapping = data.repoColors.reduce((acc, item) => {
      acc[item.repoName] = item.color;
      return acc;
    }, {});

    applyCustomStyles();
    observeBoardChanges();
  }
});

function sanitizeRepoName(repoName) {
  return repoName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
}

function removeOldStyleAndApplyNewStyles(repoColorMapping) {
  // Remove all injected styles related to repo colors
  document
    .querySelectorAll('style[data-style-id^="style-for-custom-color"]')
    .forEach((styleTag) => {
      styleTag.remove();
    });

  // Remove classes from cards and reapply styles
  document
    .querySelectorAll('[data-testid="board-view-column-card"] div:first-child')
    .forEach((cardDiv) => {
      Array.from(cardDiv.classList).forEach((className) => {
        if (className.startsWith("custom-color-")) {
          cardDiv.classList.remove(className);
        }
      });
    });

  // Reapply styles with updated color mapping
  applyCustomStyles();
}
