
const imageNameSets = [["Cheeseburger", "Chicken Sandwich"], ["French Fries", "Tater Tots"]];

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
