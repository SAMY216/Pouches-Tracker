let addBtn = document.querySelector(
  ".add-menu .contents .contents-container .add-btn"
);
let inputContainer = document.querySelector(
  ".add-menu .contents .contents-container .number-of-contents"
);
let removeItemBtn = document.querySelector(
  ".add-menu .contents .contents-container .remove-btn"
);

// Add new text box in add-menu (More content in the pouch)
addBtn.addEventListener("click", () => {
  let newTextInput = document.createElement("input");
  newTextInput.setAttribute("type", "text");
  inputContainer.append(newTextInput);

  if (inputContainer.childElementCount >= 1) {
    removeItemBtn.removeAttribute("style");
  }
});

// Remove last text box in add-menu && Toggle remove button itself
removeItemBtn.addEventListener("click", () => {
  if (!inputContainer.childElementCount < 1) {
    inputContainer.removeChild(inputContainer.lastChild);
  }
  if (inputContainer.childElementCount == 1) {
    removeItemBtn.setAttribute("style", "display: none;");
  }
});

let mainAddBtn = document.querySelector(
  ".controls .container .controls-content .add"
);
let addMenu = document.querySelector(".add-menu");
let overlay = document.querySelector(".overlay");

// Hide add-menu when clicking out of it (on the overlay)
mainAddBtn.addEventListener("click", () => {
  overlay.removeAttribute("style");
  addMenu.removeAttribute("style");
});

// Close add-menu when clicking outside
overlay.addEventListener("click", () => {
  addMenu.style.display = "none";
  overlay.style.display = "none";
});

let dateRadioInput = document.querySelector(
  ".add-menu .date-picker .choices .date"
);
let todayRadioInput = document.querySelector(
  ".add-menu .date-picker .choices .today"
);
let inputDatePicker = document.querySelector(
  ".add-menu .date-picker .input-date-picker"
);
let computedStyle = getComputedStyle(inputDatePicker);

// Toggle date input whether today or a previous day
todayRadioInput.addEventListener("click", () => {
  if (computedStyle.display !== "none") {
    inputDatePicker.style.display = "none";
  }
});
dateRadioInput.addEventListener("click", () => {
  if (computedStyle.display !== "block") {
    inputDatePicker.style.display = "block";
  }
});

let addBtnInsideMenu = document.querySelector(".add-menu .add-new-pouch");
let arrPouchData = [];
let smallChoice = document.querySelector(
  ".add-menu .size-picker .choices .small"
);
let mediumChoice = document.querySelector(
  ".add-menu .size-picker .choices .medium"
);
let largeChoice = document.querySelector(
  ".add-menu .size-picker .choices .large"
);
// Set local storage for id
let id = 0;
if (!localStorage.getItem("id")) {
  localStorage.setItem("id", "0");
  id = 0;
} else id = parseInt(localStorage.getItem("id"));

// Add the new pouch to the local storage
addBtnInsideMenu.addEventListener("click", () => {
  if (
    inputContainer.firstElementChild.value.trim() &&
    (inputDatePicker.value || todayRadioInput.checked)
  ) {
    // Push id of the registered pouch into the array && set the new id value in the local storage
    arrPouchData.push((++id).toString());
    localStorage.setItem("id", id.toString());

    // Push pouch size value into the array
    if (smallChoice.checked) arrPouchData.push("Small");
    else if (mediumChoice.checked) arrPouchData.push("Medium");
    else if (largeChoice.checked) arrPouchData.push("Large");

    // Push date of the registered pouch into the array
    if (todayRadioInput.checked) {
      var utc = new Date().toJSON().slice(0, 10);
      arrPouchData.push(utc);
    } else if (dateRadioInput.checked) arrPouchData.push(inputDatePicker.value);

    // Push content of the registered pouch into the array
    let arrayOfContent = [];
    for (let i = 0; i < inputContainer.children.length; i++) {
      let inputElement = inputContainer.children[i];
      if (inputElement.value !== undefined && inputElement.value !== "") {
        if (inputElement.value.trim() == "") continue;
        arrayOfContent.push(inputElement.value);
      }
    }
    arrPouchData.push(arrayOfContent);

    // Reset add-menu and exit it
    inputDatePicker.value = "";
    for (let i = 0; i < inputContainer.children.length; i++) {
      let inputElement = inputContainer.children[i];
      inputElement.value = "";
    }
    addMenu.style.display = "none";
    overlay.style.display = "none";
    let numberOfInputs = inputContainer.children.length;
    if (numberOfInputs >= 3)
      for (let i = 1; i <= numberOfInputs - 2; i++)
        inputContainer.removeChild(inputContainer.lastChild);

    // Set local storage for the pouches data
    localStorage.setItem(`pouch-data-${id}`, JSON.stringify(arrPouchData));

    // Pop up an alert to the user with the id of the newly registered pouch
    alert(`Pouch id is:    ${id.toString()}
    please write it down on the pouch`);

    // Reset arrays
    arrPouchData = [];
    arrayOfContent = [];

    window.location.reload();
  } else alert("Please fill all the required data");
});

