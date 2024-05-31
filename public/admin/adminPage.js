/*
TODO - 
    Everything besides formatting // setup server data transfer // decide what to do
*/

function checkValid() {
    const admin = localStorage.getItem("admin");
    if(admin === null) {
        window.location.href = "http://localhost:3000/adminLogin";
    }
}

function showLunchCount() {
    window.location.href = "http://localhost:3000/yourCount";
}

function changeLunch() {
    window.location.href = "http://localhost:3000/createLunch";
}
function toMain() {
    window.location.href = "http://localhost:3000/adminPage";
}

function sendDate() {
    const date = parseDate(document.getElementById("date").value);
    console.log(date);
}
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