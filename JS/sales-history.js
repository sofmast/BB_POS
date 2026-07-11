function currentSales(){

    return getSales();

}

const salesContainer =
    document.getElementById(
        "salesContainer"
    );

function renderSales(
    data = currentSales()
){

    salesContainer.innerHTML = "";

    let revenue = 0;

    data.forEach(sale=>{

        revenue += Number(

            sale.total || 0

        );

        const items =

        Array.isArray(

            sale.items

        )

        ?

        sale.items

        :

        [];

        let itemsHTML = "";

        items.forEach(item=>{

            const qty =

            Number(

                item.qty || 0

            );

            const price =

            Number(

                item.price || 0

            );

            const total =

            qty *

            price;

            itemsHTML += `

            <div class="sale-item">

                <span>

                    ${item.name}

                    <small>

                        × ${qty}

                    </small>

                </span>

                <span>

                    ${formatCurrency(total)}

                </span>

            </div>

            `;

        });

        const card =

        document.createElement(

            "div"

        );

        card.className =

        "sale-card";

        card.innerHTML = `

            <div class="sale-card-header">

                <h3>

                    ${sale.id}

                </h3>

                <span class="sale-date">

                    ${formatPrettyDate(sale)}

                </span>

            </div>

            <p class="hedaz">

                ${formatDate(sale)}

            </p>

            <hr>

            <p class="hedaz">

                Items

            </p>

            <div class="sale-items">

                ${itemsHTML || "<em>No Items</em>"}

            </div>

            <hr>

            <div class="sale-total">

                <strong>

                    Total

                </strong>

                <strong>

                    ${formatCurrency(

                        sale.total || 0

                    )}

                </strong>

            </div>

            <div id="batscont">

                <button

                    class="delete-sale-btn"

                    onclick="deleteSale('${sale.id}')">

                    <i class="fa-solid fa-trash"></i>

                    Delete Receipt

                </button>

            </div>

        `;

        salesContainer.appendChild(

            card

        );

    });

    document.getElementById(

        "totalTransactions"

    ).textContent = data.length;

    document.getElementById(

        "totalRevenue"

    ).textContent = formatCurrency(

        revenue

    );

}


function renderSalesCards(){

    const container =

    document.getElementById(

        "salesContainer"

    );

    const sales =

    [...getSales()].reverse();

    container.innerHTML = "";

    if(sales.length===0){

        container.innerHTML = `

        <div class="empty-state">

            <i class="fas fa-receipt"></i>

            <h3>No Sales Found</h3>

            <p>No completed sales available.</p>

        </div>

        `;

        return;

    }

    sales.forEach(sale=>{

        const items =

        Array.isArray(

            sale.items

        )

        ?

        sale.items

        :

        [];

        let itemsHTML = "";

        items.forEach(item=>{

            const qty = Number(item.qty||0);

            const price = Number(item.price||0);

            const total = qty*price;

            itemsHTML += `

            <div class="sale-item">

                <span>

                    ${item.name}

                    <small>

                        × ${qty}

                    </small>

                </span>

                <span>

                    ${formatCurrency(total)}

                </span>

            </div>

            `;

        });

        const card =

        document.createElement("div");

        card.className =

        "sale-card";

        card.innerHTML = `

        <div class="sale-header">

            <div>

                <div class="sale-id">

                    ${sale.id}

                </div>

                <div class="sale-date">

                    ${formatPrettyDate(sale)}

                </div>

                <small>

                    ${formatDate(sale)}

                </small>

            </div>

            <strong>

                ${formatCurrency(

                    sale.total||0

                )}

            </strong>

        </div>

        <div class="sale-items">

            ${itemsHTML}

        </div>

        <div class="sale-footer">

            <div class="sale-summary">

                <div>

                    Paid:

                    ${formatCurrency(

                        sale.paid||0

                    )}

                </div>

                <div>

                    Change:

                    ${formatCurrency(

                        sale.change||0

                    )}

                </div>

                <div>

                    Profit:

                    ${formatCurrency(

                        sale.profit||0

                    )}

                </div>

            </div>

            <div class="sale-actions">

                <button

                    class="sale-btn edit-btn"

                    onclick="editSaleItem('${sale.id}',0)">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button

                    class="sale-btn delete-btn"

                    onclick="deleteSale('${sale.id}')">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

                <button

                    class="sale-btn print-btn"

                    onclick="printSale('${sale.id}')">

                    <i class="fa-solid fa-print"></i>

                    Print

                </button>

                <button

                    class="sale-btn pdf-btn"

                    onclick="exportSalePDF('${sale.id}')">

                    <i class="fa-solid fa-file-pdf"></i>

                    PDF

                </button>

                <button

                    class="sale-btn excel-btn"

                    onclick="exportSaleExcel('${sale.id}')">

                    <i class="fa-solid fa-file-excel"></i>

                    Excel

                </button>

            </div>

        </div>

        `;

        container.appendChild(card);

    });

}


