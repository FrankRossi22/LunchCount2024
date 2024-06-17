/*
TODO - 
    
*/
/*
CSS Ideas - 
    
*/

/*
    All Page Functions
*/

function addSchool() {
    var isValid = false;
    var adminEmail = document.getElementById("email").value;
    var adminPass = document.getElementById("adminPass").value;
    var i = 0;
    if(adminPass === "" || adminEmail === "") {
        alertBox("Please Input School, Email, and Password\n\n");
        return;
    }
    const schoolInfo = {adminEmail, adminPass};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolInfo)
    }
    //send user data to server to be validated => open next page if so
    fetch('/addSchool', options).then(response => {
        const data = response.json();
        data.then(function(result) {
        isValid = result.valid;
        if(!isValid) {
            alertBox("School Already Valid");
            return;
        } else {
            alertBox("Success");
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
const input = document.getElementById("addSchoolInput");
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addSchool();
  }
});


/*
    Helper Functions
*/
function parseDate(oldDate) {
    var day = oldDate.substring(8);
    var month = oldDate.substring(5, 7);
    var year = oldDate.substring(0, 4);
    if(day.charAt(0) === '0') {
        day = day.substring(1);
    }
    if(month.charAt(0) === '0') {
        month = month.substring(1);
    }
    return month + "/" + day + "/" + year;
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

