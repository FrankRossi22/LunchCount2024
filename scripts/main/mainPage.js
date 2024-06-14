
var imageSets;
var imageNameSets;
var courseSet = [];
var userChoices = [];
var menuData;
var currSet = 0;
var atEnd = false;
const school = localStorage.getItem("school");

/*
TODO - 
    Setup phone width checker to display differently below a certain width

    Setup good final screen after submit

    Setup Past Options Screen

    Setup better login system
*/

//check if user is logged in
// if(school === null) {
//     window.location.href = "http://localhost:3000/login";
// }
//function gets school image data from server and loads page 
async function getImages() {
    // const schoolJ = {school};
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    }
    await fetch('/fetchImageSet').then(response => {
        var data = response.json();
        data.then(async function(result) {
            const imageData = await result.message;
            menuData = imageData[0];
            //imageNameSets = imageData[1];
            //courseSet = imageData[2];
            //console.log(menuData[0][0]);
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
    img.src = "/images/" + image;
    img.id = "A" + imageName;
    img.className = 'lunchImg';
    but.className = 'imgButton';
    but.id = "B" + imageName;
    figCap.innerText = imageName;
    but.appendChild(img);
    fig.appendChild(figCap);
    fig.appendChild(but);
    return fig;
}
const buttonGroupPressed = async e => {
    const isButton = e.target.nodeName === 'BUTTON' || e.target.nodeName === 'IMG';
    if(!isButton) {
        return
    }
    const text = e.target.id.substring(1, e.target.id.length);
    console.log(document.getElementById("A" + text));
    const img = await getTag(document.getElementById("A" + text).src)
    userChoices[currSet] = [text, img];
    if(currSet === menuData.length - 1) {
        atEnd = true;
        currSet++;
        finish();
    } else {
        sec.innerHTML = '';
        currSet++;
        courseSet[currSet] = menuData[currSet][0];
        displayCurr(menuData[currSet][1]);
    }
    if(currSet === 1) {
        document.getElementById("buttonDiv").style.display = "block";
    }
}
sec.addEventListener("click", buttonGroupPressed);
function getTag(imgSrc) {
    var i = imgSrc.length - 2;
    while(i >= 0) {
        if(imgSrc.charAt(i) === '/') {
            return imgSrc.substring(i + 1);
        }
        i--;
    }
    return "";
}
function load() {
    console.log(localStorage.getItem("email"));
    courseSet[currSet] = menuData[currSet][0];
    displayCurr(menuData[currSet][1]);
    document.getElementById("lastB").style.display = "inline";
    document.getElementById("lastText").style.display = "block";
    document.getElementById("buttonDiv").style.textAlign = "center";
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
    displayCurr(menuData[currSet][1]);
    if(currSet === 0) {
        document.getElementById("buttonDiv").style.display = "none";
    }
}
function displayCurr(courses) {
    //console.log('adad');
    for(var i = 0; i < courses.length; i++) {
        //console.log(course)
        var fig = getFig(courses[i][1], courses[i][0]);
        sec.appendChild(fig);
    }
}
function finish() {
    currSet++;
    document.getElementById('lastText').style.display = "none";
    document.getElementById('submitB').style.display = "inline";
    sec.innerHTML = '';
    var para = document.createElement('h3'); para.style.textAlign = 'center'; para.style.fontSize = '6vh';
        const text = document.createTextNode('Choices:');
        console.log(text);
        para.appendChild(text);
        sec.appendChild(para);
    for(course in courseSet) {
        //console.log(courseSet[course]);
        var para = document.createElement('p');
        const text = document.createTextNode(courseSet[course] + ":    " + userChoices[course][0]);  para.style.fontSize = '4vh';
        console.log(text);
        para.appendChild(text);
        sec.appendChild(para);
        //console.log(courseSet[course] + ":    " + localStorage.getItem(courseSet[course]));
    }
}
async function submit() {
    var studentChoices = [];
    // for(var i = 0; i < courseSet.length; i++) {
    //     studentChoices[i] = localStorage.getItem(courseSet[i]);
    // }
    const message = [userChoices];
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

