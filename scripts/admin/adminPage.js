/*
TODO - 
    Add student view option
    Stop menu submission if boxes are not filled
*/
/*
CSS Ideas - 
    ChangeLunch - Make courses show up 3 per row // make course divs have background and or outline to seperate them clearly
*/

/*
    All Page Functions
*/
function checkValid() {
    // const admin = localStorage.getItem("admin");
    // if(admin === null) {
    //     window.location.href = "http://localhost:3000/adminLogin";
    // }
}

/*
    Show Count Functions
*/
//function gets current count for today from server and calls showCount to display the data
async function getCount() {
    //const date = parseDate(document.getElementById("date").value);
    const message = [localStorage.getItem("schoolAdmin"),"6/7/2024"];
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
            getOptions(localStorage.getItem('schoolAdmin'));
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
    document.getElementById('updateForm').innerHTML = '';
    document.getElementById('inputForm').innerHTML = '';
    getOptions(localStorage.getItem('schoolAdmin'));
    document.getElementById('header').innerHTML = 'Create Lunch';
    //document.getElementById('changeLunch').style.display = 'none';
    document.getElementById('updateLunch').style.display = 'none';
    document.getElementById('newLunch').style.display = 'block';
    const form = document.getElementById('inputForm')
    const flex = document.createElement('div'); flex.className = "coursesFlexbox"; flex.id = "courseFlex";
    form.appendChild(flex);
    newCourse("inputForm");
    
    document.getElementById('main').style.display = 'block';
    
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
    if(currCourse - 1 === deletedCourses) {
        //document.getElementById('courseFlex').style.justifyContent = 'center';
    }
    //console.log(id)
    div.remove();
}
async function addItem(id) {
    const div = document.getElementById('courseDiv' + id);
    const idMod = id + '' + courseLengths[id][1];
    courseLengths[id][0]++;
    courseLengths[id][1]++;
    var childBelow = document.getElementById("appendButtonsDiv" + id)
    appendSelectBefore(div, childBelow, idMod, true);
    formatSelect('item' + idMod);
    currInput++;
}
var temp = [];
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
            temp = result.message;
            const opsSet = [...result.message[0][1], ...result.message[1][1]];
            if(opsSet.length != 0) {
                for(var i = 0; i < opsSet.length; i++) {
                    selectBoxOptions[i] = {id: opsSet[i][0], text: opsSet[i][1]};
                }
            }
            
        });
    });
}
function appendSelectBefore(parent, child, idMod, placeholder) {
    const select = document.createElement('select'); select.name = "selects";
    const mainDiv = document.createElement('div');const div1 = document.createElement('div'); const div2 = document.createElement('div');const div3 = document.createElement('div');
    div1.className = "selectDivSide"; div2.className = "selectDivMid";div3.className = "selectDivSide"; mainDiv.className = "selectDivMain";
    mainDiv.id = "select" + idMod;
    select.className = 'lunchInputs'; select.id = 'item' + idMod; select.style.width = "100%"; select.style.margin = "100px";
    if(placeholder) {select.appendChild(document.createElement('option'));}
    div2.appendChild(select);
    var but = document.createElement("input"); but.type = "button"; but.id = "min" + idMod; but.className = "minButton";
    but.onclick = function() { subItem(this.id.substring(3)); }; but.value = "-"; div3.appendChild(but);
    mainDiv.appendChild(div1); mainDiv.appendChild(div2); mainDiv.appendChild(div3)
    parent.insertBefore(mainDiv, child);
}
function newCourse(formID) {
    addCourse(formID, true, "");
    addItem(currCourse)
    currCourse++;
}
function addCourse1(formID, isNew, courseVal) {
    courseLengths[currCourse] = [0, 0];
    const form = document.getElementById(formID);
    const mainDiv = document.createElement('div');const div1 = document.createElement('div'); const div2 = document.createElement('div');const div3 = document.createElement('div');
    div1.className = "courseDivSide"; div2.className = "courseDivMid";div3.className = "courseDivSide"; mainDiv.className = "courseDivMain";
    mainDiv.id = "courseDiv" + currCourse;
    var but = document.createElement("input"); but.type = "button"; but.id = "min" + currCourse; but.className = "minButtonCourse";
    but.onclick = function() { subCourse(this.id.substring(3)); }; but.value = "Remove"; div3.appendChild(but); 
    var h3 = document.createElement('h3');  h3.innerHTML = 'Course';
    var hr = document.createElement('hr'); hr.style.width = "15%"; hr.id = "hr" + currCourse;
    mainDiv.appendChild(hr)
    div2.appendChild(h3); mainDiv.appendChild(div1); mainDiv.appendChild(div2); mainDiv.appendChild(div3)
    const input = createInput("Course", "courseIn", currCourse);
    if(!isNew) {input.value = courseVal;}
    mainDiv.appendChild(input); 
    mainDiv.appendChild(document.createElement("br")); mainDiv.appendChild(document.createElement("br"));
    h3 = document.createElement('h3');
    h3.innerHTML = 'Course Items';
    mainDiv.appendChild(h3);
    var buttonDiv = document.createElement("div"); buttonDiv.className = "appendButtonsDiv"; buttonDiv.id = "appendButtonsDiv" + currCourse;
    but = document.createElement("input"); but.type = "button"; but.id = "add" + currCourse; but.className = "addButton";
    but.onclick = function() { addItem(this.id.substring(3)) }; but.value = "+"; buttonDiv.appendChild(but); mainDiv.appendChild(buttonDiv);
    form.appendChild(mainDiv);
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
        if(course.replace(/\s+/g, '') === '') {return false;}
        for(var i = numPrev; i < courseLengths[j][0] + numPrev; i++) {
            var select = selects[i];
            var text = select.options[select.selectedIndex].text;
            var src = select.options[select.selectedIndex].value;
            if(src === '') {return false;}
            inputs[i - numPrev] = [text, src];
        }
        numPrev += courseLengths[j][0];
        menu[j - numSkipped] = [course, inputs];  
    }
    // sessionStorage.setItem("currLunchItems", JSON.stringify(menu));
    console.log(menu);
    return menu;
    //console.log(menu);
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
    currCourse = 0;
    for(var i = 0; i < currMenu.length; i++) {
        addCourse("updateForm", false, currMenu[i][0]);
        addCourseItems(currMenu[i][1]);
        currCourse++;
    }
}
//function resets menu html and variables
function resetMenu() {
    getOptions(localStorage.getItem('schoolAdmin'))
    currItem = 1;
    currCourse = 0;
    const form = document.getElementById('updateForm');
    form.innerHTML = '';
    const flex = document.createElement('div'); flex.className = "coursesFlexbox"; flex.id = "courseFlex";
    form.appendChild(flex);
    loadCourses();
}

