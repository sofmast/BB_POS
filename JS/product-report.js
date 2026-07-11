/*=========================================
BABBAGE POS
PRODUCT REPORT ENGINE
=========================================*/

let reportData = [];

/*=========================================
INITIALIZE
=========================================*/

function initializeProductReport(){

    loadCategories();

    refreshProductReport();

    document
    .getElementById("productSearch")
    .addEventListener(
        "input",
        filterReport
    );

    document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        filterReport
    );

    document
    .getElementById("refreshReport")
    .addEventListener(
        "click",
        refreshProductReport
    );

}

/*=========================================
REFRESH
=========================================*/

function refreshProductReport(){

    reportData = buildProductReport();

    renderSummary(reportData);

    renderTable(reportData);

}

/*=========================================
LOAD CATEGORIES
=========================================*/

function loadCategories(){

    const select =

    document.getElementById(
        "categoryFilter"
    );

    const categories=[

        ...new Set(

            getProducts().map(

                p=>p.category||

                "General"

            )

        )

    ];

    select.innerHTML=

    `<option value="">All Categories</option>`;

    categories.forEach(category=>{

        select.innerHTML+=

        `<option value="${category}">

            ${category}

        </option>`;

    });

}

/*=========================================
BUILD REPORT
=========================================*/

function buildProductReport(){

    const products =
    getProducts();

    const sales =
    getSales();

    return products.map(product=>{

        const rooms =

        InventoryEngine

        .getProductRooms(product.id);

        let stock=0;

        let inventoryValue=0;

        let revenue=0;

        let profit=0;

        let soldQty=0;

        rooms.forEach(room=>{

            stock+=

            Number(

                room.availableQty||0

            );

            inventoryValue+=

            Number(

                room.availableQty||0

            )*

            Number(

                room.costPrice||0

            );

        });

        sales.forEach(sale=>{

            if(!sale.inventory)

            return;

            sale.inventory.forEach(inv=>{

                if(

                    String(inv.productId)!==

                    String(product.id)

                ) return;

                inv.allocations.forEach(room=>{

                    soldQty+=

                    Number(room.qty||0);

                    revenue+=

                    Number(

                        room.totalSelling||0

                    );

                    profit+=

                    Number(

                        room.profit||0

                    );

                });

            });

        });

        return{

            id:product.id,

            name:product.name,

            category:product.category,

            stock,

            cost:Number(

                product.costPrice||0

            ),

            selling:Number(

                product.price||0

            ),

            inventoryValue,

            soldQty,

            revenue,

            profit,

            rooms:rooms.length,

            status:

            stock<=0

            ?

            "Out"

            :

            stock<=10

            ?

            "Low"

            :

            "Healthy"

        };

    });

}

/*=========================================
SUMMARY
=========================================*/

function renderSummary(data){

    document.getElementById(
        "totalProducts"
    ).textContent =
    data.length;

    document.getElementById(
        "totalStock"
    ).textContent =
    data.reduce(
        (sum,p)=>sum+p.stock,
        0
    );

    document.getElementById(
        "inventoryValue"
    ).textContent =
    formatCurrency(
        data.reduce(
            (sum,p)=>sum+p.inventoryValue,
            0
        )
    );

    document.getElementById(
        "totalRevenue"
    ).textContent =
    formatCurrency(
        data.reduce(
            (sum,p)=>sum+p.revenue,
            0
        )
    );

    document.getElementById(
        "totalProfit"
    ).textContent =
    formatCurrency(
        data.reduce(
            (sum,p)=>sum+p.profit,
            0
        )
    );

    document.getElementById(
        "lowStockCount"
    ).textContent =
    data.filter(
        p=>p.stock>0 && p.stock<=10
    ).length;

    document.getElementById(
        "outStockCount"
    ).textContent =
    data.filter(
        p=>p.stock<=0
    ).length;

    const bestSeller =

    [...data]

    .sort(
        (a,b)=>
        b.soldQty-a.soldQty
    )[0];

    document.getElementById(
        "bestSeller"
    ).textContent =

    bestSeller ?

    bestSeller.name

    :

    "--";

}

/*=========================================
FILTER
=========================================*/

function filterReport(){

    const keyword =

    document
    .getElementById(
        "productSearch"
    )
    .value
    .toLowerCase()
    .trim();

    const category =

    document
    .getElementById(
        "categoryFilter"
    )
    .value;

    let filtered =

    [...reportData];

    if(keyword){

        filtered =

        filtered.filter(

            p=>

            p.name

            .toLowerCase()

            .includes(keyword)

        );

    }

    if(category){

        filtered =

        filtered.filter(

            p=>

            p.category===category

        );

    }

    renderSummary(filtered);

    renderTable(filtered);

}

