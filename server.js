const express = require('express');
const { get } = require('http');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
var path = require('path');
app.use(express.json({limit: '1mb'}))

app.use(express.static(path.join(__dirname, 'public')));


/*
TODO - 
    Setup better login system
    Clear user selections when school updates menu
    Organize code better
    Setup class code creation system and teacher page
    Think of more top bar buttons
    Setup buttons to be able to middle click to open in new tab
*/

//set links to corresponding html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/main/redirects.html'));
});
app.get('/AdminLogin', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/adminSignIn.html'));
});
app.get('/AdminPage', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/adminPage.html'));
});
app.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/main/signInPage.html'));
});
app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/main/mainPage.html'));
});
app.get('/createLunch', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/subpages/changeLunch.html'));
});
app.get('/yourCount', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/subpages/seeCount.html'));
});
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/subpages/test.html'));
});
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/select2', express.static(__dirname + '/node_modules/select2/dist/'));
app.use("/images", express.static(__dirname + "/images"));
app.use("/files", express.static(__dirname + "/files"));
app.use("/scripts", express.static(__dirname + "/scripts"));


app.post('/test', (request, response) => {
    const data = request.body;
    response.end;
});

//load databases
const Datastore = require('nedb');
const { data } = require('jquery');
const schoolLogin = new Datastore('databases/user.db');
const schoolLunches = new Datastore('databases/lunchOptions.db');
const userCounts = new Datastore('databases/userCounts.db');
const optionCaches = new Datastore('databases/schoolMenuItems.db');
optionCaches.loadDatabase();
schoolLogin.loadDatabase();
schoolLunches.loadDatabase();
userCounts.loadDatabase();
console.log(getDate())


/*
    Main Page Functions
*/
//get and send images to user for MainPage
app.post('/fetchImageSet', (request, response) => {
    const school = request.body.school;
    var date = getDate();
    var returnData = [];
    schoolLunches.find({$and: [{ school: school }, { date: date }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].menu;
           
        }
        response.json({
            message: returnData
        });
    })
});
//post gets user lunch count from main page and updates user and school counts
app.post('/updateLunchCount', (request, response) => {
    const schoolData = request.body;
    const school = schoolData[0]; const user = schoolData[1]; const selections = schoolData[2]; const date = getDate();
    //console.log(choices)
    userCounts.find({$and: [{ user: user }, { date: date }]}, (err, data) => {
        //console.log(data);
        var prevSelections = [];
        if(data.length > 0) {
            prevSelections = data[0].data;
        } else {
            userCounts.insert({user: user, date: date});
        }
        userCounts.update({$and: [{ user: user }, { date: date }]}, { $set: { data: selections } }, (err, numReplaced) => {
            schoolLunches.find({$and: [{ school: school }, { date: date }]}, (err, data) => {
                if(data.length > 0) {
                    var currCount = data[0].counts;
                    for(var i = 0; i < selections.length; i++) {
                        var curr = JSON.parse(selections[i])[0];
                        currCount[curr] = currCount[curr] + 1;
                    }
                    for(var i = 0; i < prevSelections.length; i++) {
                        var curr = JSON.parse(prevSelections[i])[0];
                        currCount[curr] = currCount[curr] - 1;
                    }
                    schoolLunches.update({$and: [{ school: school }, { date: date }]}, { $set: { counts: currCount } }, (err, numReplaced) => {});
                } 
            })
        });
    })
    
    //console.log(data)
    var returnData = true;
    response.json({
        message: returnData
    });
});



