
const staffs = JSON.parse(
    localStorage.getItem("staff")
) ?? [];

function checkSys() {

    if (!staffs.length) {
        logoutUser();
    }

}
// =====================================
// LOGIN
// =====================================

function loginUser(user){

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );
}

// =====================================
// LOGOUT
// =====================================

function logoutUser(){

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
    "welcome.html";
}

function checkSys(){


}

// =====================================
// GET CURRENT USER
// =====================================

function getCurrentUser(){

    return JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );
}

// =====================================
// CHECK AUTH
// =====================================

function requireAuth(){

    const user =
        getCurrentUser();

    if(!user){

        window.location.replace(
            "welcome.html"
        );

        return false;
    }

    return true;
}
requireAuth();
//heckSys();