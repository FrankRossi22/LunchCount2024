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
    const userInfo = {email, adminPass};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo)
    }
    fetch('/validateAdmin', options).then(response => {
        const data = response.json();
        data.then(function(result) {
        isValid = result.valid;
        if(!isValid) {
            alertBox("Invalid Email or Password\nPlease Try Again\n\n");
            return;
        } else {
            window.location.href = "http://localhost:3000/adminPage";
        }
        });
    });
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