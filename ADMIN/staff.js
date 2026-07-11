

const photoInput =
document.getElementById("photo");

const photoPreview =
document.getElementById("photoPreview");

const changePhoto =
document.getElementById("changePhoto");

// form initialize//

const form =
document.getElementById(
    "staffForm"
);



if(changePhoto){

changePhoto.onclick=()=>{

photoInput.click();

};

}

if(photoInput){

photoInput.onchange=e=>{

const file=e.target.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=function(){

photoPreview.src=

reader.result;

};

reader.readAsDataURL(file);

};

}

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

let staff={

id:Date.now(),

firstName:
document.getElementById("firstName").value,

lastName:
document.getElementById("lastName").value,

nrc:
document.getElementById("nrc").value,

phone:
document.getElementById("phone").value,

department:
document.getElementById("department").value,

role:
document.getElementById("role").value,

salary:
document.getElementById("salary").value,

access:
document.getElementById("access").value,

blacklisted:
document.getElementById("blacklisted").value

};

let staffList=
JSON.parse(localStorage.getItem("staff")) || [];

staffList.push(staff);

localStorage.setItem(
"staff",
JSON.stringify(staffList)
);

alert(``);

form.reset();

});

}


const container=
document.getElementById("staffContainer");

if(container){

displayStaff();

}

//SAVE STAFF FUNCTION//


/*==================================================
STAFF STORAGE
==================================================*/

function getStaff() {

    return JSON.parse(
        localStorage.getItem("staff")
    ) || [];

}

function saveStaff(staffList) {

    localStorage.setItem(
        "staff",
        JSON.stringify(staffList)
    );

}

/*==================================================
FORM
==================================================*/



if(form){

const photoPreview =
document.getElementById(
    "photoPreview"
);

/*==================================
EDIT MODE
==================================*/

const editData =
JSON.parse(
localStorage.getItem(
"editingStaff"
));

if(editData){

document.getElementById(
"formTitle"
).textContent =
"Edit Staff";

document.getElementById(
"staffId"
).value =
editData.id;

manNumber.value =
editData.staffNumber ||
editData.manNumber ||
"";

firstName.value =
editData.firstName || "";

lastName.value =
editData.lastName || "";

nrc.value =
editData.nrc || "";

phone.value =
editData.phone || "";

email.value =
editData.email || "";

department.value =
editData.department || "";

role.value =
editData.position ||
editData.role ||
"";

salary.value =
editData.salary || "";

access.value =
editData.access || "";

status.value =
editData.status || "Active";

username.value =
editData.username || "";

password.value =
editData.password || "";

confirmPassword.value =
editData.password || "";

if(editData.photo){

photoPreview.src =
editData.photo;

}

localStorage.removeItem(
"editingStaff"
);

}

/*==================================
SAVE
==================================*/

form.addEventListener(

"submit",

function(e){

e.preventDefault();

let staffList =
getStaff();

const id =
staffId.value;

const staffNumber =
manNumber.value.trim();

/*==================================
DUPLICATE VALIDATION
==================================*/

const usernameValue =

username.value
.trim()
.toLowerCase();


const nrcValue =

nrc.value
.trim()
.toLowerCase();


const phoneValue =

phone.value
.trim();


const emailValue =

email.value
.trim()
.toLowerCase();


const duplicate =

staffList.find(

staff =>

String(staff.id) !==
String(id)

&&

(

/* staff number */

staff.staffNumber ===
staffNumber

||

/* username */

staff.username
?.trim()
.toLowerCase()

===

usernameValue

||

/* NRC */

(

nrcValue &&

staff.nrc
?.trim()
.toLowerCase()

===

nrcValue

)

||

/* email */

(

emailValue &&

staff.email
?.trim()
.toLowerCase()

===

emailValue

)

||

/* phone */

(

phoneValue &&

staff.phone
?.trim()

===

phoneValue

)

)

);


/*==================================
SHOW SPECIFIC ERROR
==================================*/

if(duplicate){

let duplicateField = "";

if(

duplicate.staffNumber ===
staffNumber

){

duplicateField =
"Staff Number";

}

else if(

duplicate.username
?.trim()
.toLowerCase()

===

usernameValue

){

duplicateField =
"Username";

}

else if(

duplicate.nrc
?.trim()
.toLowerCase()

===

nrcValue

){

duplicateField =
"NRC";

}

else if(

duplicate.email
?.trim()
.toLowerCase()

===

emailValue

){

duplicateField =
"Email";

}

else if(

duplicate.phone
?.trim()

===

phoneValue

){

duplicateField =
"Phone Number";

}


showModal(

`Hi ${thisUser.firstName}`,

`${duplicateField} already exists.`,

"info"

);

return;

}

if(thisUser.access!=='Administrator'){
showModal(`Hi ${thisUser.firstName}`, 'Sorry Something Went Wrong','nop');
return;
}


if(

password.value !==
confirmPassword.value

){

alert(
"Passwords do not match."
);

return;

}

const now =
createDateObject();

const existing =
staffList.find(

staff =>

String(staff.id) ===
String(id)

);

const staff={

id:

id ||

Date.now(),

staffNumber,

firstName:

firstName.value.trim(),

lastName:

lastName.value.trim(),

fullName:

`${firstName.value.trim()} ${lastName.value.trim()}`,

nrc:

nrc.value.trim(),

phone:

phone.value.trim(),

email:

email.value.trim(),

department:

department.value,

position:

role.value,

salary:

Number(
salary.value || 0
),

access:

access.value,

status:

status.value,

username:

username.value.trim(),

password:

password.value,

photo:

photoPreview.src,

createdDate:

existing ?

existing.createdDate :

now,

updatedDate:

now,

lastLogin:

existing ?

existing.lastLogin :

null

};

if(existing){

staffList =
staffList.map(

employee =>

String(employee.id) ===
String(id)

?

staff

:

employee

);

}else{

staffList.push(
staff
);

}

saveStaff(
staffList
);

showModal(`Hi ${thisUser.firstName}`, 'New Staff created Successfully','info');
setTimeout(()=>{
window.location =
"staff-list.html";
},2000
)

});

}
function displayStaff(){

let staffList=
JSON.parse(localStorage.getItem("staff")) || [];

container.innerHTML="";

staffList.forEach(staff=>{

container.innerHTML+=`

<div class="staff-card">

<div>
<b>Name</b><br>
${staff.firstName}
${staff.lastName}
</div>

<div>
<b>Department</b><br>
${staff.department}
</div>

<div>
<b>Phone</b><br>
${staff.phone}
</div>

<div>
<b>Salary</b><br>
K ${staff.salary}
</div>

<div>
<b>Position</b><br>
${staff.role}
</div>

<div>
<b>NRC</b><br>
${staff.nrc}
</div>

<div>

<b>Access</b><br>

<span class="badge ${
staff.access==="Yes"
?"green":"red"
}">
${staff.access}
</span>

</div>

<div>

<b>Status</b><br>

<span class="badge ${
staff.blacklisted==="true"
?"red":"green"
}">

${staff.blacklisted==="true"
?"Blacklisted"
:"Active"}

</span>

</div>

</div>

`;

});

}


const search=
document.getElementById("search");

if(search){

search.addEventListener(
"keyup",
function(){

let value=
this.value.toLowerCase();

let cards=
document.querySelectorAll(".staff-card");

cards.forEach(card=>{

let text=
card.innerText.toLowerCase();

card.style.display=
text.includes(value)
?"grid":"none";

});

});

}