/*
    Login Page Functions
*/
//validate logins for main login
app.post('/validateUser', (request, response) => {
    const userData = request.body;
    const school = getEmail(userData.email);
    var isValid = false;
    schoolLogin.find({school: school}, (err, data) => {
        if(data.length > 0) {
           const schoolData = [data[0].schoolEmails, data[0].classCodes];
           isValid = validLogin(schoolData, userData);
        }
        response.json({
            school: school,
            valid: isValid
        });
    })
});
//validate logins for admin login
app.post('/validateAdmin', (request, response) => {
    const userData = request.body;
    const school = getEmail(userData.email);
    var isValid = false;
    schoolLogin.find({school: school}, (err, data) => {
        if(data.length > 0) {
           const schoolData = [data[0].adminEmails, data[0].adminPasswords];
           isValid = validAdminLogin(schoolData, userData);
        }
        response.json({
            school: school,
            valid: isValid
        });
    })
});
function validLogin(schoolData, userData) {
    const emails = schoolData[0];
    const codes = schoolData[1];
    return emails.includes(userData.email) && codes.includes(userData.classCode);
}
function validAdminLogin(schoolData, userData) {
    const adminEmails = schoolData[0];
    const passes = schoolData[1];
    return adminEmails.includes(userData.email) && passes.includes(userData.adminPass);
}
//gets school by returning everything in user email after the @
function getEmail(userEmail) {
    var email = '';
    for(var i = userEmail.length - 1; i >= 0; i--) {
        if(userEmail.charAt(i) === '@') {
            email = userEmail.substring(i + 1);
            return email;
        }
    }
    return email;
}

/*
    Admin Page Functions
*/
app.post('/getCurrLunch', (request, response) => {
    const adminData = request.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData = data[0];
        }
        response.json({
            message: returnData
        });
    })
});
app.post('/submitLunch', (request, response) => {
    const lunchData = request.body;
    var fullMenu = lunchData[2];
    var items = [];
    for(var i = 0; i < fullMenu.length; i++) {
        items.push(...fullMenu[i][1])
    }
    var jsonCounts = {}
    for(var i = 0; i < items.length; i++) {
        jsonCounts[items[i][0]] = 0;
    }
    schoolLunches.find({$and: [{ school: lunchData[0] }, { date: lunchData[1] }]}, (err, data) => {
        //console.log(data);

        if(data.length > 0) {
            schoolLunches.update({$and: [{ school: lunchData[0] }, { date: lunchData[1] }]}, { $set: { menu: lunchData[2], counts: jsonCounts } }, function (err, numReplaced) {});
        } else {
            schoolLunches.insert({school: lunchData[0], date: lunchData[1], menu: lunchData[2], counts: jsonCounts});
            var returnData = [true];
            response.json({
            message: returnData
            });
        }
    })
});
app.post('/getLunchOptions', (request, response) => {
    var returnData = [];
    const adminData = request.body;
    optionCaches.find({ school: adminData[0] }, (err, data) => {
        if(data.length > 0) {
            returnData = data[0].options;
            response.json({
                message: returnData
            });
        } else {
            optionCaches.find({ school: "all" }, (err, data) => {
                if(data.length > 0) {
                    returnData = data[0].options;
                }
                response.json({
                    message: returnData
                });
            })
        }
    })
});
app.post('/getLunchCount', (request, response) => {
    const adminData = request.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: getDate() }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].menu;
            returnData[1] = data[0].counts;
            //console.log(returnData);
        }
        response.json({
            message: returnData
        });
    })
});
app.post('/updateLunch', (request, response) => {
    const adminData = request.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].courses;
            returnData[1] = data[0].imageNames;
        }
        response.json({
            message: returnData
        });
    })
});
app.post('/createLunch', (request, response) => {
    const adminData = request.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].courses;
            returnData[1] = data[0].imageNames;
        }
        response.json({
            message: returnData
        });
    })
});
app.post('/getCount', (request, response) => {
    const adminData = request.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].courses;
            returnData[1] = data[0].imageNames;
        }
        response.json({
            message: returnData
        });
    })
});
/*
    Helper Functions
*/
//temporary function to add schools to databases
function addSchool() {
    const schoolEmails = ["user.1@osu.edu", "user.2@osu.edu", "user.3@osu.edu"];
    const adminEmails = ["admin.1@osu.edu"];
    var classCodes = ["1970", "2004"];
    var adminPasses = ["1969"];
    schoolLogin.insert({school: "osu.edu", schoolEmails: schoolEmails, classCodes: classCodes, adminEmails: adminEmails, adminPasswords: adminPasses});
    const imageSets = [["pizza.jpg","tacos.jpg"],["salad.jpg","corn.jpg"]];
    const imageNameSets = [["Pizza","Tacos"],["Salad","Corn"]];
    schoolLunches.insert({school: "osu.edu", images: imageSets, imageNames: imageNameSets});
}

function getDate() {
    date = new Date(Date.now()).toLocaleString();
    
    return date.substring(0, date.indexOf(','))
}