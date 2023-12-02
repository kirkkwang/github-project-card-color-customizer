function saveData() {
  // Save the current state of all input groups
  var data = [];
  document.querySelectorAll(".inputs-group").forEach((group) => {
    var repoName = group.querySelector('input[type="text"]').value;
    var color = group.querySelector('input[type="color"]').value;
    if (repoName) {
      data.push({ repoName: repoName, color: color });
    }
  });

  chrome.storage.sync.set({ repoColors: data }, function () {
    console.log("Data saved", data);
  });
}

function createInputGroup() {
  var newInputGroup = document.createElement("div");
  newInputGroup.className = "inputs-group";

  var newTextInput = document.createElement("input");
  newTextInput.type = "text";
  newTextInput.placeholder = "Repository name";
  newTextInput.addEventListener("input", saveData);

  var newColorInput = document.createElement("input");
  newColorInput.type = "color";
  newColorInput.addEventListener("change", saveData);

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

function loadData() {
  chrome.storage.sync.get("repoColors", function (data) {
    if (data.repoColors) {
      data.repoColors.forEach((item) => {
        var newInputGroup = createInputGroup();
        newInputGroup.querySelector('input[type="text"]').value = item.repoName;
        newInputGroup.querySelector('input[type="color"]').value = item.color;
        document.querySelector(".inputs-container").appendChild(newInputGroup);
      });
    }
  });
}

document
  .getElementById("add-inputs-group-button")
  .addEventListener("click", function () {
    var container = document.querySelector(".inputs-container");
    container.appendChild(createInputGroup());
  });

loadData();

function updateStorageAfterRemoval() {
  // Update storage after removal logic
}