//==============================
// RENDER SALES TABLE
//==============================

function renderSalesTable(
    data = currentSales()
){

    if(!eligible){

        return(ineligible);

    }

    salesContainer.innerHTML = "";

    const table =

    document.createElement(

        "table"

    );

    table.className =

    "sales-table";

    let tableHTML = `

    <thead>

        <tr>

            <th>Receipt</th>
            <th>Date</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Selling</th>
            <th>FIFO Cost</th>
            <th>Total</th>
            <th>Profit</th>

        </tr>

    </thead>

    <tbody>

    `;

    data.forEach(

        sale=>{

            const items =

            Array.isArray(

                sale.items

            )

            ?

            sale.items

            :

            [];

            items.forEach(

                item=>{

                    const qty =

                    Number(

                        item.qty||0

                    );

                    const sellingPrice =

                    Number(

                        item.price||0

                    );

                    const totalSelling =

                    qty *

                    sellingPrice;

                    /*===========================
                        FIFO ROOM DATA
                    ===========================*/

                    const inventoryItem =

                    sale.inventory?.find(

                        inv=>

                        String(inv.productId)===

                        String(item.id)

                    );

                    let fifoCost = 0;

                    let totalCost = 0;

                    let profit = 0;

                    if(

                        inventoryItem &&

                        inventoryItem.allocations

                    ){

                        totalCost =

                        inventoryItem.allocations.reduce(

                            (

                                sum,

                                row

                            )=>

                            sum +

                            Number(

                                row.totalCost||0

                            ),

                            0

                        );

                        fifoCost =

                        qty>0

                        ?

                        totalCost/qty

                        :

                        0;

                        profit =

                        totalSelling -

                        totalCost;

                    }

                    tableHTML += `

                    <tr>

                        <td>

                            ${sale.id}

                        </td>

                        <td>

                            ${formatDate(

                                sale

                            )}

                        </td>

                        <td>

                            ${item.name}

                        </td>

                        <td>

                            ${qty}

                        </td>

                        <td>

                            ${formatCurrency(

                                sellingPrice

                            )}

                        </td>

                        <td>

                            ${formatCurrency(

                                fifoCost

                            )}

                        </td>

                        <td>

                            ${formatCurrency(

                                totalSelling

                            )}

                        </td>

                        <td>

                            ${formatCurrency(

                                profit

                            )}

                        </td>

                    </tr>

                    `;

                }

            );

        }

    );

    tableHTML += `

    </tbody>

    `;

    table.innerHTML =

    tableHTML;

    salesContainer.appendChild(

        table

    );

}

//TABLE RENDERING LISTNERS//

document
.getElementById(
    "tableViewLink"
)
.addEventListener(
    "click",
    () => {

        renderSalesAdminTable();

    }
);



// RENDER ADMIN SALES TABLE//