//function sends new lunch menu to the server
async function submitLunch() {
    const menu = getMenu();
    if(menu === false) {
        alertBox("Please Fill In or Remove Empty Items or Courses\n\n");
        return;
    }
    const message = [localStorage.getItem('schoolAdmin'), parseDate(document.getElementById('date').value), menu];
    const options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(message)}
    await fetch('/submitLunch', options).then(response => {
        var data = response.json();
        data.then(async function(result) {
            getDateData();
        });
    });
}

//function sends updated lunch menu to the server
async function updateLunch() {
    const menu = getMenu();
    if(menu === false) {
        alertBox("Please Fill In or Remove Empty Items or Courses\n\n");
        return;
    }
    const message = [localStorage.getItem('schoolAdmin'), parseDate(document.getElementById('date').value), menu];
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
    input.width = '80%';
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

//gets lunch options data from server and sets up select boxes for fetched options
function formatSelect(id) {
    function formatOption(option) {
        if (!option.id) {return option.text;}
        var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectOptionImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.2vw">' + option.text + '</div></div></div></span>');
        return optionWithImage;
      }
      function formatSelected(option) {
          if (!option.id) {return option.text;}
          var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.2vw">' + option.text + '</div></div></div></span>');
          return optionWithImage;
        }
    $('#' + id).select2({templateResult: formatOption, templateSelection: formatSelected, tags: false, placeholder: "Select An Item"});

    for(var i = 0; i < temp.length; i++) {
        var optgroup = $('<optgroup class="lunchOptGroup">');
        optgroup.attr('label', temp[i][0]);
        for(var j = 0; j < temp[i][1].length; j++) {
            var option = $("<option></option>");
            option.val(temp[i][1][j][0]);
            option.text(temp[i][1][j][1]);
            optgroup.append(option);
            $('#' + id).append(optgroup);
        }
    }
  }
async function formatSelectSpecific(firstOption, selectId) {
    var a = true;
    function formatOption(option) {
      if (!option.id) {return option.text;}
      var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectOptionImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.2vw">' + option.text + '</div></div></div></span>');
      return optionWithImage;
    }
    function formatSelected(option) {
        if (!option.id) {return option.text;}
        var optionWithImage = $('<span class="textCont"><div style="display: flex;"><img src="images/' + option.id + '" class="selectImg" /><div style="display: table"><div style="display: table-cell; vertical-align: middle; font-size: 1.2vw">' + option.text + '</div></div></div></span>');
        return optionWithImage;
      }
      if(a) {
        $('#' + selectId).select2({templateResult: formatOption, templateSelection: formatSelected, tags: false});
        a = false
        for(var i = 0; i < temp.length; i++) {
            var optgroup = $('<optgroup>');
            optgroup.attr('label', temp[i][0]);
            for(var j = 0; j < temp[i][1].length; j++) {
                var option = $("<option></option>");
                option.val(temp[i][1][j][0]);
                option.text(temp[i][1][j][1]);
                if(temp[i][1][j][1] === firstOption.text) {
                    var option = $("<option selected='true'></option>");
                } 
                option.val(temp[i][1][j][0]);
                option.text(temp[i][1][j][1]);
                optgroup.append(option);
                $('#' + selectId).append(optgroup);
            }
        }
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

function addCourse(formID, isNew, courseVal) {
    courseLengths[currCourse] = [0, 0];
    const flex = document.getElementById("courseFlex");
    if(currCourse > 0) {
        //flex.style.justifyContent = 'left';
    }
    const filler1 = document.createElement('div'); const filler2 = document.createElement('div');
    filler1.className = "courseFillerDiv"; filler2.className = "courseFillerDiv";
    const mainDiv = document.createElement('div'); const div1 = document.createElement('div'); const div2 = document.createElement('div');const div3 = document.createElement('div');
    div1.className = "courseDivSide"; div2.className = "courseDivMid";div3.className = "courseDivSide"; mainDiv.className = "courseDivMain";
    mainDiv.id = "courseDiv" + currCourse;
    var but = document.createElement("input"); but.type = "button"; but.id = "min" + currCourse; but.className = "minButtonCourse";
    but.onclick = function() { subCourse(this.id.substring(3)); }; but.value = "Remove"; div3.appendChild(but); 
    var h3 = document.createElement('h3');  h3.innerHTML = 'Course';
    // var hr = document.createElement('hr'); hr.style.width = "15%"; hr.id = "hr" + currCourse;
    // mainDiv.appendChild(hr)
    div2.appendChild(h3); mainDiv.appendChild(div1); mainDiv.appendChild(div2); mainDiv.appendChild(div3)
    const input = createInput("Course", "courseIn", currCourse);
    if(!isNew) {input.value = courseVal;}
    mainDiv.appendChild(input); 
    mainDiv.appendChild(document.createElement("br")); mainDiv.appendChild(document.createElement("br"));
    h3 = document.createElement('h3');
    h3.innerHTML = 'Course Items';
    mainDiv.appendChild(h3);
    var buttonDiv = document.createElement("div"); buttonDiv.className = "appendButtonsDiv"; buttonDiv.id = "appendButtonsDiv" + currCourse;
    but = document.createElement("input"); but.type = "button"; but.id = "add" + currCourse; but.className = "addButton";
    but.onclick = function() { addItem(this.id.substring(3)) }; but.value = "+"; buttonDiv.appendChild(but); mainDiv.appendChild(buttonDiv);
    
   flex.appendChild(mainDiv)
}