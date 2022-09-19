// Tracks if the device that is used to view the page has a small screen size
let smallScreen = false;

let snackbarTimer = null;

//#region DOM Element declarations

const search = document.getElementById("search");
const contactDetails = document.getElementById("contactDetails");
const contactAdd = document.getElementById("contactAdd");

//#endregion

//#region Get elements from the DOM
const currentActionText = document.getElementById("currentAction");
const snackbar = document.getElementById("snackbar");

const searchInput = document.getElementById("searchInput");

const contactsList = document.getElementById("contactsList");

const contactInfoContainer = document.getElementById("contactInfoContainer");
const contactForm = document.getElementById("contactForm");

const contactCircle = document.getElementById("contactCircle");
const contactName = document.getElementById("contactName");
const emailField = document.getElementById("emailField");
const phoneField = document.getElementById("phoneField");
const addressField = document.getElementById("addressField");
const dateAddedField = document.getElementById("dateAddedField");

const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const addressInput = document.getElementById("addressInput");

const addContactButton = document.getElementById("addContactButton");
const editContactButton = document.getElementById("editContactButton");
const saveContactButton = document.getElementById("saveContactButton");
const cancelContactButton = document.getElementById("cancelContactButton");
const deleteContactButton = document.getElementById("deleteContactButton");
const deleteContactButtonHint = document.getElementById("deleteContactButtonHint");
const confirmDeleteContactButton = document.getElementById("confirmDeleteContactButton");
const cancelDeleteContactButton = document.getElementById("cancelDeleteContactButton");

//#endregion

let selectedContactItem = null;
let selectedContactId = null;

// Array of object containing all the contacts
let contacts = [];

// Run searchContact once on page load to populate the contact list. Wait until the cookies are loaded
setTimeout(() => {
  searchContact();
}, 0);

//#region Utility Functions
/**
 * Delays the execution of a function ignoring any change until no more change is detected in the timeout specified.
 *
 * @param {function} func - The function to execute after the timeout.
 * @param {number} [timeout] - The time to wait before executing the function. Optional, defaults to 250ms.
 * @return {(function(...[*]): void)|*} - The debounced function.
 */
function debounce(func, timeout = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

//#endregion

const processSearchChange = debounce((value) => searchContact(value, !smallScreen));

//#region Render Functions

/**
 * Calls the API to search for the contact that matches the search term passed
 *
 * @param {string} [searchTerm] - The search term to use to search for a contact. Optional, defaults to an empty string.
 * @param {boolean} [keepSelectedContact] - Whether to keep the selected contact after the search is complete. Optional, defaults to true.
 * @return {void}
 */
function searchContact(searchTerm = "", keepSelectedContact = true) {
  const searchString = searchTerm?.trim();
  searchInput.value = searchString;

  //get the string and format the search in JSON format
  let tmp = {search: searchString, userId: userId};
  let jsonPayLoad = JSON.stringify(tmp);

  //redirect to the SearchContact.php endpoint
  let url = urlBase + '/SearchContact.php';

  //make a new Http POST Request
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json", "charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }

      if (this.status === 404) {
        if (searchString) {
          // If there are no contacts matching the search term, display a no results message
          contactsList.innerHTML = "<h3 style='align-self: center'>No contacts found.</h3>";
        } else {
          // If there are no contacts, display a no contacts message
          contactsList.innerHTML = "<h3 style='align-self: center'>No contacts yet.</h3>";
        }

        hideContactDetails();
        selectedContactId = null;
      } else if (this.status === 200 || this.status === 201) {
        contacts = JSON.parse(xhr.responseText).results.map((contact) => {
          return {
            ...contact,
            createdAt: new Intl.DateTimeFormat('en-US', {
              dateStyle: 'long',
            }).format(new Date(contact.createdAt)),
          };
        });

        contactsList.innerHTML = "";
        // Sorts and displays the contacts JSON array in the contactsList element
        let selectedContactIndex;
        contacts
          .sort((a, b) => a.firstName.localeCompare(b.firstName))
          .forEach((contact, index) => {
            if (selectedContactId && (contact.id === selectedContactId)) {
              selectedContactIndex = index;
            }
            const listItem = `
            <li id="${index}" onclick="setActiveContact(this)">
                <button type="button">
                    <span class="contactName">${contact.firstName} ${contact.lastName}</span>
                </button>
            </li>`;
            contactsList.innerHTML += listItem;
          });

        const selectedContactItem = contactsList.children[selectedContactIndex];
        // Bring previously selected contact back into view if it exists for this search
        if (selectedContactItem && keepSelectedContact) {
          setActiveContact(selectedContactItem);
        } else {
          // Else, hide the contact details as it no longer exists for this search
          hideContactDetails();
          selectedContactId = null;
        }
      }
    };

    xhr.send(jsonPayLoad);
  } catch (err) {
    console.error(err);
    showSnackbar("Error searching for contacts.", "error");
  }
}

