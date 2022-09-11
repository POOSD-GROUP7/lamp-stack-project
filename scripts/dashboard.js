let selectedContactItem = null;

// Tracks if the device that is used to view the page has a small screen size
let smallScreen = false;

//#region DOM Element declarations

const search = document.getElementById("search");
const contactDetails = document.getElementById("contactDetails");
const contactAdd = document.getElementById("contactAdd");

//#endregion

// Get elements from the DOM
const currentActionText = document.getElementById("currentAction");

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
const deleteContactButton = document.getElementById("deleteContactButton");
const cancelContactButton = document.getElementById("cancelContactButton");

// Temporary contacts for testing
let contacts = [];
[
  {
    "id": 2,
    "firstName": "Chris",
    "lastName": "Doe",
    "phone": "555-555-5555",
    "email": "chris@example.com",
    "address": "123 Main St, Anywhere, USA",
    "dateAdded": "August 22, 2022",
  },
  {
    "id": 1,
    "firstName": "Alex",
    "lastName": "Doe",
    "phone": "555-555-5555",
    "email": "alex@example.com",
    "address": "123 Main St, Anywhere, USA",
    "dateAdded": "August 22, 2022",
  },
  {
    "id": 5,
    "firstName": "Walt",
    "lastName": "Smith",
    "phone": "555-555-5555",
    "email": "walt@example.com",
    "address": "123 Main St, Anywhere, USA",
    "dateAdded": "August 23, 2022",
  },
  {
    "id": 4,
    "firstName": "Thomas",
    "lastName": "Smith",
    "phone": "555-555-5555",
    "email": "thomas@example.com",
    "address": "123 Main St, Anywhere, USA",
    "dateAdded": "August 24, 2022",
  },
  {
    "id": 3,
    "firstName": "Joe",
    "lastName": "Bloggs",
    "phone": "555-555-5555",
    "email": "bloggs@example.com",
    "address": "1234567891011122314151617181920 Main St, Anywhere, USA",
    "dateAdded": "August 25, 2022",
  },
  {
    "id": 6,
    "firstName": "VeryLongFirstName",
    "lastName": "VeryLongLastNameVeryLongLastName",
    "phone": "555-555-5555",
    "email": "bloggs@example.com",
    "address": "1234567891011122314151617181920 Main St, Anywhere, USA",
    "dateAdded": "August 25, 2022",
  },
].forEach(contact => {
  // Include the contact n times for testing purposes
  for (let i = 0; i < 6; i++) {
    contacts.push(contact);
  }
});

// Run searchContact once on page load to populate the contact list
searchContact();


//#region Utility Functions
/**
 * Delays the execution of a function ignoring any change until no more change is detected in the timeout specified.
 *
 * @param {function} func - The function to execute after the timeout.
 * @param {number} [timeout] - The time to wait before executing the function. Optional, defaults to 300ms.
 * @return {(function(...[*]): void)|*} - The debounced function.
 */
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

//#endregion

const processSearchChange = debounce((value) => searchContact(value));

//#region Render Functions

/**
 * Calls the API to search for the contact that matches the search term passed
 *
 * @param {string} [searchTerm] - The search term to use to search for a contact. Optional, defaults to an empty string.
 * @return {void}
 */
