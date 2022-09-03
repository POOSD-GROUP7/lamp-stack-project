const urlBase = "http://WebsiteName.com/LAMPAPI"
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";

let selectedContactItem = null;

// Tracks if the device that is used to view the page has a small screen size
let smallScreen = false;

//#region DOM Element declarations

const search = document.getElementById("search");
const contactDetails = document.getElementById("contactDetails");

//#endregion

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
].forEach(contact => {
  // Include the contact 4 times for testing purposes
  for (let i = 0; i < 4; i++) {
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


  // TODO: Perform API calls here to fetch the contacts matching the search term
  // let tmp = {search: srch, userId: userId};
  // let jsonPayLoad = JSON.stringify(tmp);
  //
  // let url = urlBase + '/SearchContacts' + extension;
  //
  // let xhr = new XMLHttpRequest();
  // xhr.open("POST", url, true);
  // xhr.setRequestHeader("Content-type", "application/json", "charset=UTF-8");
  //
  // try {
  //   xhr.onreadystatechange = function () {
  //     if (this.readyState == 4 && this.status == 200) {
  //       document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
  //       let jsonObject = JSON.parse(xhr.responseText);
  //
  //       for (let i = 0; i < jsonObject.results.length; i++) {
  //         //need to fix html formatting for results
  //         contactList += jsonObject.results[i];
  //         if (i < jsonObject.results.length - 1) {
  //           contactList += "<br/>\r\n";
  //         }
  //       }
  //
  //       document.getElementById("contactName")[0].innerHTML = contactList;
  //     }
  //   };
  //   xhr.send(jsonPayLoad);
  // } catch (err) {
  //   document.getElementById("contactSearchResult").innerHTML = err.message;
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

/**
 * Sets the active contact state in the contact list and triggers the displaying of contact details.
 *
 * @param {HTMLElement} contactItem - The contact item to set as active.
 * @return {void}
 */
function setActiveContact(contactItem) {
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

  // Update the contact details
  const contactCircle = document.getElementById("contactCircle");
  const contactName = document.getElementById("contactName");
  const emailField = document.getElementById("emailField");
  const phoneField = document.getElementById("phoneField");
  const addressField = document.getElementById("addressField");
  const dateAddedField = document.getElementById("dateAddedField");

  contactCircle.innerHTML = contacts[contactItem.id].firstName[0] + contacts[contactItem.id].lastName[0];
  contactName.innerHTML = contacts[contactItem.id].firstName + " " + contacts[contactItem.id].lastName;
  emailField.innerHTML = contacts[contactItem.id].email;
  phoneField.innerHTML = contacts[contactItem.id].phone;
  addressField.innerHTML = contacts[contactItem.id].address;
  dateAddedField.innerHTML = "Added on " + contacts[contactItem.id].dateAdded;
}

/**
 * Expands or collapses the sections based on whether it is being viewed on a small screen.
 *
 * @param {boolean} isSmallScreen - Whether the screen is small or not.
 * @return {void}
 */
function setupLayoutForScreen(isSmallScreen) {
  if (isSmallScreen) {
    smallScreen = true;
    if (selectedContactItem) {
      expandContactDetails();
      collapseSearch();
    }
  } else {
    smallScreen = false;
    if (selectedContactItem) {
      expandContactDetails();
      expandSearch();
    } else {
      collapseContactDetails();
      expandSearch();
    }
  }
}

function collapseContactDetails() {
  contactDetails.classList.add("collapsed");

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

//#endregion

//#region Media Queries

if (window.matchMedia("(max-width: 728px)").matches) {
  setupLayoutForScreen(true);
}

const mql = window.matchMedia('(max-width: 728px)');

function screen({matches}) {
  setupLayoutForScreen(matches);
}

mql.addEventListener('change', screen);

//#endregion
