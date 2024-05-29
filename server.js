const express = require('express');
const { get } = require('http');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
var path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/main/signInPage.html'));
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