function addContact() {
  if (firstNameInput.value.trim() === "" && lastNameInput.value.trim() === "") {
    showSnackbar("Contacts must have a name", "error");
    return;
  }

  let tmp = {
    userId: userId,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value.trim() || "N/A",
    phone: phoneInput.value.trim() || "N/A",
    address: addressInput.value.trim() || "N/A",
  }
  let jsonPayLoad = JSON.stringify(tmp);

  let url = urlBase + "/AddContact.php";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }

      if (this.status === 200 || this.status === 201) {
        const contact = JSON.parse(xhr.responseText).results[0];

        showSnackbar("The contact has been added");
        contactForm.reset();

        // Create a mock selected contact item so that searchContact knows to bring the new contact into view
        selectedContactId = contact.ContactID;
        searchContact();
      } else {
        showSnackbar("The contact could not be added", "error");
      }
    };

    xhr.send(jsonPayLoad);
  } catch (err) {
    console.error(err.message);
    showSnackbar("Sorry, there was an error when adding the contact", "error");
  }
}

function saveContact() {
  // Get the contact details from the form
  const contact = {
    id: selectedContactId,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value.trim() || "N/A",
    phone: phoneInput.value.trim() || "N/A",
    address: addressInput.value.trim() || "N/A",
    createdAt: contacts[selectedContactItem.id].createdAt,
  };
  const oldContact = contacts[selectedContactItem.id];

  if (contact.firstName === "" && contact.lastName === "") {
    showSnackbar("Contacts must have a name", "error");
    return;
  } else if (contact.firstName === oldContact.firstName && contact.lastName === oldContact.lastName &&
    contact.email === oldContact.email && contact.phone === oldContact.phone && contact.address === oldContact.address) {
    showSnackbar("No changes to save");
    return;
  }

  let jsonPayLoad = JSON.stringify(contact);

  let url = urlBase + "/Update.php";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }

      if (this.status === 200 || this.status === 201) {
        showSnackbar("The contact has been updated");
        // Update the contact in the contacts array
        contacts[selectedContactItem.id] = contact;
        // Update the contact in the contacts list
        selectedContactItem.querySelector(".contactName").textContent = `${contact.firstName} ${contact.lastName}`;
        showContactDetails();
      } else {
        showSnackbar("The contact could not be updated", "error");
      }
    };

    xhr.send(jsonPayLoad);
  } catch (err) {
    console.error(err.message);
    showSnackbar("Sorry, there was an error when updating the contact", "error");
  }
}

function deleteContact() {
  hideConfirmForDeleteButton();

  let tmp = {id: contacts[selectedContactItem.id].id};
  let jsonPayLoad = JSON.stringify(tmp);

  let url = urlBase + "/Delete.php";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }

      if (this.status === 200 || this.status === 201) {
        showSnackbar("The contact has been deleted");
        hideContactDetails();
        searchContact(searchInput.value);
      } else {
        showSnackbar("The contact could not be deleted", "error");
      }
    };

    xhr.send(jsonPayLoad);
  } catch (err) {
    console.error(err.message);
    showSnackbar("Sorry, there was an error when deleting the contact", "error");
  }
}