function searchContact(searchTerm = "") {
  const searchString = searchTerm?.trim();

  collapseContactDetails();
  //TODO: Perform API calls here to fetch the contacts matching the search term

  //get the string and format the search in JSON format
  // let tmp = { search: searchString, userId: userId };
  // let jsonPayLoad = JSON.stringify(tmp);
  //
  // //redirect to the SearchContact.php endpoint
  // let url = urlBase + '/SearchContact.' + extension;
  //
  // //make a new Http POST Request
  // let xhr = new XMLHttpRequest();
  // xhr.open("POST", url, true);
  // xhr.setRequestHeader("Content-type", "application/json", "charset=UTF-8");
  // try {
  //   xhr.onreadystatechange = function () {
  //     //when the request has been made...
  //     if (this.readyState == 4 && this.status == 200) {
  //       //get the reponse from the endpoint and parse it
  //       //document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
  //       let jsonObject = JSON.parse(xhr.responseText);
  //
  //       //go through the contents of the JSON object
  //       for (let i = 0; i < jsonObject.results.length; i++) {
  //         listOfContacts += jsonObject.results[i];
  //         if (i < jsonObject.results.length - 1) {
  //           listOfContacts += "<br/>\r\n";
  //         }
  //       }
  //       // document.getElementById("contactName")[0].innerHTML = listOfContacts;
  //     }
  //   };
  //   xhr.send(jsonPayLoad);
  // }
  // catch (err) {
  //   document.getElementById("contactsList").innerHTML = err.message;
  // }

  let contactsList = document.getElementById("contactsList");

  if (searchString && contacts.length === 0) {
    // If there are no contacts matching the search term, display a no results message
    contactsList.innerHTML = "<h3 style='align-self: center'>No contacts found.</h3>";
  } else if (contacts.length === 0) {
    // If there are no contacts, display a no contacts message
    contactsList.innerHTML = "<h3 style='align-self: center'>No contacts yet.</h3>";
  } else {
    // Else set the old contactsList to an empty string before populating it with the new contacts
    contactsList.innerHTML = "";
  }

  // Sorts and displays the contacts JSON array in the contactsList element
  contacts
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
    .forEach((contact, index) => {
      const listItem = `
            <li id="${index}" onclick="setActiveContact(this)">
                <button type="button">
                    <span class="contactName">${contact.firstName} ${contact.lastName}</span>
                </button>
            </li>`;
      contactsList.innerHTML += listItem;
    });
}

function addContact() {
  let newContact = document.getElementById("contactForm").elements;

  let tmp = {
    userId: userId,
    firstName: newContact[0].value,
    lastName: newContact[1].value,
    email: newContact[2].value,
    phone: newContact[3].value,
    address: newContact[4].value,
  }
  let jsonPayLoad = JSON.stringify(tmp);

  let url = urlBase + "/AddContact.php";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactAddResult").innerHTML = "Contact has been added";
      }
    };

    xhr.send(jsonPayLoad);
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

function showAddContact() {
  currentActionText.innerHTML = "Adding a Contact";
  selectedContactItem?.classList.remove("active");
  selectedContactItem = null;
  setContactForm();
}

function showEditContact() {
  currentActionText.innerHTML = "Editing a Contact";
  setContactForm();
}

function showContactDetails() {
  contactInfoContainer.classList.remove("hidden");
  contactForm.classList.add("hidden");
  contactCircle.innerHTML = contacts[selectedContactItem.id].firstName[0].toUpperCase() + contacts[selectedContactItem.id].lastName[0].toUpperCase();
  contactName.innerHTML = contacts[selectedContactItem.id].firstName + " " + contacts[selectedContactItem.id].lastName;
  emailField.innerHTML = contacts[selectedContactItem.id].email;
  phoneField.innerHTML = contacts[selectedContactItem.id].phone;
  addressField.innerHTML = contacts[selectedContactItem.id].address;
  dateAddedField.innerHTML = "Added on " + contacts[selectedContactItem.id].dateAdded;
  contactName.classList.remove("hidden");
  cancelContactButton.classList.add("hidden");
  saveContactButton.classList.add("hidden");
  addContactButton.classList.add("hidden");
  editContactButton.classList.remove("hidden");
  deleteContactButton.classList.remove("hidden");
}

/**
 * Sets the active contact state in the contact list and triggers the displaying of contact details.
 *
 * @param {HTMLElement} contactItem - The contact item to set as active.
 * @return {void}
 */
function setActiveContact(contactItem) {
  currentActionText.innerHTML = "Viewing a Contact";
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

  showContactDetails();
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
  // Add Contact Mode
  if (!selectedContactItem) {
    document.getElementById("contactForm").reset();

    contactCircle.innerHTML = "?";
    contactName.classList.add("hidden");
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

  contactInfoContainer.classList.add("hidden");
  contactForm.classList.remove("hidden");
  expandContactDetails();
}

function updateProfileCircle() {
  const firstLetter = firstNameInput.value?.charAt(0).toUpperCase() || "";
  const secondLetter = lastNameInput.value?.charAt(0).toUpperCase() || "";
  const thirdLetter = lastNameInput.value?.split(" ")[1]?.charAt(0).toUpperCase() || "";
  const initials = firstLetter + secondLetter + thirdLetter;
  if (initials) {
    contactCircle.innerHTML = firstLetter + secondLetter + thirdLetter;
  } else {
    contactCircle.innerHTML = "?";
  }
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
