function admin() {
    window.location.href = "http://localhost:3000/admin";
}
function main() {
    window.location.href = "http://localhost:3000/student";
}
function adminLog() {
    window.location.href = "http://localhost:3000/admin/login";
}
function mainLog() {
    window.location.href = "http://localhost:3000/login";
}
function teacher() {
    window.location.href = "http://localhost:3000/teacher";
}
function teacherLog() {
    window.location.href = "http://localhost:3000/teacher/login";
}
function backendAdmin() {
    window.location.href = "http://localhost:3000/backend";
}
function backendLog() {
    window.location.href = "http://localhost:3000/backend/login";
}
function clearData() {
    localStorage.clear();
    sessionStorage.clear();
}
async function logOut() {
    await fetch('/logOut').then(response => {
        var data = response.json();
        data.then(async function(result) {
            console.log(result.message);
        });
    });
}