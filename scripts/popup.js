function loadData() {
  chrome.storage.sync.get("repoColors", function (data) {
    if (data.repoColors) {
      data.repoColors.forEach((item) => {
        // Create a new input group with saved data
        var newInputGroup = createInputGroup();
        newInputGroup.querySelector('input[type="text"]').value = item.repoName;
        newInputGroup.querySelector('input[type="color"]').value = item.color;
        document.querySelector(".inputs-container").appendChild(newInputGroup);
      });
    }
  });
}

// Call loadData when the popup opens
loadData();

function createInputGroup() {
  var newInputGroup = document.createElement("div");
  newInputGroup.className = "inputs-group";

  var newTextInput = document.createElement("input");
  newTextInput.type = "text";
  newTextInput.placeholder = "Repository name";
  newTextInput.addEventListener("input", function () {
    saveData(); // Call saveData when the text input changes
  });

  var newColorInput = document.createElement("input");
  newColorInput.type = "color";
  newColorInput.addEventListener("change", saveData); // Keep this to save on color change

  var newRemoveButton = document.createElement("button");
  newRemoveButton.className = "remove-button";
  newRemoveButton.innerHTML = "&times;";
  newRemoveButton.addEventListener("click", function () {
    newInputGroup.remove();
    updateStorageAfterRemoval();
  });

  newInputGroup.appendChild(newTextInput);
  newInputGroup.appendChild(newColorInput);
  newInputGroup.appendChild(newRemoveButton);

  return newInputGroup;
}

document
  .getElementById("add-inputs-group-button")
  .addEventListener("click", function () {
    var container = document.querySelector(".inputs-container");
    container.appendChild(createInputGroup());
  });

newTextInput.addEventListener("input", function () {
  var repoName = newTextInput.value;
  var chosenColor = newColorInput.value; // This will be black by default
  saveData(repoName, chosenColor);
});

function saveData() {
  var data = [];
  document.querySelectorAll(".inputs-group").forEach((group) => {
    var repoName = group.querySelector('input[type="text"]').value;
    var color = group.querySelector('input[type="color"]').value;
    if (repoName) {
      // Only save if there is a repo name
      data.push({ repoName: repoName, color: color });
    }
  });

  chrome.storage.sync.set({ repoColors: data }, function () {
    console.log("Data saved", data);
  });
}

// Attach saveData to color input change event
document
  .querySelectorAll('.inputs-group input[type="color"]')
  .forEach((input) => {
    input.addEventListener("change", saveData);
  });

function updateStorageAfterRemoval() {
  var data = [];
  document.querySelectorAll(".inputs-group").forEach((group) => {
    var repoName = group.querySelector('input[type="text"]').value;
    var color = group.querySelector('input[type="color"]').value;
    if (repoName) {
      // Check if repo name is not empty
      data.push({ repoName: repoName, color: color });
    }
  });

  chrome.storage.sync.set({ repoColors: data }, function () {
    console.log("Updated data after removal", data);
  });
}
