function createInputGroup() {
  var newInputGroup = document.createElement("div");
  newInputGroup.className = "inputs-group";

  var newTextInput = document.createElement("input");
  newTextInput.type = "text";
  newTextInput.placeholder = "Repository name";

  var newColorInput = document.createElement("input");
  newColorInput.type = "color";
  newColorInput.addEventListener("change", function () {
    var repoName = newTextInput.value;
    var chosenColor = newColorInput.value;
    // Save the repo name and chosen color to storage
    console.log("Saving:", repoName, chosenColor); // For testing
  });

  var newRemoveButton = document.createElement("button");
  newRemoveButton.className = "remove-button";
  newRemoveButton.innerHTML = "&times;"; // Using HTML entity for 'X'
  newRemoveButton.addEventListener("click", function () {
    newInputGroup.remove();
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

document.querySelector(".inputs-container").appendChild(createInputGroup()); // Add the initial input group