function showAddContact() {
  currentActionText.innerHTML = "Adding a Contact";
  selectedContactItem?.classList.remove("active");
  selectedContactItem = null;
  selectedContactId = null;
  setContactForm();
}

function showEditContact() {
  currentActionText.innerHTML = "Editing a Contact";
  setContactForm();
}

function showContactDetails() {
  contactInfoContainer.classList.remove("hidden");
  contactForm.classList.add("hidden");
  contactDetails.classList.remove("hidden");
  contactCircle.classList.remove("hidden");
  updateProfileCircle(contacts[selectedContactItem.id].firstName, contacts[selectedContactItem.id].lastName);
  contactName.innerHTML = contacts[selectedContactItem.id].firstName + " " + contacts[selectedContactItem.id].lastName;
  emailField.innerHTML = contacts[selectedContactItem.id].email;
  phoneField.innerHTML = contacts[selectedContactItem.id].phone;
  addressField.innerHTML = contacts[selectedContactItem.id].address;
  dateAddedField.innerHTML = "Added on " + contacts[selectedContactItem.id].createdAt;
  contactName.classList.remove("hidden");
  cancelContactButton.classList.add("hidden");
  saveContactButton.classList.add("hidden");
  addContactButton.classList.add("hidden");
  editContactButton.classList.remove("hidden");
  deleteContactButton.classList.remove("hidden");
}

function hideContactDetails() {
  currentActionText.innerHTML = "Contact Manager";
  contactInfoContainer.classList.add("hidden");
  contactForm.classList.add("hidden");
  contactCircle.classList.add("hidden");
  contactName.classList.remove("hidden");
  contactName.innerHTML = "No Contact Selected";
  cancelContactButton.classList.add("hidden");
  saveContactButton.classList.add("hidden");
  addContactButton.classList.add("hidden");
  editContactButton.classList.add("hidden");
  deleteContactButton.classList.add("hidden");
}

function showConfirmForDeleteButton() {
  deleteContactButtonHint.classList.remove("hidden");
  deleteContactButton.classList.add("hidden");
  confirmDeleteContactButton.classList.remove("hidden");
  cancelDeleteContactButton.classList.remove("hidden");
}

function hideConfirmForDeleteButton() {
  deleteContactButtonHint.classList.add("hidden");
  deleteContactButton.classList.remove("hidden");
  confirmDeleteContactButton.classList.add("hidden");
  cancelDeleteContactButton.classList.add("hidden");
}

/**
 * Sets the active contact state in the contact list and triggers the displaying of contact details.
 *
 * @param {HTMLElement} contactItem - The contact item to set as active. if null, the active contact will be cleared.
 * @return {void}
 */
function setActiveContact(contactItem) {
  currentActionText.innerHTML = contactItem ? "Viewing a Contact" : "Contact Manager";

  if (contactItem) {
    hideConfirmForDeleteButton();
    expandContactDetails();

    // If already selected, nothing needs to be done
    if (contactItem.isSameNode(selectedContactItem)) {
      return;
    }

    contactItem.classList.add("active");
    // If there is a selected contact, remove the active state from it
    if (selectedContactItem) {
      selectedContactItem.classList.remove("active");
    }
    selectedContactItem = contactItem;
    selectedContactId = contacts[selectedContactItem.id].id;

    showContactDetails();
  } else {
    hideContactDetails();
  }
}

/**
 * Expands or collapses the sections based on whether it is being viewed on a small screen.
 *
 * @param {boolean} isSmallScreen - Whether the screen is small or not.
 * @return {void}
 */
