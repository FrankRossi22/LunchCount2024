//const { json } = require("express");

var imageSets;
var imageNameSets;
var currSet = -1;
const school = localStorage.getItem("school");
const schoolJ = {school};
if(school === null) {
    window.location.href = "http://localhost:3000/login";
}
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolJ)
}

async function getImages() {
    console.log(school);
    await fetch('/fetchImageSet', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            const validCheck = await result.message;
            //console.log(validCheck);
            if(validCheck.length > 0) {
                imageSets = validCheck[0];
                imageNameSets = validCheck[1];
            } else {
                window.location.href = "http://localhost:3000/login";
            }
            load();
        });
    });
}
function load() {
    currSet = currSet + 1;
    document.getElementById("image1").src= "../data/" + imageSets[currSet][0];
    document.getElementById("image2").src= "../data/" + imageSets[currSet][1];
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
        document.getElementById("image1").src= "../data/" + imageSets[currSet][0];
        document.getElementById("image2").src= "../data/" + imageSets[currSet][1];
        document.getElementById("imageName1").innerText = imageNameSets[currSet][0];
        document.getElementById("imageName2").innerText = imageNameSets[currSet][1];
    }
    if(currSet === 1) {
        document.getElementById("buttonDiv").style.display = "block";
    }
}

function prevImageSet() {
    currSet = currSet - 1;
    document.getElementById("image1").src= "../data/" + imageSets[currSet][0];
    document.getElementById("image2").src= "../data/" + imageSets[currSet][1];
    document.getElementById("imageName1").innerText = imageNameSets[currSet][0];
    document.getElementById("imageName2").innerText = imageNameSets[currSet][1];
    if(currSet === 0) {
        document.getElementById("buttonDiv").style.display = "none";
    }
}
