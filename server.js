const express = require('express');
const { get } = require('http');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
var path = require('path');
app.use(express.json({limit: '1mb'}))

app.use(express.static(path.join(__dirname, 'public')));


var NedbStore = require('nedb-session-store')(session);
const sharedSecretKey = "ThisIsNotSecure"; // Will be updated to be stored securely once the server isnt being run on localhost
app.use(
  session({
    secret: sharedSecretKey,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      path: '/',
      httpOnly: true,
      // 365 * 24 * 60 * 60 * 1000 == 1 year 
      maxAge: 3 * 60 * 60 * 1000  // == 3 hours
    },
    store: new NedbStore({
      filename: 'databases/sessions.db'
    })
  })
);
// //Middleware to add validation to request
// app.use((req, res, next) => {
//     //console.log('Session:', req.session.isLogged != true);
//     if(req.session.isLogged != true) {
//         req.body.isValid = false;
//     } else { 
//         req.body.isValid = true;
//         next();}
// });


/*
TODO - 
    Clear user selections when school updates menu
    Organize code better
    Setup class code creation system and teacher page
    Think of more top bar buttons
*/
//set links to corresponding html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/main/redirects.html'));
});
app.get('/admin/login', (req, res) => {
    if(req.session.isAdmin != true) {
        res.sendFile(path.join(__dirname, '/public/admin/adminSignIn.html'));
    } else {
        res.redirect('/admin/');
    }
});
app.get('/admin', (req, res) => {
    if(req.session.isAdmin != true) {
        res.redirect('/admin/login');
    } else {
        res.sendFile(path.join(__dirname, '/public/admin/adminPage.html'));
    }
    
});
app.get('/Login', (req, res) => {
    if(req.session.isLogged != true) {
        res.sendFile(path.join(__dirname, '/public/main/signInPage.html'));
    } else {
        res.redirect('/student');
    }
});
app.get('/student', (req, res) => {
    if(req.session.isLogged != true) {
        res.redirect('/Login');
    } else {
        res.sendFile(path.join(__dirname, '/public/main/mainPage.html'));
    }
});
app.get('/admin/createLunch', (req, res) => {
    if(req.session.isAdmin != true) {
        res.redirect('/admin/login');
    } else {
        res.sendFile(path.join(__dirname, '/public/admin/subpages/changeLunch.html'));
    }
});
app.get('/admin/yourCount', (req, res) => {
    if(req.session.isAdmin != true) {
        res.redirect('/admin/login');
    } else {
        res.sendFile(path.join(__dirname, '/public/admin/subpages/seeCount.html'));
    }
});
app.get('/admin/addStudents', (req, res) => {
    if(req.session.isAdmin != true) {
        res.redirect('/admin/login');
    } else {
        res.sendFile(path.join(__dirname, '/public/admin/subpages/addStudents.html'));
    }
});
app.get('/admin/test', (req, res) => {
    if(req.session.isAdmin != true) {
        res.redirect('/admin/login');
    } else {
        res.sendFile(path.join(__dirname, '/public/admin/subpages/test.html'));
    }
});
app.get('/teacher/login', (req, res) => {
    if(req.session.isTeacher != true) {
        res.sendFile(path.join(__dirname, '/public/teacher/teacherSignIn.html'));
    } else {
        res.redirect('/teacher/');
    }
});
app.get('/teacher', (req, res) => {
    if(req.session.isTeacher != true) {
        res.redirect('/teacher/login');
    } else {
        res.sendFile(path.join(__dirname, '/public/teacher/teacherPage.html'));
    }
    
});
app.get('/backend', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/backendAdmin/backendPage.html'));
});
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/select2', express.static(__dirname + '/node_modules/select2/dist/'));
app.use("/admin/images", express.static(__dirname + "/images"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/files", express.static(__dirname + "/files"));
app.use("/scripts", express.static(__dirname + "/scripts"));


app.post('/test', (req, res) => {
    const data = req.body;
    res.end;
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
console.log(getDate());

//Add School To Database
app.post('/addSchool', (req, res) => {
    const userData = req.body;
    const school = getEmail(userData.adminEmail);
    var isValid = false;
    schoolLogin.find({school: school}, (err, data) => {
        if(data.length > 0) {
           isValid = false;
        } else {
            isValid = true;
            bcrypt.hash(userData.adminPass, saltRounds, function(err, hash) {
                schoolLogin.insert({school: school, adminEmails: [userData.adminEmail], adminPasswords: hash, teacherEmails: [],
                     teacherPasswords: hash, schoolEmails: [], classCodes: [], userCodes: {}, teacherCodes: {}, classData: {}, date: getDate()});
            });
        }
        res.json({
            school: school,
            valid: isValid
        });
    })
});

/*
    Main Page Functions
*/
//get and send images to user for MainPage
app.get('/fetchImageSet', (req, res) => {
    //const school = req.body.school;
    var date = getDate();
    var returnData = [];
    schoolLunches.find({$and: [{ school: req.session.school }, { date: date }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].menu;
           
        }
        res.json({
            message: returnData
        });
    })
});
//post gets user lunch count from main page and updates user and school counts
app.post('/updateLunchCount', (req, res) => {
    const schoolData = req.body;
    const school = req.session.school; const user = req.session.userName; const selections = schoolData[0]; const date = getDate();
    schoolLunches.find({$and: [{ school: school }, { date: date }]}, (err, data) => {
        var prevSelections = [];
        var jsonCounts = {};
        if(data.length > 0) {
            if(data[0].hasOwnProperty("userCounts")) {
                jsonCounts = JSON.parse(data[0].userCounts);
                if(jsonCounts.hasOwnProperty(user)) {
                    prevSelections = jsonCounts[user];
                }
            }
        } 
        jsonCounts[user] = selections;
        //console.log(jsonCounts);
        schoolLunches.update({$and: [{ school: school }, { date: date }]}, { $set: { userCounts: JSON.stringify(jsonCounts) } }, (err, numReplaced) => {
            schoolLunches.find({$and: [{ school: school }, { date: date }]}, (err, data) => {
                if(data.length > 0) {
                    var currCount = data[0].counts;
                    for(var i = 0; i < selections.length; i++) {
                        var curr = selections[i][0];
                        currCount[curr] = currCount[curr] + 1;
                    }
                    for(var i = 0; i < prevSelections.length; i++) {
                        var curr = prevSelections[i][0];
                        currCount[curr] = currCount[curr] - 1;
                    }
                    schoolLunches.update({$and: [{ school: school }, { date: date }]}, { $set: { counts: currCount } }, (err, numReplaced) => {});
                } 
            })
        });
    })
    
    //console.log(data)
    var returnData = true;
    res.json({
        message: returnData
    });
});



/*
    Login Page Functions
*/
app.get('/logOut', (req, res) => {
    req.session.destroy(function(err) {})
    res.json({
        message: true  
    });
});
//validate logins for main login
app.post('/validateUser', (req, res) => {
    const userData = req.body;
    const school = getEmail(userData.email);
    var isValid = false;
    schoolLogin.find({school: school}, (err, data) => {
        var teacher = "";
        if(data.length > 0) {
            teacher = JSON.parse(data[0].classData)[userData.classCode];
            const schoolData = [data[0].schoolEmails, data[0].classCodes];
            isValid = validLogin(schoolData, userData);
        }
        if(isValid) {
            var userClass = JSON.parse(data[0].userCodes);
            const classData = JSON.parse(data[0].classData);
            var users = classData[userData.classCode].users;
            if(userClass.hasOwnProperty(userData.email) && classData.hasOwnProperty(userClass[userData.email])) {

                var oldClass = userClass[userData.email];
                if(oldClass !== userData.classCode) {
                    userClass[userData.email] = userData.classCode;
                    var oldClassUsers = classData[oldClass].users;
                    const index = oldClassUsers.indexOf(userData.email);
                    if (index > -1) { 
                        oldClassUsers.splice(index, 1); 
                    }
                    classData[oldClass].users = oldClassUsers;
                }
            } else {
                userClass[userData.email] = userData.classCode;
            }
            if(!users.includes(userData.email)) {users.push(userData.email)}
            classData[userData.classCode].users = users;
            schoolLogin.update({ school: school }, { $set: { classData: JSON.stringify(classData), userCodes: JSON.stringify(userClass) } }, function (err, numReplaced) {});
            req.session.userName = userData.email;
            req.session.school = school;
            req.session.isLogged = true;
        }
        res.json({
            class: teacher,
            school: school,
            valid: isValid
        });
    })
});
//validate logins for admin login
app.post('/validateTeacher', (req, res) => {
    const userData = req.body;
    const school = getEmail(userData.email);
    var isValid = false;
    schoolLogin.find({school: school}, (err, data) => {
        if(data.length > 0) {
            if(school === "school2.edu") {
                const teacherData = [data[0].teacherEmails, data[0].teacherPasswords];
                const validEmail = teacherData[0].includes(userData.email);
                bcrypt.compare(userData.teacherPass, teacherData[1], function(err, result) {
                    isValid = result && validEmail;
                    if(isValid) {
                        req.session.teacherUser = userData.email;
                        req.session.teacherSchool = school;
                        req.session.isTeacher = true;
                        const classCode = JSON.parse(data[0].teacherCodes)[userData.email];
                        if(classCode === undefined) {
                            req.session.teacherClassCode = -1;
                        } else {
                            req.session.teacherClassCode = classCode;
                        }
                    }
                    res.json({
                        school: school,
                        valid: isValid
                    });
                });
            }
        }
    })
});
//validate logins for admin login
app.post('/validateAdmin', (req, res) => {
    const userData = req.body;
    const school = getEmail(userData.email);
    var isValid = false;
    schoolLogin.find({school: school}, (err, data) => {
        if(data.length > 0) {
            if(school === "school2.edu") {
                const schoolData = [data[0].adminEmails, data[0].adminPasswords];
                const validEmail = data[0].adminEmails[0] === userData.email;
                bcrypt.compare(userData.adminPass, data[0].adminPasswords, function(err, result) {
                    isValid = result && validEmail;
                    console.log(isValid);
                    if(isValid) {
                        req.session.adminUser = userData.email;
                        req.session.adminSchool = school;
                        req.session.isAdmin = true;
                    }
                    res.json({
                        school: school,
                        valid: isValid
                    });
                });
            } else {
                const schoolData = [data[0].adminEmails, data[0].adminPasswords];
                isValid = validAdminLogin(schoolData, userData);
                if(isValid) {
                    req.session.adminUser = userData.email;
                    req.session.adminSchool = school;
                    req.session.isAdmin = true;
                }
                res.json({
                    school: school,
                    valid: isValid
                });
            }
        }
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
    Teacher Page Functions

*/
app.post('/createClassCode', (req, res) => {
    var currCode = req.session.teacherClassCode;
    const school = req.session.teacherSchool;
    const teacherEmail = req.session.teacherUser;
    var randCode = Math.floor(Math.random() * 9000 + 1000).toString();
    var success = false;
    if(!req.body[0] && currCode > 999) {
        res.json({
            success: true,
            classCode: currCode
        });
    } else {
        schoolLogin.find({school: school}, async (err, data) => {
            if(data.length > 0) {
                var usedCodes = data[0].classCodes;
                var teacherClass = JSON.parse(data[0].teacherCodes);
                success = !usedCodes.includes(randCode);
                var i = 0;
                while(i < 15 && !success) {
                    var j = 0;
                    randCode = Math.floor(Math.random() * 9000 + 1000).toString();
                    success = !usedCodes.includes(randCode);
                    i++
                }
                if(success) {
                    const index = usedCodes.indexOf(currCode)
                    var classData = JSON.parse(data[0].classData)
                    var currClassData = {};
                    if(index > -1) {
                        usedCodes.splice(index, 1)
                        currClassData = classData[currCode];
                        delete classData[currCode];
                    } else {
                        currClassData = {users: [], teacher: teacherEmail};
                    }
                    classData[randCode] = currClassData;
                    usedCodes.push(randCode)
                    teacherClass[teacherEmail] = randCode;
                    req.session.teacherClassCode = randCode;
                    const students = currClassData.users;
                    var studentCodes = JSON.parse(data[0].userCodes);
                    for(var i = 0; i < students.length; i++) {
                        studentCodes[students[i]] = randCode;
                    }
                    schoolLogin.update({ school: school }, { $set: { classCodes: usedCodes, teacherCodes: JSON.stringify(teacherClass),
                        classData: JSON.stringify(classData), userCodes: JSON.stringify(studentCodes)} }, function (err, numReplaced) {});
                }
                res.json({
                    success: success,
                    classCode: randCode
                });
            } else {
                res.json({
                    success: false
                });
            } 
            
        })
    }
});
/*
    Admin Page Functions

*/
//Add Students to School Database
app.post('/addUsers', (req, res) => {
    const emailsToAdd = req.body[0];
    const areStudents = req.body[1];
    var school = req.session.adminSchool;
    schoolLogin.find({school: school}, (err, data) => {
        if(data.length > 0) {
            if(areStudents) {
                schoolLogin.update({ school: school }, { $addToSet: { schoolEmails: { $each: emailsToAdd } } }, function (err, numReplaced) {});
            } else {
                schoolLogin.update({ school: school }, { $addToSet: { teacherEmails: { $each: emailsToAdd } } }, function (err, numReplaced) {});
            }
            res.json({
                message: true
            });
        } else {
            res.json({
                message: false
            });
        }
    })
});
app.post('/getCurrLunch', (req, res) => {
    const adminData = req.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData = data[0];
        }
        res.json({
            message: returnData
        });
    })
});
app.post('/submitLunch', (req, res) => {
    const lunchData = req.body;
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
            schoolLunches.update({$and: [{ school: lunchData[0] }, { date: lunchData[1] }]}, { $set: { menu: lunchData[2], counts: jsonCounts},
                $unset: { userCounts: true } }, function (err, numReplaced) {});
            //userCounts.update({$and: [{ school: lunchData[0] }, { date: lunchData[1] }]}, { $unset: { userCounts: true } }, (err, numReplaced) => {});
        } else {
            schoolLunches.insert({school: lunchData[0], date: lunchData[1], menu: lunchData[2], counts: jsonCounts});
            //userCounts.insert({school: lunchData[0], date: lunchData[1], userCounts: {}});
            var returnData = [true];
            res.json({
            message: returnData
            });
        }
    })
});
app.post('/getLunchOptions', (req, res) => {
    var returnData = [];
    const adminData = req.body;
    optionCaches.find({ school: adminData[0] }, (err, data) => {
        if(data.length > 0) {
            returnData = data[0].options;
            res.json({
                message: returnData
            });
        } else {
            optionCaches.find({ school: "all" }, (err, data) => {
                if(data.length > 0) {
                    returnData = data[0].options;
                }
                res.json({
                    message: returnData
                });
            })
        }
    })
});
app.post('/getLunchCount', (req, res) => {
    const adminData = req.body;
    var returnData = {};
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: getDate() }]}, (err, data) => {
        if(data.length > 0) {
            schoolLogin.find({school: adminData[0]}, (err, usersData) => {
                if(data.length > 0) {
                    
                    returnData.users = usersData[0].schoolEmails;
                    returnData.menu = data[0].menu;
                    returnData.counts = data[0].counts;
                    returnData.userCounts = data[0].userCounts;
                    //console.log(returnData);
                }
                res.json({
                    message: returnData
                });
            })
            //console.log(returnData);
        } else {
            res.json({
                message: returnData
            });   
        }
    })
});
app.post('/updateLunch', (req, res) => {
    const adminData = req.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].courses;
            returnData[1] = data[0].imageNames;
        }
        res.json({
            message: returnData
        });
    })
});
app.post('/createLunch', (req, res) => {
    const adminData = req.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].courses;
            returnData[1] = data[0].imageNames;
        }
        res.json({
            message: returnData
        });
    })
});
app.post('/getCount', (req, res) => {
    const adminData = req.body;
    var returnData = [];
    schoolLunches.find({$and: [{ school: adminData[0] }, { date: adminData[1] }]}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].courses;
            returnData[1] = data[0].imageNames;
        }
        res.json({
            message: returnData
        });
    })
});
/*
    Teacher Page Functions
*/
app.post('/getClassCount', (req, res) => {
    const adminData = req.body;
    var returnData = {};
    schoolLunches.find({$and: [{ school: req.session.teacherSchool }, { date: getDate() }]}, (err, data) => {
        if(data.length > 0) {
            schoolLogin.find({school: req.session.teacherSchool}, (err, usersData) => {
                if(data.length > 0) {
                    returnData.users = JSON.parse(usersData[0].classData)[req.session.teacherClassCode].users;
                    returnData.menu = data[0].menu;
                    returnData.userCounts = data[0].userCounts;
                    //console.log(returnData);
                }
                res.json({
                    message: returnData
                });
            })
            //console.log(returnData);
        } else {
            res.json({
                message: returnData
            });   
        }
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