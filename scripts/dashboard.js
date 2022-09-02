const urlBase = "http://WebsiteName.com/LAMPAPI"
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";

let selectedContactItem = null;

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
  },
  {
    "id": 1,
    "firstName": "Alex",
    "lastName": "Doe",
    "phone": "555-555-5555",
    "email": "alex@example.com",
    "address": "123 Main St, Anywhere, USA",
  },
  {
    "id": 5,
    "firstName": "Walt",
    "lastName": "Smith",
    "phone": "555-555-5555",
    "email": "walt@example.com",
    "address": "123 Main St, Anywhere, USA",
  },
  {
    "id": 4,
    "firstName": "Thomas",
    "lastName": "Smith",
    "phone": "555-555-5555",
    "email": "thomas@example.com",
    "address": "123 Main St, Anywhere, USA",
  },
  {
    "id": 3,
    "firstName": "Joe",
    "lastName": "Bloggs",
    "phone": "555-555-5555",
    "email": "bloggs@example.com",
    "address": "123 Main St, Anywhere, USA",
  },
].forEach(contact => {
  // Include the contact 4 times for testing purposes
  for (let i = 0; i < 4; i++) {
    contacts.push(contact);
  }
});

// Run searchContact once on page load to populate the contact list
searchContact();


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

const processSearchChange = debounce((value) => searchContact(value));

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
                    <h2>${contact.firstName} ${contact.lastName}</h2>
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


}
