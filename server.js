const express = require('express');
const { get } = require('http');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
var path = require('path');
app.use(express.json({limit: '1mb'}))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/main/redirects.html'));
});
app.get('/AdminLogin', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/admin/adminSignIn.html'));
});
app.get('/AdminPage', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/admin/adminPage.html'));
});
app.get('/Login', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/main/signInPage.html'));
});
app.get('/main', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/main/mainPage.html'));
});
app.use("/images", express.static("/data"));

const imageSets = [["cheeseburger3.jpg", "chickenSandwich3.jpeg"], ["fries.webP", "taterTots.webp"]];
const imageNameSets = [["Cheeseburger", "Chicken Sandwich"], ["French Fries", "Tater Tots"]];
app.post('/fetchImageSet', (request, response) => {
    response.json({
        images: imageSets,
        imageNames: imageNameSets
    });
});


const schoolEmails = ["user.1@school.edu"]
const adminEmails = ["admin.1@school.edu"]
var classCodes = ["1234"]
var adminPasses = ["1234"]
var schoolData = [schoolEmails, classCodes, adminEmails, adminPasses];
var schools = new Map();
schools.set('school.edu', schoolData);
app.post('/validateUser', (request, response) => {
    const data = request.body;
    const school = getEmail(data.email);
    var isValid = false;
    if(schools.has(school)) {
        isValid = validLogin(schools.get(school), data);
    }
    response.json({
        valid: isValid
    });
});

app.post('/validateAdmin', (request, response) => {
    const data = request.body;
    const school = getEmail(data.email);
    var isValid = false;
    if(schools.has(school)) {
        isValid = validAdminLogin(schools.get(school), data);
    }
    response.json({
        valid: isValid
    });
});

function validLogin(schoolData, userData) {
    const emails = schoolData[0];
    const codes = schoolData[1];
    return emails.includes(userData.email) && codes.includes(userData.classCode);
}
function validAdminLogin(schoolData, userData) {
    const emails = schoolData[2];
    const passes = schoolData[3];
    return emails.includes(userData.email) && passes.includes(userData.adminPass);
}
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