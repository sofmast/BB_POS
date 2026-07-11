/*==================================================
STAFF DETAILS
Professional Version
==================================================*/

/*==================================================
STORAGE
==================================================*/

function getStaff(){

    return JSON.parse(

        localStorage.getItem("staff")

    ) || [];

}

/*==================================================
CURRENT STAFF
==================================================*/

const selectedId =

localStorage.getItem(

"selectedStaff"

);

const employee =

getStaff().find(

staff =>

String(staff.id) === String(selectedId)

);

if(!employee){

alert(

"Staff record not found."

);

window.location =

"staff-list.html";

}

/*==================================================
HELPERS
==================================================*/

function value(v){

return v || "-";

}

function staffStatus(){

if(employee.status){

return employee.status;

}

if(

employee.blacklisted == true ||

employee.blacklisted == "true"

){

return "Suspended";

}

return "Active";

}

function badge(status){

switch(status){

case "Active":

return '<span class="badge active">🟢 Active</span>';

case "On Leave":

return '<span class="badge leave">🟡 On Leave</span>';

case "Suspended":

return '<span class="badge suspended">🔴 Suspended</span>';

default:

return '<span class="badge terminated">'+status+'</span>';

}

}

/*==================================================
PROFILE
==================================================*/

document.getElementById(

"staffPhoto"

).src =

employee.photo ||

"https://via.placeholder.com/200";

document.getElementById(

"staffName"

).textContent =

employee.fullName ||

`${employee.firstName} ${employee.lastName}`;

document.getElementById(

"staffPosition"

).textContent =

employee.position ||

employee.role ||

"-";

document.getElementById(

"statusBadge"

).innerHTML =

badge(

staffStatus()

);

/*==================================================
SUMMARY
==================================================*/

document.getElementById(

"staffNumber"

).textContent =

employee.staffNumber ||

employee.manNumber;

document.getElementById(

"staffDepartment"

).textContent =

value(employee.department);

document.getElementById(

"staffSalary"

).textContent =

formatCurrency(

employee.salary

);

document.getElementById(

"staffAccess"

).textContent =

value(employee.access);

document.getElementById(

"createdDate"

).textContent =

employee.createdDate ?

employee.createdDate.display :

"-";

document.getElementById(

"updatedDate"

).textContent =

employee.updatedDate ?

employee.updatedDate.display :

"-";

/*==================================================
PERSONAL
==================================================*/

document.getElementById(

"firstName"

).textContent =

value(employee.firstName);

document.getElementById(

"lastName"

).textContent =

value(employee.lastName);

document.getElementById(

"staffNrc"

).textContent =

value(employee.nrc);

document.getElementById(

"staffPhone"

).textContent =

value(employee.phone);

document.getElementById(

"staffEmail"

).textContent =

value(employee.email);

document.getElementById(

"staffUsername"

).textContent =

value(employee.username);

/*==================================================
EMPLOYMENT
==================================================*/

document.getElementById(

"employmentDepartment"

).textContent =

value(employee.department);

document.getElementById(

"employmentPosition"

).textContent =

value(

employee.position ||

employee.role

);

document.getElementById(

"employmentSalary"

).textContent =

formatCurrency(

employee.salary

);

document.getElementById(

"employmentStatus"

).innerHTML =

badge(

staffStatus()

);

document.getElementById(

"employmentAccess"

).textContent =

value(employee.access);

document.getElementById(

"employmentBlacklist"

).textContent =

employee.blacklisted == true ||

employee.blacklisted == "true"

?

"Yes"

:

"No";

/*==================================================
ACCOUNT
==================================================*/

document.getElementById(

"lastLogin"

).textContent =

employee.lastLogin ?

employee.lastLogin.display :

"Never";

document.getElementById(

"accountCreated"

).textContent =

employee.createdDate ?

employee.createdDate.display :

"-";

document.getElementById(

"accountUpdated"

).textContent =

employee.updatedDate ?

employee.updatedDate.display :

"-";

/*==================================================
EDIT
==================================================*/

function editCurrentStaff(){

localStorage.setItem(

"editingStaff",

JSON.stringify(employee)

);

window.location =

"createStaff.html";

}

document

.getElementById(

"editBtn"

)

.addEventListener(

"click",

editCurrentStaff

);

document

.getElementById(

"editStaffBtn"

)

.addEventListener(

"click",

editCurrentStaff

);

/*==================================================
DELETE
==================================================*/

document

.getElementById(

"deleteBtn"

)

.addEventListener(

"click",

()=>{

if(

!confirm(

"Delete this staff member?"

) ||currentUser.access!=='Aministrator'

)
{
alert('yakana ukufuta staff');
return;

}

let staff =

getStaff();

staff =

staff.filter(

x=>String(x.id)!==String(employee.id)

);

localStorage.setItem(

"staff",

JSON.stringify(staff)

);

localStorage.removeItem(

"selectedStaff"

);

alert(

"Staff deleted successfully."

);

window.location =

"staff.html";

});

/*==================================================
SUSPEND
==================================================*/

document

.getElementById(

"suspendBtn"

)

.addEventListener(

"click",

()=>{

const staff = getStaff();

const index =

staff.findIndex(

x=>String(x.id)===String(employee.id)

);

if(index==-1){

return;

}

staff[index].status =

staff[index].status==="Suspended"

?

"Active"

:

"Suspended";

staff[index].updatedDate =

createDateObject();

localStorage.setItem(

"staff",

JSON.stringify(staff)

);

location.reload();

});

/*==================================================
RESET PASSWORD
==================================================*/

document

.getElementById(

"resetPasswordBtn"

)

.addEventListener(

"click",

()=>{

alert(

"Password reset feature will be connected to the authentication module."

);

});