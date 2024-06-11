/*
TODO - 
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
//function gets current count for today from server and calls showCount to display the data
async function getCount() {
    //const date = parseDate(document.getElementById("date").value);
    const message = [localStorage.getItem('school'), "6/7/2024"];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/getLunchCount', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            showCount(result.message[0], result.message[1])
        });
    });
}
//function displays lunch count data from given schoolData
function showCount(menu, counts) {
    var div = document.getElementById('countsDiv');
    for(var i = 0; i < menu.length; i++) {
        var h3 = document.createElement('h3'); var hr = document.createElement('hr');
        h3.innerHTML = menu[i][0];
        div.appendChild(h3);
        hr.style.width = "15%";
        div.appendChild(hr); 
        for(var j = 0; j < menu[i][1].length; j++) {
            var p = document.createElement('p'); var curr = menu[i][1][j][0]
            p.innerHTML = curr + ":    " + counts[curr];
            div.appendChild(p);
        }
    }
    

}
/*
    Create Lunch Page Functions
*/
var currInput = 0;
var currItem = 0;
var currCourse = 0;
var deletedCourses = 0;
var courseLengths = [];
var selectBoxOptions = [];
var currMenu = [];
//function gets date input from user and gets back whether or not there is a lunch created and sends the data if so
async function getDateData() {
    await getOptions("all");
    currInput = 0;
    currItem = 0;
    currCourse = 0;
    deletedCourses = 0;
    selectBoxOptions = [];
    currMenu = [];
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
                currMenu = lunchData.menu
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
    document.getElementById('updateForm').innerHTML = '';
    document.getElementById('updateLunch').style.display = 'block';
    document.getElementById('main').style.display = 'block';
    resetMenu();
}
//function >
function showCreateLunch() {
    sessionStorage.clear();
    document.getElementById('updateForm').innerHTML = '';
    document.getElementById('inputForm').innerHTML = '';
    getOptions(localStorage.getItem('school'));
    document.getElementById('header').innerHTML = 'Create Lunch';
    //document.getElementById('changeLunch').style.display = 'none';
    document.getElementById('updateLunch').style.display = 'none';
    document.getElementById('newLunch').style.display = 'block';
    addCourse();
    
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
function subItem(id) {
    const div = document.getElementById("select" + id);
    courseLengths[id.charAt(0)][0]--;
    //console.log(id)
    div.remove();
}
function subCourse(id) {
    const div = document.getElementById("courseDiv" + id);
    courseLengths[id] = null; deletedCourses++;
    //console.log(id)
    div.remove();
}
async function addItemTest(id) {
    //const form = document.getElementById('inputForm');
    const div = document.getElementById('courseDiv' + id);
    const idMod = id + '' + courseLengths[id][1];
    //console.log(id)
    courseLengths[id][0]++;
    courseLengths[id][1]++;
    console.log(id)
    // if((id + 1) < currCourse) {
    //     appendSelectBefore(form, document.getElementById(id), currInput, true);
    // } else {
    //     appendSelect(form, currInput, true);
    // }
    //await getOptions("all");
    var childBelow = document.getElementById("appendButtonsDiv" + id)
    console.log(childBelow)
    appendSelectBefore(div, childBelow, idMod, true);
    formatSelect('item' + idMod);
    //form.insertBefore(document.createElement("br"), childBelow); form.insertBefore(document.createElement("br"), childBelow);
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
    const select = document.createElement('select'); select.name = "selects";
    const div = document.createElement('div');
    div.className = 'selectDivs'; div.id = "select" + idMod;
    select.className = 'lunchInputs'; select.id = 'item' + idMod; select.style.width = "20%"; select.style.margin = "100px";
    if(placeholder) {select.appendChild(document.createElement('option'));}
    div.appendChild(select);
    var but = document.createElement("input"); but.type = "button"; but.id = "min" + idMod; but.className = "minButton";
    but.onclick = function() { subItem(this.id.substring(3)); }; but.value = "-"; div.appendChild(but);
    parent.appendChild(div);
}
function appendSelectBefore(parent, child, idMod, placeholder) {
    const select = document.createElement('select'); select.name = "selects";
    const div = document.createElement('div');
    div.className = 'selectDivs'; div.id = "select" + idMod;
    select.className = 'lunchInputs'; select.id = 'item' + idMod; select.style.width = "20%"; select.style.margin = "100px";
    if(placeholder) {select.appendChild(document.createElement('option'));}
    div.appendChild(select);
    var but = document.createElement("input"); but.type = "button"; but.id = "min" + idMod; but.className = "minButton";
    but.onclick = function() { subItem(this.id.substring(3)); }; but.value = "-"; div.appendChild(but);
    parent.insertBefore(div, child);
}
function test() {
    var sels = document.getElementsByName("selects");
    
    for(var i = 0; i < sels.length; i++) {
        var select = sels[i]
        // var text = select.options[select.selectedIndex].text;
        // var src = select.options[select.selectedIndex].value;
        console.log(select.id);
    }

}
function nextCourse() {
    //updateLocal();
    // const p = JSON.parse(sessionStorage.getItem('currLunchItems'))
    addCourse();
}
function addCourse(formID) {
    //currInput = 1;
    courseLengths[currCourse] = [0, 0];
    const form = document.getElementById(formID);
    var div = document.createElement("div"); div.id = "courseDiv" + currCourse;
    //form.innerHTML = '';
    var h3 = document.createElement('h3');  h3.innerHTML = 'Course';
    var hr = document.createElement('hr'); hr.style.width = "15%"; hr.id = "hr" + currCourse;
    div.appendChild(hr)
    div.appendChild(h3)
    const input = createInput("Course", "courseIn", currCourse);
    div.appendChild(input);
    var but = document.createElement("input"); but.type = "button"; but.id = "min" + currCourse; but.className = "minButton";
    but.onclick = function() { subCourse(this.id.substring(3)); }; but.value = "-"; div.appendChild(but); 
    
    div.appendChild(document.createElement("br")); div.appendChild(document.createElement("br"));
    h3 = document.createElement('h3');
    h3.innerHTML = 'Course Items';
    div.appendChild(h3);
    var buttonDiv = document.createElement("div"); buttonDiv.className = "appendButtonsDiv"; buttonDiv.id = "appendButtonsDiv" + currCourse;
    but = document.createElement("input"); but.type = "button"; but.id = "add" + currCourse; but.className = "addButton";
    but.onclick = function() { addItemTest(this.id.substring(3)) }; but.value = "+"; buttonDiv.appendChild(but); div.appendChild(buttonDiv);
    form.appendChild(div);
    addItemTest(currCourse);
    currCourse++;
}
function getMenu() {
    
    var menu = [];
    var numPrev = 0;
    var numSkipped = 0;
    const selects = document.getElementsByName("selects");
    for(var j = 0; j < courseLengths.length; j++) {
        while(courseLengths[j] === null) {
            j++;
            numSkipped++;
            if(j >= courseLengths.length) {console.log(menu);return menu;}
        }
        var inputs = []
        var input = document.getElementById("courseIn" + j);
        var course = input.value;

        for(var i = numPrev; i < courseLengths[j][0] + numPrev; i++) {
            var select = selects[i];
            var text = select.options[select.selectedIndex].text;
            var src = select.options[select.selectedIndex].value;
            inputs[i - numPrev] = [text, src];
        }
        numPrev += courseLengths[j][0];
        menu[j - numSkipped] = [course, inputs];  
    }
    // sessionStorage.setItem("currLunchItems", JSON.stringify(menu));
    return menu;
    //console.log(menu);
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
    const div = document.getElementById('courseDiv' + currCourse);
    const butDiv = document.getElementById('appendButtonsDiv' + currCourse);
    for(var i = 0; i < items.length; i++) {
        var idMod = currCourse + "" + courseLengths[currCourse][1];
        appendSelectBefore(div, butDiv, idMod, false);
        //formatSelect("item" + currItem)
        formatSelectSpecific({id: items[i][1], text: items[i][0]},'item' + idMod);
        //form.appendChild(document.createElement("br"));
        currInput++;
        courseLengths[currCourse][0]++; courseLengths[currCourse][1]++;
    }
    
}
//function adds all courses from currMenu into the update form
function loadCourses() {
    const form = document.getElementById('updateForm');
    currCourse = 0;
    for(var i = 0; i < currMenu.length; i++) {
        const currLength = currMenu[i][1].length;
        courseLengths[currCourse] = [0, 0];
        var div = document.createElement("div"); div.id = "courseDiv" + currCourse;
        //form.innerHTML = '';
        var h3 = document.createElement('h3');  h3.innerHTML = 'Course';
        var hr = document.createElement('hr'); hr.style.width = "15%"; hr.id = "hr" + currCourse;
        div.appendChild(hr)
        div.appendChild(h3)
        const input = createInput("Course", "courseIn", currCourse);
        input.value = currMenu[i][0];
        div.appendChild(input);
        var but = document.createElement("input"); but.type = "button"; but.id = "min" + currCourse; but.className = "minButton";
        but.onclick = function() { subCourse(this.id.substring(3)); }; but.value = "-"; div.appendChild(but); 
        
        div.appendChild(document.createElement("br")); div.appendChild(document.createElement("br"));
        h3 = document.createElement('h3');
        h3.innerHTML = 'Course Items';
        div.appendChild(h3);
        var buttonDiv = document.createElement("div"); buttonDiv.className = "appendButtonsDiv"; buttonDiv.id = "appendButtonsDiv" + currCourse;
        but = document.createElement("input"); but.type = "button"; but.id = "add" + currCourse; but.className = "addButton";
        but.onclick = function() { addItemTest(this.id.substring(3)) }; but.value = "+"; buttonDiv.appendChild(but); div.appendChild(buttonDiv);
        form.appendChild(div);
        addCourseItems(currMenu[i][1]);
        currCourse++;
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

//function sends new lunch menu to the server
async function submitLunch() {
    
    const message = [localStorage.getItem('school'), parseDate(document.getElementById('date').value), getMenu()];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/submitLunch', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            getDateData();
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
    const message = [localStorage.getItem('school'), parseDate(document.getElementById('date').value), getMenu()];
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    await fetch('/submitLunch', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            getDateData();
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
// function test() {
//     var sels = document.getElementsByClassName("hi");
//     var select = sels[0]
//     //var text = select.options[select.selectedIndex].text;
//     //var src = select.options[select.selectedIndex].value;
//     console.log(sels);

// }
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