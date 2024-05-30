
var imageSets;
var imageNameSets;
var courseSet;
var currSet = -1;
const school = localStorage.getItem("school");
const schoolJ = {school};
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolJ)
}

//check if user is logged in
if(school === null) {
    window.location.href = "http://localhost:3000/login";
}
//function gets school image data from server and loads page 
async function getImages() {
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
  localStorage.setItem(courseSet[currSet - 1], e.target.id);
  console.log(e.target.id);
}
sec.addEventListener("click", buttonGroupPressed);

function load() {
    currSet = currSet + 1;
    var fig = getFig(imageSets[currSet][0], imageNameSets[currSet][0])
    sec.appendChild(fig);
    fig = getFig(imageSets[currSet][1], imageNameSets[currSet][1]);
    sec.appendChild(fig);
    document.getElementById("lastB").style.display = "inline";
    document.getElementById("lastText").style.display = "block";
    document.getElementById("buttonDiv").style.textAlign = "center";
}

function nextImageSet() {
    if(currSet === imageSets.length - 1) {
        finish();
        return;
    } else {
        sec.innerHTML = '';
        currSet = currSet + 1;
        var fig = getFig(imageSets[currSet][0], imageNameSets[currSet][0])
        sec.appendChild(fig);
        fig = getFig(imageSets[currSet][1], imageNameSets[currSet][1]);
        sec.appendChild(fig);
    }
    if(currSet === 1) {
        document.getElementById("buttonDiv").style.display = "block";
    }

}

function prevImageSet() {
    currSet = currSet - 1;
    sec.innerHTML = '';
    var fig = getFig(imageSets[currSet][0], imageNameSets[currSet][0])
    sec.appendChild(fig);
    fig = getFig(imageSets[currSet][1], imageNameSets[currSet][1]);
    sec.appendChild(fig);
    if(currSet === 0) {
        document.getElementById("buttonDiv").style.display = "none";
    }
}
function finish() {
    sec.innerHTML = '';
    for(course in courseSet) {
        //console.log(courseSet[course]);
        console.log(courseSet[course] + ":    " + localStorage.getItem(courseSet[course]));
    }
}
