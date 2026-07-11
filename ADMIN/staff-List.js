
/*==================================================
STAFF MANAGEMENT
Professional Version
==================================================*/

const staffTableBody =
document.getElementById(
    "staffTableBody"
);

const searchInput =
document.getElementById(
    "searchStaff"
);

const departmentFilter =
document.getElementById(
    "departmentFilter"
);

const accessFilter =
document.getElementById(
    "accessFilter"
);

const statusFilter =
document.getElementById(
    "statusFilter"
);

/*==================================================
STORAGE
==================================================*/

function getStaff(){

    return JSON.parse(

        localStorage.getItem("staff")

    ) || [];

}

/*==================================================
LOAD DEPARTMENTS
==================================================*/

function loadDepartments(){

    const staff = getStaff();

    const departments = [

        ...new Set(

            staff.map(

                employee =>

                employee.department

            )

        )

    ];

    departmentFilter.innerHTML =

    `<option value="">
        All Departments
    </option>`;

    departments.forEach(dep=>{

        departmentFilter.innerHTML += `

        <option>

            ${dep}

        </option>

        `;

    });

}

/*==================================================
STATUS BADGE
==================================================*/
function statusBadge(status, blacklisted = false){

    // Support old records
    if(!status){

        status = blacklisted ? "Suspended" : "Active";

    }

    switch(status){

        case "Active":

            return `
            <span class="badge active">
                🟢 Active
            </span>
            `;

        case "On Leave":

            return `
            <span class="badge leave">
                🟡 On Leave
            </span>
            `;

        case "Suspended":

            return `
            <span class="badge suspended">
                🔴 Suspended
            </span>
            `;

        case "Resigned":

            return `
            <span class="badge terminated">
                ⚫ Resigned
            </span>
            `;

        case "Terminated":

            return `
            <span class="badge terminated">
                ⚫ Terminated
            </span>
            `;

        default:

            return `
            <span class="badge active">
                🟢 ${status}
            </span>
            `;

    }

}
/*==================================================
ACCESS BADGE
==================================================*/

function accessBadge(access){

const css =

access
.toLowerCase()
.replace(/\s/g,"");

return `

<span class="badge ${css}">

${access}

</span>

`;

}

/*==================================================
SUMMARY
==================================================*/

function updateSummary(data){

const active = data.filter(employee => {

    const status =

        employee.status ||

        (
            employee.blacklisted == true ||
            employee.blacklisted == "true"

                ? "Suspended"

                : "Active"
        );

    return status === "Active";

}).length;

document.getElementById(
    "activeStaff"
).textContent = active;



document.getElementById(

"suspendedStaff"

).textContent =

data.filter(

x=>x.status==="Suspended"

).length;

const payroll =

data.reduce(

(sum,x)=>

sum+

Number(

x.salary||0

),

0

);

document.getElementById(

"monthlyPayroll"

).textContent=

formatCurrency(

payroll

);

}

//=================================================
// getEmp Status
//=================================================

function getEmployeeStatus(employee){

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

/*==================================================
RENDER
==================================================*/

function renderStaff(){

let staff = getStaff();

const keyword =

searchInput.value
.toLowerCase();

const department =

departmentFilter.value;

const access =

accessFilter.value;

const status =

statusFilter.value;

/*========================
SEARCH
========================*/

if(keyword){

staff = staff.filter(employee=>{

return (

employee.staffNumber
?.toLowerCase()
.includes(keyword)

||

employee.firstName
?.toLowerCase()
.includes(keyword)

||

employee.lastName
?.toLowerCase()
.includes(keyword)

||

employee.fullName
?.toLowerCase()
.includes(keyword)

||

employee.phone
?.toLowerCase()
.includes(keyword)

||

employee.username
?.toLowerCase()
.includes(keyword)

);

});

}

/*========================
FILTERS
========================*/

if(department){

staff = staff.filter(

x=>

x.department===department

);

}

if(access){

staff = staff.filter(

x=>

x.access===access

);

}

if(status){

staff = staff.filter(

x=>

x.status===status

);

}

/*========================
SUMMARY
========================*/

updateSummary(staff);

document.getElementById(

"totalStaff"

).textContent =

`${staff.length} Records`;

staffTableBody.innerHTML="";

/*========================
TABLE
========================*/

staff.forEach(employee=>{

staffTableBody.innerHTML += `

<tr>

<td>

<img

class="staff-photo"

src="${
employee.photo ||
'https://via.placeholder.com/60'
}">

</td>

<td>

${employee.staffNumber}

</td>

<td>

<strong>

${employee.fullName}

</strong>

</td>

<td>

${employee.department}

</td>

<td>

${employee.position}

</td>

<td>

${employee.phone}

</td>

<td>

${formatCurrency(

employee.salary

)}

</td>

<td>

${statusBadge(

employee.status

)}

</td>

<td>

${accessBadge(

employee.access

)}

</td>

<td>

<div class="action-buttons">

<button

onclick="viewStaff('${employee.id}')"

title="View">

<i class="fa fa-eye"></i>

</button>

<button

onclick="editStaff('${employee.id}')"

title="Edit">

<i class="fa fa-pen"></i>

</button>

<button

onclick="deleteStaff('${employee.id}')"

title="Delete">

<i class="fa fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

}

/*==================================================
VIEW
==================================================*/

function viewStaff(id){

localStorage.setItem(

"selectedStaff",

id

);

window.location=

"staffDetails.html";

}

/*==================================================
EDIT
==================================================*/

function editStaff(id){

const employee =

getStaff().find(

x=>String(x.id)===String(id)

);

localStorage.setItem(

"editingStaff",

JSON.stringify(employee)

);

window.location=

"createStaff.html";

}

/*==================================================
DELETE
==================================================*/

function deleteStaff(id){


if(

!confirm(

"Delete this staff member?"

)

)return;

let staff =

getStaff();
    if(!staff || staff.length<=1){
        return(showModal(`Sorry ${thisUser.firstName}`,'Task Not Completed','nop'));
    }
staff =

staff.filter(

x=>String(x.id)!==String(id)

);

localStorage.setItem(

"staff",

JSON.stringify(staff)

);

renderStaff();

loadDepartments();

}

/*==================================================
EXPORT
==================================================*/

document
.getElementById("exportExcel")
.addEventListener("click",()=>{

if(typeof XLSX==="undefined"){

alert("Excel library missing.");

return;

}

const rows =

getStaff().map(employee=>({

"Staff Number":
employee.staffNumber,

"Full Name":
employee.fullName,

Department:
employee.department,

Position:
employee.position,

Phone:
employee.phone,

Email:
employee.email,

Salary:
employee.salary,

Access:
employee.access,

Status:
employee.status,

Created:
employee.createdDate?.displayDate

}));

const ws =

XLSX.utils.json_to_sheet(rows);

const wb =

XLSX.utils.book_new();

XLSX.utils.book_append_sheet(

wb,

ws,

"Staff"

);

XLSX.writeFile(

wb,

"Staff_Report.xlsx"

);

});

/*==================================================
EVENTS
==================================================*/

searchInput.addEventListener(

"input",

renderStaff

);

departmentFilter.addEventListener(

"change",

renderStaff

);

accessFilter.addEventListener(

"change",

renderStaff

);

statusFilter.addEventListener(

"change",

renderStaff

);

/*==================================================
INIT
==================================================*/

loadDepartments();

renderStaff();