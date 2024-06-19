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
var studentsCounts = [];
var students = [];
var menu = [];
async function getCount() {
    //const date = parseDate(document.getElementById("date").value);
    const message = [localStorage.getItem("schoolAdmin"),"6/7/2024"];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/getClassCount', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            if(result.message.users === undefined) {
                students = [];
            } else {
                students = result.message.users;
            }
            if(result.message.userCounts === undefined) {
                studentsCounts = {};
            } else {
                studentsCounts = JSON.parse(result.message.userCounts);
            }
            if(result.message.menu === undefined) {
                menu = [];
            } else {
                menu = result.message.menu;
            }
            
            showStudentCounts(studentsCounts, students, menu);
        });
    });
}
function getClassCount() {

}
function getStudentCounts() {

}

async function showStudentCounts(userCounts, users, menu){
    const classCounts = {};
    for(var i = 0; i < menu.length; i++) {
        const currCourse = menu[i][1];
        for(var j = 0; j < currCourse.length; j++) {
            classCounts[currCourse[j][0]] = 0;
            
        }
    }
    var div = document.getElementById('studentCounts');
    var hr = document.createElement('hr');
    hr.style.width = "15%";
    div.appendChild(hr);
    for(var i = 0; i < users.length; i++) {
        var str = users[i] + ": ";
        if(userCounts.hasOwnProperty(users[i])) {
            const currUser = userCounts[users[i]];
            for(var j = 0; j < currUser.length; j++) {
                classCounts[currUser[j][0]]++
                str += currUser[j][0] + ", ";
            }
            str = str.substring(0, str.length - 2);
        } else {
            str += 'NONE'
        }
        var p = document.createElement('p');
        p.innerHTML = str;
        div.appendChild(p);
        hr = document.createElement('hr');
        hr.style.width = "15%";
        div.appendChild(hr);
    }
    var div = document.getElementById('classTotal');
    if(menu.length === 0) {
        var p = document.createElement('p'); 
        p.innerHTML = 'No Lunch Data Yet!';
        div.appendChild(p);
    }
    for(var i = 0; i < menu.length; i++) {
        var h3 = document.createElement('h3'); var hr = document.createElement('hr');
        h3.innerHTML = menu[i][0];
        div.appendChild(h3);
        hr.style.width = "15%";
        div.appendChild(hr); 
        for(var j = 0; j < menu[i][1].length; j++) {
            var p = document.createElement('p'); var curr = menu[i][1][j][0]
            p.innerHTML = curr + ":    " + classCounts[curr];
            div.appendChild(p);
        }
    }
    
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

