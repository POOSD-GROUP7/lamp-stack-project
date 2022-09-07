const urlBase = "http://ucfcontactmanager.online/LAMPAPI";

document.addEventListener('DOMContentLoaded', function () {
  readCookie();
});

let userId = 0;
let firstName = "";
let lastName = "";

// Get elements from the DOM
const loginToggle = document.getElementById("loginToggle");
const registerToggle = document.getElementById("registerToggle");
const loginResult = document.getElementById("loginResult");
const registerInputs = document.getElementById("registerInputs");
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

// By default, Login will be selected upon page load
loginToggle?.classList.add("active");

function setLogin() {
  //#region Modify the DOM to show login information
  loginResult.classList.remove("shown");

  loginToggle.classList.add("active");
  registerToggle.classList.remove("active");

  registerInputs.style.marginBottom = "";
  registerInputs.style.opacity = "0";
  registerInputs.style.visibility = "collapse";

  registerButton.style.display = "none";
  loginButton.style.display = "block";

  //#endregion
}

function setRegister() {
  //#region Modify the DOM to show register information
  loginResult.classList.remove("shown");

  loginToggle.classList.remove("active");
  registerToggle.classList.add("active");

  registerInputs.style.marginBottom = "0";
  registerInputs.style.opacity = "1";
  registerInputs.style.visibility = "visible";

  loginButton.style.display = "none";
  registerButton.style.display = "block";

  //#endregion
}

function doLogin() {
  let password = document.getElementById("passwordInput").value;
  let login = document.getElementById("emailInput").value;

  userId = 0;
  firstName = "";
  lastName = "";

  const passwordHash = md5(password);

  let tmp = {login: login, password: password};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Login.php';

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          loginResult.innerHTML = "User/Password combination incorrect";
          loginResult.classList.add("shown");
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "dashboard.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    loginResult.innerHTML = err.message;
    loginResult.classList.add("shown");
  }

}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    if (window.location.href.includes("dashboard.html")) {
      window.location.href = "index.html";
    }
  } else {
    if (window.location.href.includes("index.html")) {
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("appbarUserName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}
