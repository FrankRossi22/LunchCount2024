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
function showLunch() {
    hideOptions()
    document.getElementById("showLunch").style.display = "block";
}

function showLunchCount() {
    hideOptions()
    document.getElementById("showCount").style.display = "block";
}

function changeLunch() {
    hideOptions()
    document.getElementById("changeLunch").style.display = "block";
}

function hideOptions() {
    document.getElementById("options").style.display = "none"; 
    document.getElementById("backButton").style.display = "inline";
}

function showOptions() {
    document.getElementById("showLunch").style.display = "none";
    document.getElementById("showCount").style.display = "none";
    document.getElementById("changeLunch").style.display = "none";
    document.getElementById("options").style.display = "block"; 
    document.getElementById("backButton").style.display = "none";
}
