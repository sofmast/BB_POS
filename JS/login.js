// ============================================
// BABBAGE POS
// LOGIN ENGINE
// ============================================

const form =
document.getElementById(
    "loginForm"
);

const usernameInput =
document.getElementById(
    "username"
);

const passwordInput =
document.getElementById(
    "password"
);

const rememberMe =
document.getElementById(
    "rememberMe"
);

const togglePassword =
document.getElementById(
    "togglePassword"
);

const loginButton =
document.querySelector(
    ".login-btn"
);

// ============================================
// PASSWORD TOGGLE
// ============================================

togglePassword.addEventListener(
    "click",
    () => {

        const hidden =
        passwordInput.type ===
        "password";

        passwordInput.type =
        hidden
        ? "text"
        : "password";

        togglePassword.innerHTML =
        hidden
        ?
        '<i class="fa-solid fa-eye-slash"></i>'
        :
        '<i class="fa-solid fa-eye"></i>';

    }
);

// defosta//

/*============================================
INITIALIZE DEFAULT STAFF
============================================*/

function initializeDefaultStaff(){

const staff = getStaff();

if(staff.length > 0){

return;

}

const now = createDateObject();

const baseId = Date.now();


const defaultStaff = [

{

    id: baseId + 1,

    staffNumber:"EMP001",

    manNumber:"0001",

    username:"elekiah",

    password:"admin",

    firstName:"Mr. Elekia",

    lastName:"Mloongo",

    fullName:"Mr. Elekia Mloongo",

    phone:"0975080150",

    email:"",

    nrc:"",

    department:"Administration",

    role:"System Administrator",

    access:"Administrator",

    salary:0,

    status:"Active",

    blacklisted:false,

    photo:"",

    createdDate:now,

    updatedDate:now,

    lastLogin:null

},


{

    id: baseId + 2,

    staffNumber:"EMP002",

    manNumber:"0002",

    username:"myapp",

    password:"admin2",

    firstName:"System",

    lastName:"System",

    fullName:"Babbage POS",

    phone:"+260772250680",

    email:"itprozambia@gmail.com",

    nrc:"",

    department:"IT",

    role:"Developer",

    access:"Administrator",

    salary:0,

    status:"Active",

    blacklisted:false,

    photo:"",

    createdDate:now,

    updatedDate:now,

    lastLogin:null


},
{

    id: baseId + 3,

    staffNumber:"EMP0013",

    manNumber:"0003",

    username:"pos",

    password:"admin",

    firstName:"Mr Elekiah",

    lastName:"Mloongo",

    fullName:"Mr. Elekia Mloongo",

    phone:"0975080150",

    email:"",

    nrc:"",

    department:"Administration",

    role:"System Administrator",

    access:"Administrator",

    salary:0,

    status:"Active",

    blacklisted:false,

    photo:"",

    createdDate:now,

    updatedDate:now,

    lastLogin:null

}





];


saveStaff(
defaultStaff
);


showModal(

"Welcome",

"To Babbage Point Of Sale",

"success"

);

}



/*===============================================
           LOAD DEFAULT
=============================================*/
initializeDefaultStaff();


// ============================================
// LOAD STAFF
// ============================================

function getStaff(){

    return JSON.parse(

        localStorage.getItem(
            "staff"
        )

    ) || [];

}




// ============================================
// SAVE STAFF
// ============================================

function saveStaff(data){

    localStorage.setItem(

        "staff",

        JSON.stringify(data)

    );

}



// ============================================
// FIND USER
// ============================================

function findUser(login){

    const value =
    login.trim()
    .toLowerCase();

    return getStaff().find(staff=>{

        return (

            staff.username?.toLowerCase()===value ||

            staff.staffNumber?.toLowerCase()===value ||

            staff.manNumber?.toLowerCase()===value

        );

    });

}

// ============================================
// LOGIN BUTTON LOADING
// ============================================

function setLoading(state){

    if(state){

        loginButton.disabled = true;

        loginButton.innerHTML =

        `<i class="fa-solid fa-spinner fa-spin"></i>

        Signing In...`;

    }

    else{

        loginButton.disabled = false;

        loginButton.innerHTML =

        `<i class="fa-solid fa-right-to-bracket"></i>

        Sign In`;

    }

}

// ============================================
// LOGIN
// ============================================

form.addEventListener(

    "submit",

    function(e){

        e.preventDefault();

        setLoading(true);

        setTimeout(()=>{

            login();

        },500);

    }

);

// ============================================
// LOGIN FUNCTION
// ============================================

function login(){

    const loginName =

    usernameInput.value.trim();

    const password =

    passwordInput.value;

    if(

        loginName===""

        ||

        password===""

    ){

        setLoading(false);

        showModal(

            "error",

            "Missing Information",

            "Enter username and password."

        );

        return;

    }

    const staff =

    getStaff();

    const employee =

    findUser(loginName);

    if(!employee){

        setLoading(false);

        showModal(

            "Sorry but",

            "Login Failed",

            "info"

        );

        return;

    }

    if(employee.password !== password){

        setLoading(false);

        showModal(

            "error",

            "Login Failed",

            "error"

        );

        return;

    }

    if(

        employee.blacklisted===true ||

        employee.blacklisted==="true"

    ){

        setLoading(false);

        showModal(

            "error",

            "This account has been blacklisted.",

            "errow."

        );

        return;

    }

    if(

        employee.status &&

        employee.status!=="Active"

    ){

        setLoading(false);

        showModal(

            "error",

            "Access Denied",

            `Status : ${employee.status}`

        );

        return;

    }

    // =====================================
    // UPDATE LOGIN DATE
    // =====================================

    employee.lastLogin =

    createDateObject();

    employee.updatedDate =

    createDateObject();

    const updatedStaff =

    staff.map(person=>{

        return String(person.id)===String(employee.id)

        ?

        employee

        :

        person;

    });

    saveStaff(updatedStaff);

    // =====================================
    // SESSION
    // =====================================

    const currentUser={

        id:employee.id,

        username:employee.username,

        staffNumber:employee.staffNumber,

        manNumber:employee.manNumber,

        access:employee.access,

        department:employee.department,

        firstName:employee.firstName,

        lastName:employee.lastName,

        fullName:

        `${employee.firstName} ${employee.lastName}`,

        photo:

        employee.photo || "",

        lastLogin:

        employee.lastLogin

    };

    localStorage.setItem(

        "currentUser",

        JSON.stringify(currentUser)

    );

    // =====================================
    // REMEMBER LOGIN
    // =====================================

    if(

        rememberMe.checked

    ){

        localStorage.setItem(

            "rememberUser",

            loginName

        );

    }

    else{

        localStorage.removeItem(

            "rememberUser"

        );

    }

    setLoading(false);

    showModal(

         `Welcome ${employee.firstName}.`,

        "Login Successful",
        "success",

       

    );

    setTimeout(()=>{

        window.location=

        "index.html";

    },1200);

}

// ============================================
// REMEMBER USER
// ============================================

window.addEventListener(

    "load",

    ()=>{

        const remembered =

        localStorage.getItem(

            "rememberUser"

        );

        if(remembered){

            usernameInput.value=

            remembered;

            rememberMe.checked=

            true;

            passwordInput.focus();

        }

    }

);
const resetKey = document.getElementById('rezetBtn');
function resetApp(){
   

    showModal('Empted','You have flashed out all the application data','error');
localStorage.clear();
    }