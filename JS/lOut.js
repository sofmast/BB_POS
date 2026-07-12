
function logoutUser(){

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
    "welcome.html";
}