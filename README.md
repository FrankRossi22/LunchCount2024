//Click Code in the Top Left To View This Correctly//
when running on server redirects can be found in the server.js file // 
the app.get('/') functions show the different redirects: // 
ex - // 
app.get('/AdminLogin', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/admin/adminSignIn.html'));
}); // 
so adminSignIn.html can be accessed through http://localhost:3000/adminLogin
