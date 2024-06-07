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
var currItem = 0;
var currCourse = 0;
var selectBoxOptions = [];
var currMenu = [];
//function gets date input from user and gets back whether or not there is a lunch created and sends the data if so
async function getDateData() {
    if(document.getElementById("date").value === '') {
        document.getElementById('header').innerHTML = 'Change Lunch';
        document.getElementById('inputForm').innerHTML = '';
        document.getElementById('updateForm').innerHTML = '';
        document.getElementById('newLunch').style.display = 'none';
        document.getElementById('updateLunch').style.display = 'none';

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
            getOptions(localStorage.getItem('school'));
            if(result.message.length === 0) {
                showCreateLunch();
            } else {
                lunchData = result.message;
                currMenu = JSON.parse(lunchData.menu)
                showUpdateLunch();
            }
        });
    });
}
function showUpdateLunch() {
    document.getElementById('header').innerHTML = 'Update Lunch';
    //document.getElementById('changeLunch').style.display = 'none';
    document.getElementById('newLunch').style.display = 'none';
    document.getElementById('inputForm').innerHTML = '';
    document.getElementById('updateLunch').style.display = 'block';
    document.getElementById('main').style.display = 'block';
    resetMenu();
}
//function >
function showCreateLunch() {
    sessionStorage.clear();
    document.getElementById('updateForm').innerHTML = '';
    getOptions(localStorage.getItem('school'));
    document.getElementById('header').innerHTML = 'Create Lunch';
    //document.getElementById('changeLunch').style.display = 'none';
    document.getElementById('updateLunch').style.display = 'none';
    document.getElementById('newLunch').style.display = 'block';
    resetCourse();
    
    document.getElementById('main').style.display = 'block';
}
//function adds item to current course
function addItem() {
    const form = document.getElementById('inputForm');
    appendSelect(form, currInput, true);
    formatSelect('item' + currInput);
    form.appendChild(document.createElement("br"));
    currInput++;
}
//function loads select box options client side
async function getOptions(school) {
    const message = [school];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    //ask server for lunch on selected date
    await fetch('/getLunchOptions', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            const opsSet = [...result.message[0][1], ...result.message[1][1]];
            if(opsSet.length != 0) {
                for(var i = 0; i < opsSet.length; i++) {
                    selectBoxOptions[i] = {id: opsSet[i][0], text: opsSet[i][1]};
                }
            }
        });
    });
}
//function creates a new select element and appends it to the given parent element
function appendSelect(parent, idMod, placeholder) {
    const select = document.createElement('select');
    const div = document.createElement('div');
    div.className = 'selectDivs';
    select.className = 'lunchInputs'; select.id = 'item' + idMod; select.style.width = "20%"; select.style.margin = "100px";
    if(placeholder) {select.appendChild(document.createElement('option'));}
    div.appendChild(select);
    parent.appendChild(div);
}
function nextCourse() {
    updateLocal();
    // const p = JSON.parse(sessionStorage.getItem('currLunchItems'))
    resetCourse();
}
//function gets and returns select box inputs for the given course
function getSelections(numInputs, courseID) {
    var course = document.getElementById(courseID).value;
    var inputs = [];
    for(var i = 1; i < numInputs; i++) {
        var select = document.getElementById("item" + i);
        var text = select.options[select.selectedIndex].text;
        var src = select.options[select.selectedIndex].value;
        inputs[i - 1] = [text, src];
    }
    return [course, inputs];
}
//function adds select boxes with given menu items selected by default
function addCourseItems(items) {
    const form = document.getElementById('updateForm');
    for(var i = 0; i < items.length; i++) {
        appendSelect(form, currItem, false);
        //formatSelect("item" + currItem)
        formatSelectSpecific({id: items[i][1], text: items[i][0]},'item' + currItem);
        form.appendChild(document.createElement("br"));
        currItem++;
    }
    
}
//function adds all courses from currMenu into the update form
function loadCourses() {
    const form = document.getElementById('updateForm');
    for(currCourse = 0; currCourse < currMenu.length; currCourse++) {
        var h3 = document.createElement('h3');
        h3.innerHTML = 'Course';
        var input = createInput("Course", "courseIn", currCourse + 1);
        input.value = currMenu[currCourse][0];
        form.appendChild(h3);
        form.appendChild(input);
        form.appendChild(document.createElement("br")); form.appendChild(document.createElement("br"));
        h3 = document.createElement('h3');
        h3.innerHTML = 'Course Items';
        addCourseItems(currMenu[currCourse][1]);
    }
}
//function resets menu html and variables
function resetMenu() {
    getOptions(localStorage.getItem('school'))
    currItem = 1;
    currCourse = 0;
    const form = document.getElementById('updateForm');
    form.innerHTML = '';
    loadCourses();
}
//function resets course html and variables
function resetCourse() {
    currInput = 1;
    const form = document.getElementById('inputForm');
    form.innerHTML = '';
    var h3 = document.createElement('h3');
    h3.innerHTML = 'Course';
    const input = createInput("Course", "courseIn", currInput);
    form.appendChild(h3);
    form.appendChild(input);
    form.appendChild(document.createElement("br")); form.appendChild(document.createElement("br"));
    h3 = document.createElement('h3');
    h3.innerHTML = 'Course Items';
    form.appendChild(h3);
    addItem();
}
//function updates local storage to hold all input items for the new menu
function updateLocal() {
    const prevCount = currInput;
    currInput = 1;
    const prevInputs = getSelections(prevCount, "courseIn1");
    if(sessionStorage.getItem('currLunchItems') === null) {
        sessionStorage.setItem('currLunchItems', JSON.stringify([prevInputs]));
        // const p = JSON.parse(sessionStorage.getItem('currLunchItems'))[0]
    } else {
        var currLunch = JSON.parse(sessionStorage.getItem('currLunchItems'));
        currLunch.push(prevInputs);
        sessionStorage.setItem('currLunchItems', JSON.stringify(currLunch));
    }
}
//function sends new lunch menu to the server
async function submitLunch() {
    updateLocal();
    const message = [localStorage.getItem('school'), parseDate(document.getElementById('date').value), sessionStorage.getItem('currLunchItems')];
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
//function gets updated menu selections and sets them to session storage
function getUpdated() {
    var j = 1
    var passedItems = 0;
    updatedMenu = []
    for(var i = 0; i < currMenu.length; i++) {
        inputs = [];
        while(j <= currMenu[i][1].length + passedItems) {
            var select = document.getElementById("item" + j);
            var text = select.options[select.selectedIndex].text;
            var src = select.options[select.selectedIndex].value;
            inputs[j - 1 - passedItems] = [text, src];
            j++;
            //console.log(inputs);
        }
        passedItems += currMenu[i][1].length;
        updatedMenu[i] = [document.getElementById("courseIn" + (i + 1)).value, inputs];
    }
    sessionStorage.setItem("temp", JSON.stringify(updatedMenu));
}
//function sends updated lunch menu to the server
async function updateLunch() {
    getUpdated();
    console.log(updatedMenu);
    const message = [localStorage.getItem('school'), parseDate(document.getElementById('date').value), sessionStorage.getItem("temp", updatedMenu)];
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

/*
    Helper Functions
*/
function backToDate() {
    sessionStorage.clear();
    document.getElementById('inputForm').innerHTML = '';
    document.getElementById('newLunch').style.display = 'none';
    document.getElementById('header').innerHTML = 'Change Lunch';
    document.getElementById('changeLunch').style.display = 'block';
}
function createInput(placeholder, id, idOffset) {
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.className = 'lunchCourseInput';
    input.type = "text";
    input.autocomplete = 'off';
    input.size = '40';
    input.id = id + idOffset;
    return input;
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

function getURL(input) {
    var reader = new FileReader();
    var file = 0;
    reader.onload = function (e) {
             file = e.target.result;
           };
    reader.readAsDataURL(input.files[0]);
    return reader.onload;
    // if (input.files && input.files[0]) {
    //   var reader = new FileReader();
  
    //   reader.onload = function (e) {
    //     document.getElementById('blah').src = e.target.result;
    //   };

    //   reader.readAsDataURL(input.files[0]);
    // }
  }
function test() {
    console.log('ssss');
   
}
function changePlace(id) {
    $('#item-1').attr('placeholder', 'New Placeholder Text').select2()
}
//gets lunch options data from server and sets up select boxes for fetched options
function formatSelect(id) {
    function formatOption(option) {
        if (!option.id) {return option.text;}
        var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectOptionImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.4vw">' + option.text + '</div></div></div></span>');
        return optionWithImage;
      }
      function formatSelected(option) {
          if (!option.id) {return option.text;}
          var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.4vw">' + option.text + '</div></div></div></span>');
          return optionWithImage;
        }
    $('#' + id).select2({templateResult: formatOption, templateSelection: formatSelected,data: selectBoxOptions, tags: false, placeholder: "Select Your Item"});
  }
async function formatSelectSpecific(firstOption, selectId) {
    var specialOptions = [firstOption, ...selectBoxOptions];
    var a = true;
    const repeatItem = selectBoxOptions.find(item => {
        return item.id == firstOption.id;
     })
    const index = 1 + selectBoxOptions.indexOf(repeatItem);
    specialOptions.splice(index, 1);
    //specOptions.concat(selectBoxOptions);
    var firstSet = false;
    function formatOption(option) {
      if (!option.id) {return option.text;}
      var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectOptionImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.4vw">' + option.text + '</div></div></div></span>');
      return optionWithImage;
    }
    function formatSelected(option) {
        if (!option.id) {return option.text;}
        var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.4vw">' + option.text + '</div></div></div></span>');
        return optionWithImage;
      }
      if(a) {
        $('#' + selectId).select2({templateResult: formatOption, templateSelection: formatSelected,data: specialOptions, tags: false});
        a = false
    }
    //$('#item-2').select2().val(null).trigger('change');
    // $('#' + selectId).on('select2:select', function (e) {
    //     var data = e.params.data;
    //     console.log(data);
    //     //$('#' + selectId).select2({templateResult: formatOption, templateSelection: formatSelected,data: {id: "h", text: "a"}, tags: false, placeholder: "fe"}).trigger('change');
    //     //$('#' + selectId).trigger('change');
    //     return;
    // });
    
  }