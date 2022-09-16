const urlBase = "https://ucfcontactmanager.online/LAMPAPI";

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
const accountFirstNameInput = document.getElementById("firstNameInput");
const accountLastNameInput = document.getElementById("lastNameInput");
const accountEmailInput = document.getElementById("emailInput");
const accountEmailInputHint = document.getElementById("emailInputHint");
const accountPasswordInput = document.getElementById("passwordInput");
const accountPasswordInputHint = document.getElementById("passwordInputHint");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

// By default, Login will be selected upon page load
loginToggle?.classList.add("active");

function validateEmailField(value) {
  if (value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    accountEmailInput.classList.remove("invalid");
    accountEmailInputHint.classList.remove("shown");
  } else if (!value.trim()) {
    accountEmailInput.classList.add("invalid");
    accountEmailInputHint.innerHTML = "Email cannot be empty.";
    accountEmailInputHint.classList.add("shown");
  } else {
    accountEmailInput.classList.add("invalid");
    accountEmailInputHint.innerHTML = "Please enter a valid email address.";
    accountEmailInputHint.classList.add("shown");
  }
}

function validatePasswordField(value) {
  if (value.trim()) {
    accountPasswordInput.classList.remove("invalid");
    accountPasswordInputHint.classList.remove("shown");
  } else {
    accountPasswordInput.classList.add("invalid");
    accountPasswordInputHint.innerHTML = "Password cannot be empty.";
    accountPasswordInputHint.classList.add("shown");
  }
}

function setLogin() {
  loginResult.classList.remove("shown");

  loginToggle.classList.add("active");
  registerToggle.classList.remove("active");

  registerInputs.style.marginBottom = "";
  registerInputs.style.opacity = "0";
  registerInputs.style.visibility = "collapse";

  registerButton.style.display = "none";
  loginButton.style.display = "block";
}

function setRegister() {
  loginResult.classList.remove("shown");

  loginToggle.classList.remove("active");
  registerToggle.classList.add("active");

  registerInputs.style.marginBottom = "0";
  registerInputs.style.opacity = "1";
  registerInputs.style.visibility = "visible";

  loginButton.style.display = "none";
  registerButton.style.display = "block";
}

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let tmp = {
    login: accountEmailInput.value.trim(),
    password: md5(accountPasswordInput.value)
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Login.php';

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }

      if (this.status === 401) {
        loginResult.innerHTML = "Invalid username or password.";
        loginResult.classList.add("shown");
      } else if (this.status === 404) {
        loginResult.innerHTML = "User not found.";
        loginResult.classList.add("shown");
      } else if (this.status === 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          loginResult.innerHTML = "User/Password combination incorrect.";
          loginResult.classList.add("shown");
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "dashboard.html";
      } else {
        loginResult.innerHTML = "An error occurred. 😔";
        loginResult.classList.add("shown");
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    loginResult.innerHTML = err.message;
    loginResult.classList.add("shown");
  }

}

function doRegister() {
  userId = 0;
  firstName = "";
  lastName = "";

  let tmp = {
    firstName: accountFirstNameInput.value.trim(),
    lastName: accountLastNameInput.value.trim(),
    login: accountEmailInput.value.trim(),
    password: md5(accountPasswordInput.value)
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Register.php';

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }

      if (this.status === 409) {
        loginResult.innerHTML = "Email already in use.";
        loginResult.classList.add("shown");
      } else if (this.status === 201 || this.status === 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.results[0].userId;

        firstName = tmp.firstName;
        lastName = tmp.lastName;

        saveCookie();

        window.location.href = "dashboard.html";
      } else {
        loginResult.innerHTML = "An error occurred. 😔";
        loginResult.classList.add("shown");
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
  date.setTime(date.getTime() + (minutes * 600 * 1000));
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