// Fill the page content from local storage
let table = document.querySelector(".pouches .container table");
if (localStorage.length > 1) {
  for (let i = 1; i <= JSON.parse(localStorage.getItem("id")); i++) {
    let arrRetrievedData = JSON.parse(localStorage.getItem(`pouch-data-${i}`));
    if (arrRetrievedData == null) continue;
    console.log(arrRetrievedData);

    let pouchId = arrRetrievedData[0];
    let pouchSize = arrRetrievedData[1];
    let pouchDate = arrRetrievedData[2];
    let pouchContent = arrRetrievedData[3];

    let tr = document.createElement("tr");
    let tdCheckbox = document.createElement("td");
    let divInsideTd = document.createElement("div");
    let labelInsideDiv = document.createElement("label");
    let inputInsideLabel = document.createElement("input");
    inputInsideLabel.setAttribute("type", "checkbox");
    let divInsideLabel = document.createElement("div");

    labelInsideDiv.append(inputInsideLabel);
    labelInsideDiv.append(divInsideLabel);
    divInsideTd.append(labelInsideDiv);
    tdCheckbox.append(divInsideTd);
    tr.append(tdCheckbox);

    let tdId = document.createElement("td");
    tdId.append(pouchId);
    tr.append(tdId);

    let tdSize = document.createElement("td");
    tdSize.append(pouchSize);
    tr.append(tdSize);

    let tdDate = document.createElement("td");
    tdDate.append(pouchDate);
    tr.append(tdDate);

    let tdContent = document.createElement("td");
    for (let i = 0; i < pouchContent.length; i++) {
      let pInsideTd = document.createElement("p");
      pInsideTd.append(pouchContent[i]);
      tdContent.append(pInsideTd);
    }
    tr.append(tdContent);

    table.append(tr);
  }
}

// Remove button
let removeBtn = document.querySelector(
  ".controls .container .controls-content .remove"
);
let inputs = document.querySelectorAll(
  ".pouches .container table tr td div label input"
);
let trTarget = document.querySelectorAll(
  ".pouches .container table tr td:nth-child(2)"
);
removeBtn.addEventListener("click", () => {
  if (table.children.length > 1) {
    if (
      window.confirm("Are you sure you want to delete the selected pouches?")
    ) {
      inputs.forEach((e, index) => {
        if (e.checked) {
          let idDelete = trTarget[index].innerHTML;
          localStorage.removeItem(`pouch-data-${idDelete}`);
          window.location.reload();
        }
      });
    }
  }
});

// Clear button
let clearBtn = document.querySelector(
  ".controls .container .controls-content .clear"
);
clearBtn.addEventListener("click", () => {
  let valueOfWarning = confirm(
    "Are you sure you want to clear all the pouches?"
  );
  if (valueOfWarning) {
    localStorage.clear();
    window.location.reload();
  }
});

// Search button
let searchBtn = document.querySelector(
  ".controls .container .search-area .search"
);
searchBtn.addEventListener("click", () => {
  let searchInput = document.querySelector(
    ".controls .container .search-area .search-input"
  );
  let searchValue = searchInput.value;
  if (localStorage.getItem(`pouch-data-${searchValue}`)) {
    for (let i = 0; i < trTarget.length; i++)
      if (searchValue === trTarget[i].innerHTML) {
        searchValue = i;
        break;
      }
    inputs[searchValue].checked = true;
    searchInput.value = "";
  } else window.alert("Sorry. There is no pouch with this id :(");
});
