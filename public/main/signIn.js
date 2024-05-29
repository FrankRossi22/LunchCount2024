

function signIn() {
    var isValid = false;
    var email = document.getElementById("email").value;
    var classCode = document.getElementById("classCode").value;
    var i = 0;
    if(classCode === "" || email === "") {
        alertBox("Please Input Email and Class Code\n\n");
        return;
    }
    const userInfo = {email, classCode};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo)
    }
    fetch('/validateUser', options).then(response => {
        const data = response.json();
        data.then(function(result) {
        isValid = result.valid;
        if(!isValid) {
            alertBox("Invalid Email or Class Code\nPlease Try Again\n\n");
            return;
        } else {
            window.location.replace("http://localhost:3000/main");
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