/*
TODO - 
    Everything besides formatting // setup server data transfer // decide what to do
*/
var currInput = 1;
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
async function getCount() {
    const date = parseDate(document.getElementById("date").value);
    const message = [localStorage.getItem('school'), date];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/getCurrLunch', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            console.log(result.message);
        });
    });
}
function showCurrentCount() {
    const count = getCount();
}
async function sendDate() {
    const date = parseDate(document.getElementById("date").value);
    const message = [localStorage.getItem('school'), date];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/getCurrLunch', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            if(result.message.length === 0) {
                document.getElementById('header').innerHTML = 'Create Lunch';
                document.getElementById('changeLunch').style.display = 'none';
                document.getElementById('newLunch').style.display = 'block';
                sessionStorage.setItem("currState", "newPage");
            }
        });
    });
}
function setState() {
    checkValid();
    const state = sessionStorage.getItem("currState");
    sessionStorage.clear();
    sessionStorage.setItem("currState", state);
    if(state === "newPage") {
        document.getElementById('header').innerHTML = 'Create Lunch';
        document.getElementById('changeLunch').style.display = 'none';
        document.getElementById('newLunch').style.display = 'block';
        resetCourse();
    }
    document.getElementById('main').style.display = 'block';
}
function addItem() {
    const form = document.getElementById('inputForm');
    form.appendChild(createInput("Menu Item", "lunch", "text"));
    form.appendChild(document.createElement("br"));
    form.appendChild(createInput("Image", "image", "file"));
    form.appendChild(document.createElement("br"));
    currInput++;
}
function createInput(placeholder, id, type) {
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.className = 'lunchInputs';
    input.type = type;
    input.autocomplete = 'off';
    input.size = '40';
    input.id = id + currInput;
    if(type === "file") {
        input.accept = ".jpg,.jpeg,.webp,.png";
    }
    return input;
}

function nextCourse() {
    const prevCount = currInput;
    currInput = 1;
    const prevInputs = getInputs(prevCount);
    console.log(sessionStorage.getItem('currLunchItems'));
    if(sessionStorage.getItem('currLunchItems') === null) {
        sessionStorage.setItem('currLunchItems', JSON.stringify([prevInputs]));
    } else {
        var currLunch = JSON.parse(sessionStorage.getItem('currLunchItems'));
        currLunch.push(prevInputs);
        sessionStorage.setItem('currLunchItems', JSON.stringify(currLunch));
    }
    resetCourse();
}
function getInputs(numInputs) {
    var course = document.getElementById('courseIn1').value;
    var inputs = [];
    for(var i = 1; i < numInputs; i++) {
        inputs[i - 1] = [document.getElementById('lunch' + i).value, document.getElementById('image' + i).value];
    }
    return [course, inputs];
}
function resetCourse() {
    const form = document.getElementById('inputForm');
    form.innerHTML = '';
    var h3 = document.createElement('h3');
    h3.innerHTML = 'Course';
    const input = createInput("Course", "courseIn");
    form.appendChild(h3);
    form.appendChild(input);
    form.appendChild(document.createElement("br")); form.appendChild(document.createElement("br"));
    h3 = document.createElement('h3');
    h3.innerHTML = 'Course Items';
    form.appendChild(h3);
    addItem();
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