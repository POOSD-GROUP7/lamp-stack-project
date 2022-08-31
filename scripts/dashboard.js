const urlBase = "http://WebsiteName.com/LAMPAPI"
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";


function searchContact() {
    let srch = document.getElementById("contact").ariaValueMax;
    document.getElementsById("contactSearchResult").innerHTML = "";

    let contactList = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayLoad = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json", "charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    //need to fix html formatting for results 
                    contactList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) {
                        contactList += "<br/>\r\n";
                    }
                }

                document.getElementById("contactName")[0].innerHTML = contactList;
            }
        };
        xhr.send(jsonPayLoad);
    }
    catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}
