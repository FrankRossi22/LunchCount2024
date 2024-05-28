const adminEmails = ["admin.1@school.edu"]
var adminPasswords = ["1234"]

function signIn() {
    var isValid = false;
    var email = document.getElementById("email").value;
    var adminPass = document.getElementById("adminPass").value;
    var i = 0;
    if(adminPass === "" || email === "") {
        alertBox("Please Input Email and Password\n\n");
        return;
    }
    while(i < adminEmails.length && !isValid) {
        if(adminEmails[i] === email) {
            isValid = true;
        }
        i++;
    }
    if(!isValid) {
        alertBox("Invalid Email or Password\nPlease Try Again\n\n");
        return;
    } else {
        isValid = false;
        i = 0;
        while(i < adminPasswords.length && !isValid) {
            if(adminPasswords[i] === adminPass) {
                isValid = true;
            }
            i++;
        }
    }
    if(!isValid) {
        alertBox("Invalid Email or Password\nPlease Try Again\n\n");
        return;
    } else {
        window.location.replace("http://127.0.0.1:5500/public/admin/adminPage.html");
    }
}

function alertBox(text) {
    let customAlert = document.getElementById('customAlert');
    let customAlertMessage = document.getElementById('customAlertMessage');
    customAlertMessage.innerText = text;
    customAlert.style.display = 'block';
}

function hideCustomAlert() {
    let customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'none';
}

const input = document.getElementById("emailInput");
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    signIn();
  }
});