/*=========================================
FORMAT MONEY
=========================================*/

function formatCurrency(value){

    return "K" +

    Number(value||0)

    .toLocaleString(

        undefined,

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    );

}

/*=========================================
RENDER TABLE
=========================================*/

function renderTable(data = reportData){

    const tbody =

    document.getElementById(

        "reportTableBody"

    );

    if(!tbody) return;

    tbody.innerHTML = "";

    if(data.length===0){

        tbody.innerHTML =

        `

        <tr>

            <td colspan="10" class="empty-table">

                No Products Found

            </td>

        </tr>

        `;

        return;

    }

    data.forEach(product=>{

        let badgeClass="good";

        let badgeText="Healthy";

        if(product.stock<=0){

            badgeClass="out";

            badgeText="Out";

        }

        else if(product.stock<=10){

            badgeClass="low";

            badgeText="Low Stock";

        }

        const row=

        document.createElement(

            "tr"

        );

        row.innerHTML=

        `

        <td>

            <strong>

                ${product.name}

            </strong>

        </td>

        <td>

            ${product.category}

        </td>

        <td>

            ${product.stock}

        </td>

        <td>

            ${formatCurrency(product.cost)}

        </td>

        <td>

            ${formatCurrency(product.selling)}

        </td>

        <td>

            ${formatCurrency(product.inventoryValue)}

        </td>

        <td>

            ${formatCurrency(product.revenue)}

        </td>

        <td>

            ${formatCurrency(product.profit)}

        </td>

        <td>

            <span class="status ${badgeClass}">

                ${badgeText}

            </span>

        </td>

        <td>

            <button

                class="action-btn"

                onclick="openProductDetails('${product.id}')">

                <i class="fas fa-eye"></i>

                View

            </button>

        </td>

        `;

        tbody.appendChild(

            row

        );

    });

}



/*=========================================
OPEN PRODUCT DETAILS
=========================================*/

function openProductDetails(productId){

    const product =

    reportData.find(

        p=>

        String(p.id)===

        String(productId)

    );

    if(!product) return;

    const rooms =

    InventoryEngine

    .getProductRooms(productId);

    const sales =

    getSales();

    let roomRows = "";

    if(rooms.length===0){

        roomRows =

        `

        <tr>

            <td colspan="6">

                No Inventory Rooms

            </td>

        </tr>

        `;

    }

    else{

        rooms.forEach(room=>{

            roomRows +=

            `

            <tr>

                <td>${room.purchaseId}</td>

                <td>${room.availableQty}</td>

                <td>${formatCurrency(room.costPrice)}</td>

                <td>${formatCurrency(room.sellingPrice)}</td>

                <td>${room.status}</td>

                <td>

                    <button

                    class="action-btn"

                    onclick="viewRoomHistory('${room.roomId}')">

                    View

                    </button>

                </td>

            </tr>

            `;

        });

    }

    let salesRows="";

    sales.forEach(sale=>{

        if(!sale.inventory) return;

        sale.inventory.forEach(inv=>{

            if(

                String(inv.productId)!==

                String(productId)

            ) return;

            inv.allocations.forEach(allocation=>{

                salesRows +=

                `

                <tr>

                    <td>${sale.id}</td>

                    <td>${formatPrettyDate(sale)}</td>

                    <td>${allocation.qty}</td>

                    <td>${formatCurrency(allocation.sellingPrice)}</td>

                    <td>${formatCurrency(allocation.profit)}</td>

                </tr>

                `;

            });

        });

    });

    if(salesRows===""){

        salesRows=

        `

        <tr>

            <td colspan="5">

                No Sales Yet

            </td>

        </tr>

        `;

    }

    document.getElementById(

        "productDetailsContent"

    ).innerHTML=

    `

    <div class="product-summary">

        <div class="summary-box">

            <h4>Product</h4>

            <p>${product.name}</p>

        </div>

        <div class="summary-box">

            <h4>Category</h4>

            <p>${product.category}</p>

        </div>

        <div class="summary-box">

            <h4>Current Stock</h4>

            <p>${product.stock}</p>

        </div>

        <div class="summary-box">

            <h4>Inventory Value</h4>

            <p>${formatCurrency(product.inventoryValue)}</p>

        </div>

        <div class="summary-box">

            <h4>Revenue</h4>

            <p>${formatCurrency(product.revenue)}</p>

        </div>

        <div class="summary-box">

            <h4>Profit</h4>

            <p>${formatCurrency(product.profit)}</p>

        </div>

    </div>

    <br>

    <h3>Inventory Rooms</h3>

    <div class="table-wrapper">

    <table class="report-table">

        <thead>

            <tr>

                <th>Purchase</th>

                <th>Available</th>

                <th>Cost</th>

                <th>Selling</th>

                <th>Status</th>

                <th></th>

            </tr>

        </thead>

        <tbody>

            ${roomRows}

        </tbody>

    </table>

    </div>

    <br><br>

    <h3>Sales History</h3>

    <div class="table-wrapper">

    <table class="report-table">

        <thead>

            <tr>

                <th>Receipt</th>

                <th>Date</th>

                <th>Qty</th>

                <th>Selling</th>

                <th>Profit</th>

            </tr>

        </thead>

        <tbody>

            ${salesRows}

        </tbody>

    </table>

    </div>

    `;

    document

    .getElementById(

        "productDetailsModal"

    )

    .classList.add(

        "show"

    );

}

