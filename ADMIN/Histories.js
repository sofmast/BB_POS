/*====================================================
    BABBAGE POS
    PURCHASE HISTORY
====================================================*/

"use strict";

/*====================================================
    ELEMENTS
====================================================*/

const purchaseTableBody =
document.getElementById("purchaseTableBody");

const purchaseSearch =
document.getElementById("purchaseSearch");

const dateFilter =
document.getElementById("dateFilter");

const statPurchases =
document.getElementById("statPurchases");

const statProducts =
document.getElementById("statProducts");

const statCost =
document.getElementById("statCost");

const statAverage =
document.getElementById("statAverage");

const purchaseModal =
document.getElementById("purchaseModal");

const receiptNumber =
document.getElementById("receiptNumber");

const receiptSupplier =
document.getElementById("receiptSupplier");

const receiptDate =
document.getElementById("receiptDate");

const receiptTotal =
document.getElementById("receiptTotal");

const receiptItems =
document.getElementById("receiptItems");


/*====================================================
    STATE
====================================================*/

let purchases = [];

let filteredPurchases = [];

let selectedPurchase = null;


/*====================================================
    INIT
====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadPurchases();

        bindEvents();

    }

);


/*====================================================
    LOAD PURCHASES
====================================================*/

function loadPurchases(){

    purchases = getPurchases() || [];

    purchases.sort(

        (a,b)=>{

            return Number(

                b.id.replace("PUR-","")

            ) -

            Number(

                a.id.replace("PUR-","")

            );

        }

    );

    filteredPurchases = [...purchases];

    renderPurchaseHistory();

}


/*====================================================
    RENDER PURCHASE TABLE
====================================================*/

function renderPurchaseHistory(){

    purchaseTableBody.innerHTML = "";

    if(filteredPurchases.length===0){

        purchaseTableBody.innerHTML =

        `
        <tr>

            <td
            colspan="6"
            class="empty">

                No purchase records found.

            </td>

        </tr>
        `;

        updateStatistics();

        return;

    }

    filteredPurchases.forEach(

        purchase=>{

            purchaseTableBody.innerHTML +=

            `
            <tr>

                <td>

                    <strong>

                        ${purchase.id}

                    </strong>

                </td>

                <td>

                    ${formatDate(purchase.date)}

                </td>

                <td>

                    ${purchase.supplier}

                </td>

                <td>

                    ${purchase.items.length}

                </td>

                <td>

                    K${purchase.total.toFixed(2)}

                </td>

                <td>

                    <div class="action-buttons">

                        <button

                            class="icon-btn view"

                            onclick="viewPurchase('${purchase.id}')">

                            <i class="fas fa-eye"></i>

                        </button>

                        ${renderPermissionButtons(purchase)}

                    </div>

                </td>

            </tr>

            `;

        }

    );

    updateStatistics();

}


/*====================================================
    PERMISSIONS
====================================================*/

function renderPermissionButtons(purchase){

    let html = "";

    if(

        hasPermission("editPurchase")

    ){

        html +=

        `

        <button

        class="icon-btn edit"

        onclick="editPurchase('${purchase.id}')">

        <i class="fas fa-pen"></i>

        </button>

        `;

    }

    if(

        hasPermission("deletePurchase")

    ){

        html +=

        `

        <button

        class="icon-btn delete"

        onclick="confirmDeleteReceipt('${purchase.id}')">

        <i class="fas fa-trash"></i>

        </button>

        `;

    }

    return html;

}


/*====================================================
    UPDATE STATISTICS
====================================================*/

function updateStatistics(){

    statPurchases.textContent =

    filteredPurchases.length;

    let totalProducts = 0;

    let totalCost = 0;

    filteredPurchases.forEach(

        purchase=>{

            totalCost += purchase.total;

            purchase.items.forEach(

                item=>{

                    totalProducts += item.qty;

                }

            );

        }

    );

    statProducts.textContent =

    totalProducts;

    statCost.textContent =

    "K"+totalCost.toLocaleString(

        undefined,

        {

            minimumFractionDigits:2

        }

    );

    statAverage.textContent =

    "K"+

    (

        filteredPurchases.length

        ?

        totalCost/

        filteredPurchases.length

        :

        0

    ).toLocaleString(

        undefined,

        {

            minimumFractionDigits:2

        }

    );

}


/*====================================================
    FORMAT DATE
====================================================*/

function formatDate(date){

    if(!date) return "";

    return

    `${date.day}/${date.month}/${date.year}

    ${date.hours}:${date.minutes}`;

}


/*====================================================
    EVENTS
====================================================*/

function bindEvents(){

    purchaseSearch.addEventListener(

        "input",

        filterPurchases

    );

    dateFilter.addEventListener(

        "change",

        filterPurchases

    );

}