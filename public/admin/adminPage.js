/*
TODO - 
    Everything besides formatting // setup server data transfer // decide what to do
*/


/*
    All Page Functions
*/
function checkValid() {
    const admin = localStorage.getItem("admin");
    if(admin === null) {
        window.location.href = "http://localhost:3000/adminLogin";
    }
}
/*
    Redirect Functions
*/
function showLunchCount() {
    window.location.href = "http://localhost:3000/yourCount";
}

function changeLunch() {
    window.location.href = "http://localhost:3000/createLunch";
}
function toMain() {
    window.location.href = "http://localhost:3000/adminPage";
}
/*
    Show Count Functions
*/
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
/*
    Create Lunch Page Functions
*/
var currInput = 1;
var selectBoxOptions = [];
//function gets date input from user and gets back whether or not there is a lunch created and sends the data if so
async function checkDate() {
    if(document.getElementById("date").value === '') {
        console.log("aaaaa");
        return;
    }
    const date = parseDate(document.getElementById("date").value);
    const message = [localStorage.getItem('school'), date];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    //ask server for lunch on selected date
    await fetch('/getCurrLunch', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            console.log(result.message + "adad");
            if(result.message.length === 0) {
                document.getElementById('header').innerHTML = 'Create Lunch';
                document.getElementById('changeLunch').style.display = 'none';
                document.getElementById('newLunch').style.display = 'block';
                sessionStorage.setItem("currState", "newPage");
                sessionStorage.setItem("currDate", date);
                setState();
            }
        });
    });
}
//function keeps state on reload
function setState() {
    checkValid();
    const state = [sessionStorage.getItem("currState"), sessionStorage.getItem("currDate")];
    sessionStorage.clear();
    sessionStorage.setItem("currState", state[0]);
    sessionStorage.setItem("currDate", state[1]);
    if(state[0] === "newPage") {
        getOptions();
        document.getElementById('header').innerHTML = 'Create Lunch';
        document.getElementById('changeLunch').style.display = 'none';
        document.getElementById('newLunch').style.display = 'block';
        resetCourse();
    }
    document.getElementById('main').style.display = 'block';
}
//function adds item to current course
function addItem() {
    const form = document.getElementById('inputForm');
    appendSelect("Menu Item", "lunch");
    form.appendChild(document.createElement("br"));
    currInput++;
}
//gets lunch options data from server and sets up select boxes for fetched options
function formatSelect() {
    function formatOption(option) {
      if (!option.id) {return option.text;}
      var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="img-flag" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.4vw">' + option.text + '</div></div></div></span>');
      return optionWithImage;
    }
    var options = [
      { id: 'apple.jpg', text: 'Apple' },
      { id: 'boscoSticks.jpg', text: 'Bosco Sticks' },
      { id: 'tacos.jpg', text: 'Tacos' },
      { id: 'cheeseburger.jpg', text: 'Cheesburger' },
      { id: 'fries.jpg', text: 'French Fries' },
      { id: 'taterTots.jpg', text: 'Tater Tots' }
    ];
    $('.lunchInputs').select2({templateResult: formatOption, templateSelection: formatOption,data: options, tags: false, placeholder: "Select Your Item"});
  }

  async function getOptions() {
    const message = [localStorage.getItem('school')];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    //ask server for lunch on selected date
    await fetch('/getLunchOptions', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            const opsSet = result.message;
            //console.log(opsSet);
            if(opsSet.length != 0) {
                for(var i = 0; i < opsSet.length; i++) {
                    selectBoxOptions[i] = {id: opsSet[i][0], text: opsSet[i][1]};
                }
                console.log(selectBoxOptions);
            }
            formatSelect();
        });
    });
}
function createInput(placeholder, id, type) {
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.className = 'lunchCourse';
    input.type = type;
    input.autocomplete = 'off';
    input.size = '40';
    input.id = id + currInput;
    if(type === "file") {
        input.accept = ".jpg,.jpeg,.webp,.png";
    }
    return input;
}
function appendSelect(placeholder, id) {
    const select = document.createElement('select');
    const div = document.createElement('div');
    div.className = 'selectDivs';
    select.className = 'lunchInputs'; select.id = 'item' + currInput; select.style.width = "20%"; select.style.margin = "100px";
    select.appendChild(document.createElement('option'));
    const form = document.getElementById('inputForm');
    div.appendChild(select);
    form.appendChild(div);
    formatSelect();
}
function nextCourse() {
    updateLocal();
    // const p = JSON.parse(sessionStorage.getItem('currLunchItems'))
    // console.log(p[0][1]);
    resetCourse();
}
function getSelections(numInputs) {
    var course = document.getElementById('courseIn1').value;
    var inputs = [];
    for(var i = 1; i < numInputs; i++) {
        var select = document.getElementById("item" + i);
        var text = select.options[select.selectedIndex].text
        inputs[i - 1] = text;
    }
    return [course, inputs];
}
function resetCourse() {
    currInput = 1;
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
function updateLocal() {
    const prevCount = currInput;
    currInput = 1;
    const prevInputs = getSelections(prevCount);
    if(sessionStorage.getItem('currLunchItems') === null) {
        sessionStorage.setItem('currLunchItems', JSON.stringify([prevInputs]));
        // const p = JSON.parse(sessionStorage.getItem('currLunchItems'))[0]
        // console.log(p);
    } else {
        var currLunch = JSON.parse(sessionStorage.getItem('currLunchItems'));
        currLunch.push([prevInputs]);
        sessionStorage.setItem('currLunchItems', JSON.stringify(currLunch));
    }
}
async function submitLunch() {
    updateLocal();
    const message = [localStorage.getItem('school'), sessionStorage.getItem('currDate'), sessionStorage.getItem('currLunchItems')];
    //console.log(message);
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/submitLunch', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            
        });
    });
}
function backToDate() {
    sessionStorage.clear();
    document.getElementById('inputForm').innerHTML = '';
    document.getElementById('newLunch').style.display = 'none';
    document.getElementById('header').innerHTML = 'Change Lunch';
    document.getElementById('changeLunch').style.display = 'block';
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

function getURL(input) {
    var reader = new FileReader();
    var file = 0;
    reader.onload = function (e) {
             file = e.target.result;
             console.log(file);
           };
    reader.readAsDataURL(input.files[0]);
    return reader.onload;
    // if (input.files && input.files[0]) {
    //   var reader = new FileReader();
  
    //   reader.onload = function (e) {
    //     document.getElementById('blah').src = e.target.result;
    //   };

    //   console.log(input.files[0].name)
    //   reader.readAsDataURL(input.files[0]);
    // }
  }
  function test() {
    console.log(sessionStorage.getItem('test'));
   
  }
  