/*=========================================
PRODUCT DETAILS MODAL
=========================================*/

const productModal =
document.getElementById(
    "productDetailsModal"
);

const closeProductModal =
document.getElementById(
    "closeProductDetails"
);

closeProductModal.addEventListener(

    "click",

    ()=>{

        productModal.classList.remove(
            "show"
        );

    }

);

productModal.addEventListener(

    "click",

    e=>{

        if(

            e.target===productModal

        ){

            productModal.classList.remove(
                "show"
            );

        }

    }

);


const roomModal =

document.getElementById(
"roomHistoryModal"
);

document

.getElementById(
"closeRoomHistory"
)

.addEventListener(

"click",

()=>{

roomModal.classList.remove(
"show"
);

}

);

roomModal.addEventListener(

"click",

e=>{

if(

e.target===roomModal

){

roomModal.classList.remove(
"show"
);

}

}

);

/*=========================================
VIEW ROOM HISTORY
=========================================*/

function viewRoomHistory(roomId){

    const room =

    getInventoryRooms()

    .find(

        r=>

        String(r.roomId)===

        String(roomId)

    );

    if(!room) return;

    document.getElementById(

        "roomHistoryTitle"

    ).textContent =

    room.productName;

    document.getElementById(

        "roomHistorySubtitle"

    ).textContent =

    room.roomId;

    document.getElementById(

        "roomSummary"

    ).innerHTML =

    `

    <div class="summary-box">

        <h4>Purchase</h4>

        <p>${room.purchaseId}</p>

    </div>

    <div class="summary-box">

        <h4>Supplier</h4>

        <p>${room.supplier}</p>

    </div>

    <div class="summary-box">

        <h4>Purchased</h4>

        <p>${room.purchasedQty}</p>

    </div>

    <div class="summary-box">

        <h4>Available</h4>

        <p>${room.availableQty}</p>

    </div>

    <div class="summary-box">

        <h4>Cost</h4>

        <p>${formatCurrency(room.costPrice)}</p>

    </div>

    <div class="summary-box">

        <h4>Status</h4>

        <p>${room.status}</p>

    </div>

    `;

    const timeline =

    document.getElementById(

        "roomTimeline"

    );

    timeline.innerHTML="";

    room.history.forEach(move=>{

        const card =

        document.createElement(

            "div"

        );

        card.className=

        "timeline-card";

        const icon=

        move.type==="PURCHASE"

        ?

        "fa-circle-plus"

        :

        "fa-cart-shopping";

        const color=

        move.type==="PURCHASE"

        ?

        "purchase"

        :

        "sale";

        card.innerHTML=

        `

        <div class="timeline-dot ${color}">

            <i class="fas ${icon}"></i>

        </div>

        <div class="timeline-content">

            <div class="timeline-header">

                <strong>

                    ${move.type}

                </strong>

                <span>

                    ${formatPrettyDate(move.date)}

                </span>

            </div>

            <div class="timeline-body">

                <p>

                    Quantity

                    <strong>

                        ${move.quantity}

                    </strong>

                </p>

                <p>

                    Balance

                    <strong>

                        ${move.balance}

                    </strong>

                </p>

                <p>

                    Cost

                    <strong>

                        ${formatCurrency(move.costPrice)}

                    </strong>

                </p>

                <p>

                    Selling

                    <strong>

                        ${formatCurrency(move.sellingPrice)}

                    </strong>

                </p>

                <p>

                    Reference

                    <strong>

                        ${move.reference}

                    </strong>

                </p>

            </div>

        </div>

        `;

        timeline.appendChild(

            card

        );

    });

    document

    .getElementById(

        "roomHistoryModal"

    )

    .classList.add(

        "show"

    );

}


document.getElementById('homepos').addEventListener('click',()=>{
    window.location="index.html";
})

initializeProductReport();