function renderSalesAdminTable(
    data = currentSales()
){

    salesContainer.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "table-wrapper";

    const table = document.createElement("table");

    table.className = "sales-admin-table";

    let html = `

    <thead>

        <tr>

            <th>Receipt</th>
            <th>Date</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Selling</th>
            <th>FIFO Cost</th>
            <th>Total</th>
            <th>Profit</th>
            <th>Item Actions</th>
            <th>Receipt</th>

        </tr>

    </thead>

    <tbody>

    `;

    data.forEach(sale=>{

        const items = Array.isArray(
            sale.items
        ) ? sale.items : [];

        if(items.length===0){

            html += `

            <tr>

                <td>${sale.id}</td>

                <td>${formatDate(sale)}</td>

                <td colspan="8">

                    No Items Found

                </td>

            </tr>

            `;

            return;

        }

        items.forEach((item,index)=>{

            const qty = Number(item.qty||0);

            const sellingPrice = Number(item.price||0);

            const totalSelling = qty * sellingPrice;

            /*====================================
                GET FIFO ALLOCATION
            ====================================*/

            const inventoryItem =

            sale.inventory?.find(

                inv=>

                String(inv.productId)===

                String(item.id)

            );

            let fifoCost = 0;

            let totalCost = 0;

            let profit = 0;

            if(

                inventoryItem &&

                inventoryItem.allocations

            ){

                totalCost =

                inventoryItem.allocations.reduce(

                    (sum,row)=>

                    sum +

                    Number(

                        row.totalCost||0

                    ),

                    0

                );

                fifoCost =

                qty>0 ?

                totalCost/qty

                :

                0;

                profit =

                totalSelling -

                totalCost;

            }

            html += `

            <tr>

                <td>

                    ${sale.id}

                </td>

                <td>

                    ${formatDate(sale)}

                </td>

                <td>

                    ${item.name}

                </td>

                <td>

                    ${qty}

                </td>

                <td>

                    ${formatCurrency(

                        sellingPrice

                    )}

                </td>

                <td>

                    ${formatCurrency(

                        fifoCost

                    )}

                </td>

                <td>

                    ${formatCurrency(

                        totalSelling

                    )}

                </td>

                <td>

                    ${formatCurrency(

                        profit

                    )}

                </td>

                <td>

                    <div class="action-buttons">

                        <button

                        class="edit-btn"

                        onclick="

                        editSaleItem(

                        '${sale.id}',

                        ${index}

                        )">

                        <i class="fa-solid fa-pen"></i>

                        </button>

                        <button

                        class="delete-btn"

                        onclick="

                        deleteSaleItem(

                        '${sale.id}',

                        ${index}

                        )">

                        <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

                <td>

                    <button

                    class="receipt-delete"

                    onclick="

                    deleteSale(

                    '${sale.id}'

                    )">

                        <i class="fa-solid fa-trash"></i>

                        Delete Receipt

                    </button>

                </td>

            </tr>

            `;

        });

    });

    html += `

    </tbody>

    `;

    table.innerHTML = html;

    wrapper.appendChild(table);

    salesContainer.appendChild(wrapper);

}


function calculateTodaySales() {

    const now =
        new Date();

    const todayDay =
        now.getDate();

    const todayMonth =
        now.getMonth() + 1;

    const todayYear =
        now.getFullYear();

    let total = 0;

   currentSales().forEach(sale => {

        const date =
            getRecordDate(sale);

        if (

            date.day ===
            todayDay

            &&

            date.month ===
            todayMonth

            &&

            date.year ===
            todayYear

        ) {

            total +=
                Number(
                    sale.total || 0
                );

        }

    });

    document
    .getElementById(
        "todaySales"
    )
    .textContent =

        formatCurrency(total);

}


//**************************************** */
// MOMTHLY SALES
//*************************************** */
function calculateMonthlySales() {

    const now =
        new Date();

    const currentMonth =
        now.getMonth() + 1;

    const currentYear =
        now.getFullYear();

    let total = 0;

    currentSales().forEach(sale => {

        const date =
            getRecordDate(sale);

        if (

            date.month ===
            currentMonth

            &&

            date.year ===
            currentYear

        ) {

            total +=
                Number(
                    sale.total || 0
                );

        }

    });

    document
        .getElementById(
            "monthlySales"
        )
        .textContent =

        formatCurrency(total);

}

function calculateProfit() {

    let profit = 0;

  currentSales().forEach(sale => {

        sale.items.forEach(item => {

            profit +=

                (
                    item.price -
                    item.costPrice
                ) *

                item.qty;

        });

    });

    document
    .getElementById(
        "totalProfit"
    )
    .textContent =
        `K${profit.toFixed(2)}`;

}


