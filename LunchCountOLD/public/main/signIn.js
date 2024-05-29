const schoolEmails = ["user.1@school.edu"]
var classCodes = ["1234"]

function signIn() {
    var isValid = false;
    var email = document.getElementById("email").value;
    var classCode = document.getElementById("classCode").value;
    var i = 0;
    if(classCode === "" || email === "") {
        alertBox("Please Input Email and Class Code\n\n");
        return;
    }
    while(i < schoolEmails.length && !isValid) {
        if(schoolEmails[i] === email) {
            isValid = true;
        }
        i++;
    }
    if(!isValid) {
        alertBox("Invalid Email or Class Code\nPlease Try Again\n\n");
        return;
    } else {
        isValid = false;
        i = 0;
        while(i < classCodes.length && !isValid) {
            if(classCodes[i] === classCode) {
                isValid = true;
            }
            i++;
        }
    }
    if(!isValid) {
        alertBox("Invalid Email or Class Code\nPlease Try Again\n\n");
        return;
    } else {
        window.location.replace("http://127.0.0.1:5500/public/main/mainPage.html");
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