function setupLayoutForScreen(isSmallScreen) {
  const isEditingOrAddingContact = contactInfoContainer.classList.contains("hidden");
  if (isSmallScreen) {
    smallScreen = true;
    if (selectedContactItem || isEditingOrAddingContact) {
      expandContactDetails();
      collapseSearch();
    }
  } else {
    smallScreen = false;
    if (selectedContactItem || isEditingOrAddingContact) {
      expandContactDetails();
      expandSearch();
    } else {
      collapseContactDetails();
      expandSearch();
    }
  }
}

function collapseContactDetails() {
  currentActionText.innerHTML = "Contact Manager";
  contactDetails.classList.add("collapsed");
  // De-select the selected contact
  selectedContactItem?.classList.remove("active");
  selectedContactItem = null;
  selectedContactId = null;

  if (smallScreen) {
    expandSearch();
  }
}

function expandContactDetails() {
  contactDetails.classList.remove("collapsed");

  if (smallScreen) {
    collapseSearch();
  }
}

function collapseSearch() {
  search.classList.add("collapsed");
}

function expandSearch() {
  search.classList.remove("collapsed");
}

function setContactForm() {
  contactName.classList.add("hidden");
  contactInfoContainer.classList.add("hidden");
  contactForm.classList.remove("hidden");
  contactCircle.classList.remove("hidden");
  hideConfirmForDeleteButton();

  // Add Contact Mode
  if (!selectedContactItem) {
    document.getElementById("contactForm").reset();

    contactCircle.innerHTML = "?";
    addContactButton.classList.remove("hidden");
    editContactButton.classList.add("hidden");
    deleteContactButton.classList.add("hidden");
    cancelContactButton.classList.add("hidden");
    saveContactButton.classList.add("hidden");
  }
  // Edit Contact Mode
  else {
    firstNameInput.value = contacts[selectedContactItem.id].firstName;
    lastNameInput.value = contacts[selectedContactItem.id].lastName;
    emailInput.value = contacts[selectedContactItem.id].email;
    phoneInput.value = contacts[selectedContactItem.id].phone;
    addressInput.value = contacts[selectedContactItem.id].address;
    updateProfileCircle();

    cancelContactButton.classList.remove("hidden");
    saveContactButton.classList.remove("hidden");
    addContactButton.classList.add("hidden");
    editContactButton.classList.add("hidden");
    deleteContactButton.classList.add("hidden");
  }

  expandContactDetails();
}

function updateProfileCircle(firstName = firstNameInput.value, lastName = lastNameInput.value) {
  const firstLetter = firstName?.charAt(0).toUpperCase() || "";
  const secondLetter = lastName?.charAt(0).toUpperCase() || "";
  const thirdLetter = lastName?.split(" ")[1]?.charAt(0).toUpperCase() || "";
  const initials = firstLetter + secondLetter + thirdLetter;
  if (initials) {
    contactCircle.innerHTML = firstLetter + secondLetter + thirdLetter;
  } else {
    contactCircle.innerHTML = "?";
  }
}

/**
 * Triggers the snackbar to show a message.
 *
 * @param {string} message - The message to show in the snackbar.
 * @param {string} variant - The variant of the snackbar to show.
 * @param {number} timeout - The amount of time in milliseconds to show the snackbar for. Defaults to 4000ms.
 * @return {void}
 */
function showSnackbar(message, variant = "info", timeout = 4000) {
  clearTimeout(snackbarTimer);
  snackbar.innerHTML = message;
  snackbar.style.color = variant === "error" ? "var(--text-error)" : "var(--text)";
  snackbar.classList.remove("hidden");
  snackbarTimer = setTimeout(() => {
    snackbar.classList.add("hidden");
  }, timeout);
}

//#endregion

//#region Media Queries

if (window.matchMedia("(max-width: 800px)").matches) {
  setupLayoutForScreen(true);
}

const mql = window.matchMedia('(max-width: 800px)');

function screen({matches}) {
  setupLayoutForScreen(matches);
}

mql.addEventListener('change', screen);

//#endregion
