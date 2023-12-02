console.log("Github Board Colorizer Extension Loaded");

function observeBoardChanges(repoColorMapping) {
  // Select the node that will be observed for mutations
  const boardNode = document.querySelector(
    '[data-testid="board-view"]'
  );

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        applyCustomStyles(repoColorMapping);
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  if (boardNode) {
    observer.observe(boardNode, config);
  }
}

function applyCustomStyles(repoColorMapping) {
  const cards = document.querySelectorAll(
    '[data-testid="board-view-column-card"]'
  );

  cards.forEach((card) => {
    const repoSpan = card.querySelector("span"); // Finds the first span that should contain the repo name
    if (repoSpan) {
      const repoText = repoSpan.textContent.split(" ")[0]; // Extracting repo name
      const customColor = repoColorMapping[repoText];
      if (customColor) {
        // Find the first div within the card
        const targetDiv = card.querySelector("div");
        if (targetDiv) {
          targetDiv.style.backgroundColor = customColor; // Apply custom color
        }
      }
    }
  });
}

// Load and apply user preferences
chrome.storage.sync.get("repoColors", function (data) {
  if (data.repoColors) {
    let repoColorMapping = data.repoColors.reduce((acc, item) => {
      acc[item.repoName] = item.color;
      return acc;
    }, {});

    applyCustomStyles(repoColorMapping);
    observeBoardChanges(repoColorMapping);
  }
});
