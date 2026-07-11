
/*==================================
BABBAGE POS AUTH ENGINE
==================================*/

function getCurrentUser(){

return JSON.parse(
localStorage.getItem(
"currentUser"
)
);

}
 const thisUser =getCurrentUser();


/*==================================
PERMISSION CHECK
==================================*/

function hasAccess(...allowedRoles){

const currentUser =
getCurrentUser();

if(!currentUser){

alert(
"Session expired. Please login again."
);

window.location =
"login.html";

return false;

}


const userAccess =

String(
currentUser.access || ""
)

.toLowerCase()

.trim();


return allowedRoles.some(

role =>

userAccess ===

String(role)

.toLowerCase()

.trim()

);

}



/*==================================
ADMIN CHECK
==================================*/

function isAdmin(){

return hasAccess(

"Administrator",
"Admin"

);

}


    



    


/*==================================
ACTION PROTECTION
==================================*/

function requirePermission(
actionText,
...allowedRoles
){

if(

!hasAccess(
...allowedRoles
)

){

alert(

`Access denied.\nYou do not have permission to ${actionText}.`

);

return false;

}

return true;

}

/*const adminKey=document.getElementById("adminLink");
        adminKey.addEventListener('click',()=>{
        if(thisUser.access==="Administrator"){
        window.location="pr.html"; 

    }else{
        showModal(`Sorry ${thisUser.firstName}`,'Login as Admin','info');
                  setTimeout(()=>{
                window.location="login.html";  
        },2000);
        
    }
   
}); */

function watchMan(){
    const activeUser = JSON.parse(localStorage.getItem('currentUser'))||[];
    if(!activeUser)return(window.location="login.html");
    if(activeUser.access!=="Administrator"){
           showModal(`Sorry ${activeUser.firstName}`,'Login As Admin','info');
                  setTimeout(()=>{
                window.location="login.html";  
        },2000);
    }
}

function linso(){
    setInterval(watchMan,2000);
}
