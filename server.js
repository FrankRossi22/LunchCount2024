const express = require('express');
const { get } = require('http');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
var path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/main/mainPage.html'));
});
