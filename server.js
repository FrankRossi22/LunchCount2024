const express = require('express');
const { get } = require('http');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
var path = require('path');
app.use(express.json({limit: '1mb'}))

app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/main/mainPage.html'));
});
app.use("/images", express.static("/data"));

//load databases
const Datastore = require('nedb')
const schoolLogin = new Datastore('databases/user.db')
const schoolImages = new Datastore('databases/images.db')
schoolLogin.loadDatabase();
schoolImages.loadDatabase();
//addSchool();

//get and send images to user for MainPage
app.post('/fetchImageSet', (request, response) => {
    const data = request.body.school;
    var returnData = [];
    schoolImages.find({school: data}, (err, data) => {
        if(data.length > 0) {
            returnData[0] = data[0].images;
            returnData[1] = data[0].imageNames;
            returnData[2] = data[0].courses;
        }
        response.json({
            message: returnData
        });
    })
});

app.post('/updateLunchCount', (request, response) => {
    const data = request.body;
    console.log(data);
    var returnData = true;
    response.json({
        message: returnData
    });
    
});


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

//temporary function to add schools to databases
function addSchool() {
    const schoolEmails = ["user.1@osu.edu", "user.2@osu.edu", "user.3@osu.edu"];
    const adminEmails = ["admin.1@osu.edu"];
    var classCodes = ["1970", "2004"];
    var adminPasses = ["1969"];
    schoolLogin.insert({school: "osu.edu", schoolEmails: schoolEmails, classCodes: classCodes, adminEmails: adminEmails, adminPasswords: adminPasses});
    const imageSets = [["pizza.jpg","tacos.jpg"],["salad.jpg","corn.jpg"]];
    const imageNameSets = [["Pizza","Tacos"],["Salad","Corn"]];
    schoolImages.insert({school: "osu.edu", images: imageSets, imageNames: imageNameSets});
}