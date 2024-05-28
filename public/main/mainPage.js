const imageSets = [["cheeseburger3.jpg", "chickenSandwich3.jpeg"], ["fries.webP", "taterTots.webp"]];
const imageNameSets = [["Cheeseburger", "Chicken Sandwich"], ["French Fries", "Tater Tots"]];
var currSet = -1;
function load() {
    currSet = currSet + 1;
    document.getElementById("image1").src= "../../data/" + imageSets[currSet][0];
    document.getElementById("image2").src= "../../data/" + imageSets[currSet][1];
    document.getElementById("imageName1").innerText = imageNameSets[currSet][0];
    document.getElementById("imageName2").innerText = imageNameSets[currSet][1];
    document.getElementById("lastB").style.display = "inline";
    document.getElementById("lastText").style.display = "block";
    document.getElementById("buttonDiv").style.textAlign = "center";
}

function nextImageSet() {
    if(currSet === imageSets.length - 1) {
        return;
    } else {
        currSet = currSet + 1;
        document.getElementById("image1").src= "../../data/" + imageSets[currSet][0];
        document.getElementById("image2").src= "../../data/" + imageSets[currSet][1];
        document.getElementById("imageName1").innerText = imageNameSets[currSet][0];
        document.getElementById("imageName2").innerText = imageNameSets[currSet][1];
    }
    if(currSet === 1) {
        document.getElementById("buttonDiv").style.display = "block";
    }
}

function prevImageSet() {
    currSet = currSet - 1;
    document.getElementById("image1").src= "../../data/" + imageSets[currSet][0];
    document.getElementById("image2").src= "../../data/" + imageSets[currSet][1];
    document.getElementById("imageName1").innerText = imageNameSets[currSet][0];
    document.getElementById("imageName2").innerText = imageNameSets[currSet][1];
    if(currSet === 0) {
        document.getElementById("buttonDiv").style.display = "none";
    }
}

function test() {
    document.getElementById("lastText").style.display = "default";
}