function deleteSale(
    saleId
){

    if(thisUser.access !== "Administrator"){

        showModal(

            `Sorry ${thisUser.firstName}`,

            "Something Went Wrong",

            "nop"

        );

        return;

    }

    showConfirm(

        "Delete Receipt",

        "This will restore stock back into the original FIFO rooms.\n\nContinue?",

        ()=>{

            let sales = getSales();

            const sale = sales.find(

                s =>

                s.id === saleId

            );

            if(!sale){

                showModal(

                    "Error",

                    "Receipt not found.",

                    "info"

                );

                return;

            }

            /*====================================
                RESTORE FIFO ROOMS
            ====================================*/

            InventoryEngine.restoreSale(

                sale

            );

            /*====================================
                REMOVE RECEIPT
            ====================================*/

            sales = sales.filter(

                s =>

                s.id !== saleId

            );

            saveSales(

                sales

            );

            /*====================================
                REFRESH SCREEN
            ====================================*/

            reload();

            showModal(

                "Success",

                "Receipt deleted successfully.",

                "success"

            );

        }

    );

}
//************************************** */
//    DELETECONFIRMATION FUNCTION.
//************************************** */

let confirmCallback = null;

function showConfirm(

    title,

    message,

    callback

) {

    document
        .getElementById(
            "confirmTitle"
        )
        .textContent =
        title;

    document
        .getElementById(
            "confirmMessage"
        )
        .textContent =
        message;

    confirmCallback =
        callback;

    document
        .getElementById(
            "confirmModal"
        )
        .classList.add(
            "show"
        );

}

//************************************** */
//    DELETECONFIRMATION EVENTLISTENER
//************************************** */
document
.getElementById(
    "confirmCancel"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "confirmModal"
        )
        .classList.remove(
            "show"
        );

    }
);

document
.getElementById(
    "confirmOk"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "confirmModal"
        )
        .classList.remove(
            "show"
        );

        if (
            typeof confirmCallback
            === "function"
        ) {

            confirmCallback();

        }
        reload();
    }
);


// EDIT SALE ITEM FUNCTION//
function editSaleItem(
    saleId,
    itemIndex
){

    if(thisUser.access !== "Administrator"){

        showModal(

            `Sorry ${thisUser.firstName}`,

            "Something Went Wrong",

            "nop"

        );

        return;

    }

    const sales = getSales();

    const sale = sales.find(

        s =>

        s.id === saleId

    );

    if(!sale){

        showModal(

            "Error",

            "Receipt not found.",

            "info"

        );

        return;

    }

    const item = sale.items[itemIndex];

    if(!item){

        showModal(

            "Error",

            "Sale item not found.",

            "info"

        );

        return;

    }

    /*====================================
        GET FIFO COST USED
    ====================================*/

    const inventoryItem = sale.inventory?.find(

        inv =>

        String(inv.productId) ===

        String(item.id)

    );

    let fifoCost = Number(item.costPrice || 0);

    if(

        inventoryItem &&

        inventoryItem.allocations

    ){

        const totalCost =

        inventoryItem.allocations.reduce(

            (sum,row)=>

            sum +

            Number(row.totalCost||0),

            0

        );

        fifoCost =

            item.qty > 0

            ?

            totalCost / item.qty

            :

            0;

    }

    document.getElementById(

        "editSaleId"

    ).value = saleId;

    const container =

    document.getElementById(

        "editItemsContainer"

    );

    container.innerHTML = `

        <input
        type="hidden"
        id="editItemIndex"
        value="${itemIndex}">

        <p class="hedas">Name</p>

        <div class="edit-item">

            <input
            value="${item.name}"
            readonly>

            <p class="hedas">Quantity</p>

            <input
            id="editQty"
            type="number"
            min="1"
            value="${item.qty}">

            <p class="hedas">FIFO Cost</p>

            <input
            id="editCost"
            type="number"
            value="${fifoCost.toFixed(2)}"
            readonly>

            <p class="hedas">Selling Price</p>

            <input
            id="editPrice"
            type="number"
            min="0"
            step="0.01"
            value="${item.price}">

        </div>

    `;

    document

    .getElementById(

        "editSaleModal"

    )

    .classList.add(

        "show"

    );

}

