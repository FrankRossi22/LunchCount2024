
var imageSets;
var imageNameSets;
var courseSet;
var currSet = 0;
var atEnd = false;
const school = localStorage.getItem("school");

/*
TODO - 
Use dynamic number of images per row if number of items is > 3
Get Date and Time when submitting and send to server with choices // also send user email
Setup phone width checker to display differently below a certain width
*/
//check if user is logged in
if(school === null) {
    window.location.href = "http://localhost:3000/login";
}
//function gets school image data from server and loads page 
async function getImages() {
    const schoolJ = {school};
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(schoolJ)
    }
    await fetch('/fetchImageSet', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            const imageData = await result.message;
            imageSets = imageData[0];
            imageNameSets = imageData[1];
            courseSet = imageData[2];
            console.log(courseSet);
            load();
        });
    });
}

const sec = document.getElementById('imageCont');
function getFig(image, imageName) {
    const fig = document.createElement('figure');
    const figCap = document.createElement('figcaption');
    const but = document.createElement('button');
    const img = document.createElement('img');
    img.src = "../data/" + image;
    img.id = imageName;
    but.className = 'imgButton';
    but.id = imageName;
    figCap.innerText = imageName;
    but.appendChild(img);
    but.setAttribute('onclick', 'nextImageSet()');
    fig.appendChild(figCap);
    fig.appendChild(but);
    return fig;
}
const buttonGroupPressed = e => { 
  const isButton = e.target.nodeName === 'BUTTON' || e.target.nodeName === 'IMG';
  if(!isButton) {
    return
  }
  if(atEnd) {
    currSet++;
    localStorage.setItem(courseSet[currSet - 1], e.target.id);
    finish();
  } else {
    localStorage.setItem(courseSet[currSet - 1], e.target.id);
  }
}
sec.addEventListener("click", buttonGroupPressed);

function load() {
    console.log(localStorage.getItem("email"));
    displayCurr(imageSets[currSet], imageNameSets[currSet]);
    document.getElementById("lastB").style.display = "inline";
    document.getElementById("lastText").style.display = "block";
    document.getElementById("buttonDiv").style.textAlign = "center";
}

function nextImageSet() {
    if(currSet === imageSets.length - 1) {
        atEnd = true;
        return;
    } else {
        sec.innerHTML = '';
        currSet++;
        displayCurr(imageSets[currSet], imageNameSets[currSet]);
    }
    if(currSet === 1) {
        document.getElementById("buttonDiv").style.display = "block";
    }

}

function prevImageSet() {
    if(atEnd) {
        currSet--;
        atEnd = false;
        document.getElementById('lastText').style.display = "block";
        document.getElementById('submitB').style.display = "none";
    }
    currSet--;
    sec.innerHTML = '';
    displayCurr(imageSets[currSet], imageNameSets[currSet]);
    if(currSet === 0) {
        document.getElementById("buttonDiv").style.display = "none";
    }
}
function displayCurr(images, imageNames) {
    console.log('adad');
    for(image in images) {
        var fig = getFig(images[image], imageNames[image]);
        sec.appendChild(fig);
    }
}
function finish() {
    currSet++;
    document.getElementById('lastText').style.display = "none";
    document.getElementById('submitB').style.display = "inline";
    sec.innerHTML = '';
    for(course in courseSet) {
        //console.log(courseSet[course]);
        var para = document.createElement('p');
        const text = document.createTextNode(courseSet[course] + ":    " + localStorage.getItem(courseSet[course]));
        para.appendChild(text);
        sec.appendChild(para);
        console.log(courseSet[course] + ":    " + localStorage.getItem(courseSet[course]));
    }
}
async function submit() {
    var studentChoices = [];
    for(var i = 0; i < courseSet.length; i++) {
        studentChoices[i] = localStorage.getItem(courseSet[i]);
    }
    const message = [localStorage.getItem('school'), studentChoices];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/updateLunchCount', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            console.log(result);
            if(result) {
                sec.innerHTML = '';
                var para = document.createElement('p');
                const text = document.createTextNode('Thankyou for submitting!');
                para.appendChild(text);
                sec.appendChild(para);
                document.getElementById("buttonDiv").style.display = "none";
            }
        });
    });
}

