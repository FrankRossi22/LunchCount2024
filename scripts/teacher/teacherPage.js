/*
TODO - 
    
*/
/*
CSS Ideas - 
    
*/

/*
    All Page Functions
*/

async function generateClassCode(getNew) {
    const message = [getNew];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/createClassCode', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            var str = "";
            if(result.success) {
                str = "Class Code: " + result.classCode;
            } else {
                str = "Class Code Could Not Be Generated";
            }
            document.getElementById('classCodePar').innerText = str;
           
        });
    });
}

function getClassCount() {

}
function getStudentCounts() {

}


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

