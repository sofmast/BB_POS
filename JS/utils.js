

let currentView = "summary";

// TONUMBER FUNCTION//
function toNumber(value) {

    return Number(value) || 0;

}

function pad(value) {

    return String(value).padStart(2, "0");

}

// GET WEEK FUNCTION
function getWeekNumber(date = new Date()) {

    const utc = new Date(

        Date.UTC(

            date.getFullYear(),

            date.getMonth(),

            date.getDate()

        )

    );

    const day = utc.getUTCDay() || 7;

    utc.setUTCDate(

        utc.getUTCDate() + 4 - day

    );

    const yearStart = new Date(

        Date.UTC(

            utc.getUTCFullYear(),

            0,

            1

        )

    );

    return Math.ceil(

        (

            (

                (utc - yearStart) /

                86400000

            ) + 1

        ) / 7

    );

}

/*=========================================================
CREATE DATE OBJECT
=========================================================*/

function createDateObject() {

    const now = new Date();

    const year = now.getFullYear();

    const month = now.getMonth() + 1;

    const day = now.getDate();

    const hour = now.getHours();

    const minute = now.getMinutes();

    const second = now.getSeconds();

    return {

        /* Calendar */

        day,

        month,

        year,

        weekday: now.getDay(),

        week: getWeekNumber(now),

        quarter: Math.ceil(month / 3),

        /* Time */

        hour,

        minute,

        second,

        /* IDs */

        dateId: Number(

            `${year}${pad(month)}${pad(day)}`

        ),

        monthId: Number(

            `${year}${pad(month)}`

        ),

        yearId: year,

        /* Display */

        displayDate:

            `${pad(day)}/${pad(month)}/${year}`,

        displayTime:

            `${pad(hour)}:${pad(minute)}:${pad(second)}`,

        display:

            `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}`,

        /* Raw */

        timestamp: now.getTime(),

        iso: now.toISOString()

    };

}


/*=========================================================
GET RECORD DATE

Supports BOTH

record.date
record.Date

Supports BOTH

Old ISO String
New Date Object

=========================================================*/

function getRecordDate(record) {

    if (!record) return null;

    const value = record.date || record.Date;

    if (!value) return null;

    /*
        NEW FORMAT
    */

    if (typeof value === "object") {

        return value;

    }

    /*
        OLD FORMAT
    */

    const d = new Date(value);

    return {

        day: d.getDate(),

        month: d.getMonth() + 1,

        year: d.getFullYear(),

        hour: d.getHours(),

        minute: d.getMinutes(),

        second: d.getSeconds(),

        weekday: d.getDay(),

        week: getWeekNumber(d),

        quarter: Math.ceil(

            (d.getMonth() + 1) / 3

        ),

        dateId: Number(

            `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`

        ),

        monthId: Number(

            `${d.getFullYear()}${pad(d.getMonth()+1)}`

        ),

        yearId: d.getFullYear(),

        displayDate:

            `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`,

        displayTime:

            `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,

        display:

            `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`,

        timestamp: d.getTime(),

        iso: d.toISOString()

    };

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(record) {

    const d = getRecordDate(record);

    if (!d) return "";

    return `${d.day}/${d.month}/${d.year}`;

}

// ========================================
// FORMAT DATE TIME
// ========================================

function formatDateTime(record) {

    const d = getRecordDate(record);

    if (!d) return "";

    return `${d.day}/${d.month}/${d.year} ${String(d.hour).padStart(2,"0")}:${String(d.minute).padStart(2,"0")}`;

}

// ========================================
// PRETTY DATE
// ========================================

function formatPrettyDate(record) {

    const d = getRecordDate(record);

    if (!d) return "";

    return new Date(

        d.year,

        d.month - 1,

        d.day

    ).toLocaleDateString(

        "en-GB",

        {

            weekday: "short",

            day: "2-digit",

            month: "short",

            year: "numeric"

        }

    );

}

// ========================================
// CURRENCY
// ========================================

function formatCurrency(amount) {

    return `K${Number(amount || 0).toFixed(2)}`;

}

// PURCHASE DETAILED //

function getPurchaseItems() {

    const purchases = getPurchases();

    let rows = [];

    purchases.forEach(purchase => {

        purchase.items.forEach(item => {

            rows.push({

                purchaseId:
                    purchase.id,

                date:
                    formatDate(purchase),

                supplier:
                    purchase.supplier,

                product:
                    item.name,

                qty:
                    item.qty,

                unitCost:
                    item.costPrice,

                totalCost:
                    item.qty * item.costPrice

            });

        });

    });

    return rows;

}


// ========================================
// RENDER CURRENT VIEW
// ========================================

function renderCurrentView(){

    if(currentView === "summary"){

        // Function from purchase-history page
        renderPurchases();

    }else{

        renderPurchaseItems();

    }

}


//RENDER PURCHASE ITEMS//

function renderPurchaseItems() {

    const rows =
        getPurchaseItems();

    if(rows.length === 0){

        purchaseHistory.innerHTML = `
            <p class="empty">
                No purchases found
            </p>
        `;

        return;
    }

    purchaseHistory.innerHTML = `

    <div class="table-wrapper">

        <table class="purchase-table">

            <thead>

                <tr>

                    <th>#</th>

                    <th>Purchase ID</th>

                    <th>Date</th>

                    <th>Supplier</th>

                    <th>Product</th>

                    <th>Qty</th>

                    <th>Unit Cost</th>

                    <th>Total Cost</th>

                </tr>

            </thead>

            <tbody>

                ${rows.map((row,index)=>`

                <tr>

                    <td>${index+1}</td>

                    <td>${row.purchaseId}</td>

                    <td>${row.date}</td>

                    <td>${row.supplier}</td>

                    <td>${row.product}</td>

                    <td>${row.qty}</td>

                    <td>K${row.unitCost.toFixed(2)}</td>

                    <td>K${row.totalCost.toFixed(2)}</td>

                </tr>

                `).join("")}

            </tbody>

        </table>

    </div>

    `;

}


// PURCHASE EVENT LISTNERS//

const summaryViewBtn =
document.getElementById("summaryViewBtn");

const itemViewBtn =
document.getElementById("itemViewBtn");

if(summaryViewBtn && itemViewBtn){

    summaryViewBtn.addEventListener(
        "click",
        () => {

            currentView = "summary";

            summaryViewBtn.classList.add("active");

            itemViewBtn.classList.remove("active");

            renderCurrentView();

        }
    );

    itemViewBtn.addEventListener(
        "click",
        () => {

            currentView = "items";

            itemViewBtn.classList.add("active");

            summaryViewBtn.classList.remove("active");

            renderCurrentView();

        }
    );

}


/*function showLoading(){

    const loading =
    document.getElementById(
        "loadingOverlay"
    );


    if(loading){

        loading.hidden = false;

    }

   

}

function hideLoading(){

    const loading =
    document.getElementById(
        "loadingOverlay"
    );


    if(loading){

        loading.hidden = true;

    }

}
*/





createDateObject();
formatDate();
formatCurrency();