/*====================================
    SAVE SALE EDIT
====================================*/

document

.getElementById(

    "saveEdit"

)

.addEventListener(

    "click",

    ()=>{

        if(thisUser.access !== "Administrator"){

            showModal(

                `Sorry ${thisUser.firstName}`,

                "Something Went Wrong",

                "nop"

            );

            return;

        }

        const saleId =

        document

        .getElementById(

            "editSaleId"

        )

        .value;

        const itemIndex =

        Number(

            document

            .getElementById(

                "editItemIndex"

            )

            .value

        );

        let sales = getSales();

        const sale = sales.find(

            s =>

            s.id === saleId

        );

        if(!sale){

            showModal(

                "Error",

                "Sale not found.",

                "info"

            );

            return;

        }

        const item = sale.items[itemIndex];

        if(!item){

            showModal(

                "Error",

                "Sale item not found.",

                "info"

            );

            return;

        }

        /*====================================
            ONLY SELLING PRICE
        ====================================*/

        item.price = Number(

            document

            .getElementById(

                "editPrice"

            )

            .value

        );

        /*====================================
            RECALCULATE TOTAL
        ====================================*/

        sale.total = sale.items.reduce(

            (sum,row)=>{

                return sum +

                (

                    row.qty *

                    row.price

                );

            },

            0

        );

        /*====================================
            RECALCULATE PROFIT
        ====================================*/

        let costTotal = 0;

        let profit = 0;

        if(sale.inventory){

            sale.inventory.forEach(

                inv=>{

                    inv.allocations.forEach(

                        room=>{

                            costTotal +=

                            Number(

                                room.totalCost

                            );

                        }

                    );

                }

            );

        }

        profit =

        sale.total -

        costTotal;

        sale.costTotal =

        costTotal;

        sale.profit =

        profit;

        saveSales(

            sales

        );

        document

        .getElementById(

            "editSaleModal"

        )

        .classList.remove(

            "show"

        );

        reload();

        showModal(

            "Success",

            "Sale updated successfully.",

            "success"

        );

    }

);

// GET SALES FUNCTION//

// DELETE SALE ITMEM FUNCTION

function deleteSaleItem(
    saleId,
    itemIndex
){


    if(thisUser.access !== "Administrator"){

        showModal(

            `Sorry ${thisUser.firstName}`,

            "Something Went Wrong",

            "nop"

        );

        return;

    }

    showConfirm(

        "Delete Item",

        "Remove this item from receipt?",

        ()=>{

            let sales = getSales();

            const sale = sales.find(

                x => x.id === saleId

            );

            if(!sale){

                showModal(

                    "Error",

                    "Sale not found.",

                    "info"

                );

                return;

            }

            const item = sale.items[itemIndex];

            if(!item){

                showModal(

                    "Error",

                    "Item not found.",

                    "info"

                );

                return;

            }

            /*====================================
                RESTORE FIFO STOCK
            ====================================*/

            const inventoryItem = sale.inventory?.find(

                inv =>

                String(inv.productId) ===

                String(item.id)

            );

            if(inventoryItem){

                InventoryEngine.restoreSale({

                    id: sale.id,

                    inventory: [

                        inventoryItem

                    ]

                });

            }

            /*====================================
                REMOVE INVENTORY RECORD
            ====================================*/

            if(sale.inventory){

                sale.inventory = sale.inventory.filter(

                    inv =>

                    String(inv.productId) !==

                    String(item.id)

                );

            }

            /*====================================
                REMOVE ITEM
            ====================================*/

            sale.items.splice(

                itemIndex,

                1

            );

            /*====================================
                DELETE RECEIPT IF EMPTY
            ====================================*/

            if(sale.items.length === 0){

                sales = sales.filter(

                    x =>

                    x.id !== saleId

                );

            }else{

                sale.total = sale.items.reduce(

                    (sum,item)=>

                        sum +

                        (item.qty * item.price),

                    0

                );

                sale.costTotal = sale.inventory.reduce(

                    (sum,inv)=>

                        sum +

                        inv.allocations.reduce(

                            (s,a)=>

                                s + a.totalCost,

                            0

                        ),

                    0

                );

                sale.profit =

                    sale.total -

                    sale.costTotal;

            }

            localStorage.setItem(

                "pos_sales",

                JSON.stringify(sales)

            );

            reload();

            renderSalesAdminTable();

            showModal(

                "Success",

                "Item deleted successfully.",

                "success"

            );

        }

    );

}

