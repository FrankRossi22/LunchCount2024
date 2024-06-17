
/*
TODO - 
    Send Date and Time to server with login info
*/

function signIn() {
    var isValid = false;
    const email = document.getElementById("email").value;
    const classCode = document.getElementById("classCode").value;
    //const pass = document.getElementById("password").value;
    var i = 0;
    if(classCode === "" || email === "") {
        alertBox("Please Input Email,\nPassword, and Class Code\n\n");
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
    //send user data to server to be validated => open next page if so
    fetch('/validateUser', options).then(response => {
        const data = response.json();
        data.then(function(result) {
        isValid = result.valid;
        if(!isValid) {
            alertBox("Invalid Email,\nPassword, or Class Code\n\nPlease Try Again\n");
            return;
        } else {
            localStorage.setItem("school", result.school);
            localStorage.setItem("email", email);
            window.location.href = "http://localhost:3000/student";
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