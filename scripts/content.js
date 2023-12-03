console.log("Github Board Colorizer Extension Loaded");

let globalRepoColorMapping = {};

function observeBoardChanges() {
  const boardNode = document.querySelector('[data-testid="board-view"]');
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
    '[data-testid="board-view-column-card"]'
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

  console.log(
    `className: ${className}, style: .${className} { background-color: ${color} !important; }`
  );

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