//END OF DELETE SINGLE ITEM

// RENDERING PERMISION CHECK//

const currentUser =

JSON.parse(

localStorage.getItem(
"user"
)

);

const canManageSales =thisUser.access==="Administrator";




document
.getElementById(
    "tableViewLink"
)
.addEventListener(
    "click",

() => {

if(

canManageSales

){

renderSalesAdminTable();

}

else{

renderSales();

}

});

//INITIALIZING FUNCTION//

function reload(){
renderSalesAdminTable();
//renderSalesTable();
//renderSales();
calculateTodaySales();
calculateMonthlySales();
}

const searchSale =

document.getElementById(

    "searchSale"

);

if(searchSale){

    searchSale.addEventListener(

        "input",

        e=>{

            const keyword =

            e.target.value

            .toLowerCase();

            const filtered =

            currentSales().filter(

                sale=>{

                    return (

                        sale.id

                        .toLowerCase()

                        .includes(keyword)

                    );

                }

            );

            if(

                canManageSales

            ){

                renderSalesAdminTable(

                    filtered

                );

            }else{

                renderSales(

                    filtered

                );

            }

        }

    );

}


reload();


/*==================================
SIDEBAR
==================================*/

const sidebar=

document.getElementById(
"sidebar"
);

const overlay=

document.getElementById(
"sidebarOverlay"
);

const menuToggle=

document.getElementById(
"menuToggle"
);


menuToggle.onclick=()=>{

sidebar.classList.toggle(
"show"
);

overlay.classList.toggle(
"show"
);

};


overlay.onclick=()=>{

sidebar.classList.remove(
"show"
);

overlay.classList.remove(
"show"
);

};


/*==================================
LINK EVENTS
==================================*/
document
.getElementById(
"salesCardsViewLink"
)

.addEventListener(

"click",

()=>{

renderSalesCards();

//closeSidebar();

}

);


document
.getElementById(
"todayDataLink"
)

.addEventListener(

"click",

()=>{

renderTodaySales();

closeSidebar();

}

);


document
.getElementById(
"thisMonthDataLink"
)

.addEventListener(

"click",

()=>{

renderMonthlySales();

closeSidebar();

}

);


/*==================================
SYNC STATS
==================================*/

function syncSidebarStats(){

document
.getElementById(
"sideTransactions"
)

.textContent=

document
.getElementById(
"totalTransactions"
)

.textContent;


document
.getElementById(
"sideRevenue"
)

.textContent=

document
.getElementById(
"totalRevenue"
)

.textContent;


document
.getElementById(
"sideToday"
)

.textContent=

document
.getElementById(
"todaySales"
)

.textContent;


document
.getElementById(
"sideMonth"
)

.textContent=

document
.getElementById(
"monthlySales"
)

.textContent;

}

const salesBtn =document.getElementById('salesCardsViewLink');
salesBtn.addEventListener('click',renderSalesAdminTable);
setInterval(
syncSidebarStats,
500
);
function testa(){
    return(ineligibleMessage);
}


/*==========================================
    CLOSE EDIT MODAL
==========================================*/

const editSaleModal =

document.getElementById(

    "editSaleModal"

);

const cancelEditBtn =

document.getElementById(

    "cancelEdit"

);

/* Cancel Button */

cancelEditBtn.addEventListener(

    "click",

    closeEditModal

);

/* Click Outside */

editSaleModal.addEventListener(

    "click",

    e=>{

        if(

            e.target===editSaleModal

        ){

            closeEditModal();

        }

    }

);

/* ESC Key */

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.key==="Escape" &&

            editSaleModal.classList.contains("show")

        ){

            closeEditModal();

        }

    }

);

/* Function */

function closeEditModal(){

    editSaleModal.classList.remove(

        "show"

    );

}
