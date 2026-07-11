const form=document.getElementById("staffForm");

function getStaff(){

return JSON.parse(
localStorage.getItem("staff")
)||[];

}

function saveStaff(data){

localStorage.setItem(
"staff",
JSON.stringify(data)
);

}


if(form){

const editData=
JSON.parse(
localStorage.getItem("editingStaff")
);

if(editData){

document.getElementById("formTitle")
.innerText="Edit Staff";

document.getElementById("staffId").value=editData.id;

document.getElementById("manNumber").value=editData.manNumber;
document.getElementById("firstName").value=editData.firstName;
document.getElementById("lastName").value=editData.lastName;
document.getElementById("nrc").value=editData.nrc;
document.getElementById("phone").value=editData.phone;
document.getElementById("department").value=editData.department;
document.getElementById("role").value=editData.role;
document.getElementById("salary").value=editData.salary;
document.getElementById("access").value=editData.access;
document.getElementById("blacklisted").value=editData.blacklisted;

localStorage.removeItem(
"editingStaff"
);

}

form.addEventListener(
"submit",
function(e){

e.preventDefault();

let staffList=getStaff();

const id=
document.getElementById(
"staffId"
).value;

const manNumber=
document.getElementById(
"manNumber"
).value;

const duplicate=
staffList.find(
x=>
x.manNumber===manNumber
&& x.id != id
);

if(duplicate){

alert(
"Man Number already exists"
);

return;

}

const staff={

id:id || Date.now(),

manNumber,

firstName:
firstName.value,

lastName:
lastName.value,

nrc:
nrc.value,

phone:
phone.value,

department:
department.value,

role:
role.value,

salary:
salary.value,

access:
access.value,

blacklisted:
blacklisted.value

};

if(id){

staffList=
staffList.map(
x=>
x.id==id
?staff
:x
);

}else{

staffList.push(staff);

}

saveStaff(staffList);

alert(
"Saved Successfully"
);

window.location=
"staff.html";

});

}


const container=
document.getElementById(
"staffContainer"
);

if(container){

renderStaff();

}


function renderStaff(){

let staffList=
getStaff();

container.innerHTML="";

staffList.forEach(
staff=>{

container.innerHTML+=`

<div class="staff-card">

<div>
<b>Man Number</b><br>
${staff.manNumber}
</div>

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
<b>Salary</b><br>
K ${staff.salary}
</div>

<div>
<b>Phone</b><br>
${staff.phone}
</div>

<div>

<b>Status</b><br>

<span class="badge ${
staff.blacklisted==="true"
?"red":"green"
}">
${staff.blacklisted==="true"
?"Blacklisted":"Active"}
</span>

</div>

<div class="actions">

<button
class="edit-btn"
onclick="editStaff(${staff.id})"
>

Edit

</button>

<button
class="delete-btn"
onclick="deleteStaff(${staff.id})"
>

Delete

</button>

</div>

</div>

`;

});

}


function editStaff(id){

const staff=
getStaff().find(
x=>x.id==id
);

localStorage.setItem(
"editingStaff",
JSON.stringify(staff)
);

window.location=
"createStaff.html";

}


function deleteStaff(id){

if(
confirm(
"Delete this staff?"
)
){

let updated=
getStaff().filter(
x=>x.id!=id
);

saveStaff(updated);

renderStaff();

}

}


const search=
document.getElementById(
"search"
);

if(search){

search.addEventListener(
"keyup",
function(){

let value=
this.value.toLowerCase();

document
.querySelectorAll(
".staff-card"
)

.forEach(card=>{

card.style.display=
card.innerText
.toLowerCase()
.includes(value)
?"grid":"none";

});

});

}