/*=========================================
BABBAGE POS
PURCHASE HISTORY ENGINE
=========================================*/


/*=========================================
STATE
=========================================*/

let purchaseCache = [];

let inventoryRoomCache = [];

let productCache = [];

let activePurchaseId = null;


/*=========================================
ELEMENTS
=========================================*/

const tableBody =
document.getElementById(
"purchaseTableBody"
);

const searchInput =
document.getElementById(
"purchaseSearch"
);

const purchaseModal =
document.getElementById(
"purchaseActionModal"
);

const closePurchaseModalBtn =
document.getElementById(
"closePurchaseModal"
);

const purchaseItemsTable =
document.getElementById(
"purchaseItemsTable"
);


/*=========================================
CACHE LOADER
=========================================*/

function refreshPurchaseCache(){

    purchaseCache =
    getPurchases()

    .slice()

    .sort(

        (a,b)=>

        new Date(

            b.timestamp ||

            b.date?.iso ||

            0

        )

        -

        new Date(

            a.timestamp ||

            a.date?.iso ||

            0

        )

    );

    inventoryRoomCache =
    getInventoryRooms();

    productCache =
    getProducts();

}

/*===============================================
                 UTILITIES
 ===============================================*/

 /*=========================================
UTILITIES
=========================================*/

function purchaseTotal(

items=[]

){

    return items.reduce(

        (sum,item)=>{

            return sum +

            (

                Number(item.qty||0)

                *

                Number(item.costPrice||0)

            );

        },

        0

    );

}


function purchaseItemCount(

purchase

){

    return (

        purchase.items ||

        []

    ).length;

}


function purchaseDate(

purchase

){

    if(

        typeof formatPrettyDate===

        "function"

    ){

        return formatPrettyDate(

            purchase

        );

    }

    return

    purchase.date?.display ||

    "";

}


function money(amount){

    const value = Number(amount || 0);

    if(typeof formatCurrency === "function"){

        return formatCurrency(value);

    }

    return `K${value.toFixed(2)}`;

}

/*=========================================
INITIALIZE
=========================================*/

function initializePurchaseHistory(){

    refreshPurchaseCache();

    renderPurchaseTable();

}


/*=========================================
RENDER PURCHASE TABLE
=========================================*/

function renderPurchaseTable(){

    refreshPurchaseCache();

    const keyword =

    (

        searchInput?.value ||

        ""

    )

    .toLowerCase()

    .trim();

    const purchases =

    purchaseCache.filter(

        purchase=>{

            const receipt =

            String(

                purchase.id || ""

            )

            .toLowerCase();

            const supplier =

            String(

                purchase.supplier || ""

            )

            .toLowerCase();

            const date =

            purchaseDate(

                purchase

            )

            .toLowerCase();

            return(

                receipt.includes(keyword)

                ||

                supplier.includes(keyword)

                ||

                date.includes(keyword)

            );

        }

    );

    tableBody.innerHTML="";

    if(

        purchases.length===0

    ){

        tableBody.innerHTML=`

        <tr>

            <td colspan="7"

            class="empty-table">

                No Purchase Records

            </td>

        </tr>

        `;

        return;

    }

    purchases.forEach(

        purchase=>{

            const row=

            document.createElement(

                "tr"

            );

            row.dataset.id=

            purchase.id;

            row.innerHTML=`

            <td>

                ${purchase.id}

            </td>

            <td>

                ${purchase.supplier || "-"}

            </td>

            <td>

                ${purchaseDate(

                    purchase

                )}

            </td>

            <td>

                ${purchaseItemCount(

                    purchase

                )}

            </td>

            <td>

                ${money(

                    purchaseTotal(

                        purchase.items

                    )

                )}

            </td>

            <td>

                <button

                class="action-btn view-btn"

                data-action="view"

                data-id="${purchase.id}">

                    <i class="fas fa-eye"></i>

                </button>

            </td>

            <td>

                <button

                class="action-btn delete-btn"

                data-action="delete"

                data-id="${purchase.id}">

                    <i class="fas fa-trash"></i>

                </button>

            </td>

            `;

            tableBody.appendChild(

                row

            );

        }

    );

}

/*=========================================
TABLE EVENTS
=========================================*/

tableBody.addEventListener(

    "click",

    e=>{

        const button=

        e.target.closest(

            "button"

        );

        if(

            !button

        ) return;

        const id=

        button.dataset.id;

        switch(

            button.dataset.action

        ){

            case "view":

                openPurchase(

                    id

                );

            break;

            case "delete":

                deletePurchase(

                    id

                );

            break;

        }

    }

);

/*=========================================
SEARCH
=========================================*/

searchInput.addEventListener(

    "input",

    renderPurchaseTable

);


/*=========================================
OPEN PURCHASE
=========================================*/

function openPurchase(

purchaseId

){

    refreshPurchaseCache();

    const purchase =

    purchaseCache.find(

        p=>p.id===purchaseId

    );

    if(!purchase){

        return;

    }

    activePurchaseId=

    purchase.id;

    document.getElementById(

        "receiptTitle"

    ).textContent=

    purchase.id;

    document.getElementById(

        "purchaseSupplier"

    ).textContent=

    purchase.supplier ||

    "-";

    document.getElementById(

        "purchaseDate"

    ).textContent=

    purchaseDate(

        purchase

    );

    document.getElementById(

        "purchaseTotal"

    ).textContent=

    money(

        purchaseTotal(

            purchase.items

        )

    );

    renderPurchaseItems(

        purchase

    );

    purchaseModal.classList.add(

        "show"

    );

}


/*=========================================
RENDER PURCHASE ITEMS
=========================================*/

function renderPurchaseItems(

purchase

){

    purchaseItemsTable.innerHTML="";

    purchase.items.forEach(

        (item,index)=>{

            const room=

            inventoryRoomCache.find(

                r=>

                String(r.purchaseId)===

                String(purchase.id)

                &&

                String(r.productId)===

                String(item.id)

            );

            const row=

            document.createElement(

                "tr"

            );

            row.innerHTML=`

            <td>

                ${item.name}

            </td>

            <td>

                ${item.qty}

            </td>

            <td>

                ${money(

                    item.costPrice

                )}

            </td>

            <td>

                ${money(

                    item.sellingPrice ||

                    item.price

                )}

            </td>

            <td>

                ${money(

                    Number(item.qty)*

                    Number(item.costPrice)

                )}

            </td>

            <td>

                ${room?

                    room.roomId

                    :

                    "-"}

            </td>

            <td>

                ${room?

                    room.status

                    :

                    "-"}

            </td>

            <td>

                <button

                class="action-btn"

                data-action="edit-item"

                data-index="${index}">

                <i class="fas fa-pen"></i>

                </button>

            </td>

            <td>

                <button

                class="action-btn delete-btn"

                data-action="delete-item"

                data-index="${index}">

                <i class="fas fa-trash"></i>

                </button>

            </td>

            `;

            purchaseItemsTable.appendChild(

                row

            );

        }

    );

}



/*=========================================
MODAL EVENTS
=========================================*/

purchaseItemsTable.addEventListener(

    "click",

    e=>{

        const button=

        e.target.closest(

            "button"

        );

        if(!button){

            return;

        }

        const index=

        Number(

            button.dataset.index

        );

        switch(

            button.dataset.action

        ){

            case "edit-item":

                editPurchaseItem(

                    index

                );

            break;

            case "delete-item":

                deletePurchaseItem(

                    index

                );

            break;

        }

    }

);

/*=========================================
CLOSE MODAL
=========================================*/

function closePurchaseModal(){

    purchaseModal.classList.remove(

        "show"

    );

    activePurchaseId=null;

}

closePurchaseModalBtn.addEventListener(

    "click",

    closePurchaseModal

);

purchaseModal.addEventListener(

    "click",

    e=>{

        if(

            e.target===purchaseModal

        ){

            closePurchaseModal();

        }

    }

);

/*=========================================
EDIT PURCHASE ITEM
=========================================*/

function editPurchaseItem(

index

){

    const purchase=

    purchaseCache.find(

        p=>p.id===activePurchaseId

    );

    if(!purchase){

        return;

    }

    const item=

    purchase.items[index];

    const row=

    purchaseItemsTable.rows[index];

    row.innerHTML=`

    <td>

        ${item.name}

    </td>

    <td>

        <input

        id="editQty"

        type="number"

        min="1"

        value="${item.qty}">

    </td>

    <td>

        <input

        id="editCost"

        type="number"

        step="0.01"

        value="${item.costPrice}">

    </td>

    <td>

        <input

        id="editSelling"

        type="number"

        step="0.01"

        value="${item.sellingPrice || item.price}">

    </td>

    <td colspan="3">

    </td>

    <td>

        <button

        class="action-btn"

        onclick="savePurchaseItem(${index})">

        <i class="fas fa-save"></i>

        </button>

    </td>

    <td>

        <button

        class="action-btn"

        onclick="openPurchase('${purchase.id}')">

        <i class="fas fa-times"></i>

        </button>

    </td>

    `;

}

/*=========================================
SAVE PURCHASE ITEM
=========================================*/

function savePurchaseItem(

index

){

    const purchases=

    getPurchases();

    const products=

    getProducts();

    const rooms=

    getInventoryRooms();

    const purchase=

    purchases.find(

        p=>p.id===activePurchaseId

    );

    if(!purchase){

        return;

    }

    const item=

    purchase.items[index];

    const qty=

    Number(

        document.getElementById(

            "editQty"

        ).value

    );

    const cost=

    Number(

        document.getElementById(

            "editCost"

        ).value

    );

    const selling=

    Number(

        document.getElementById(

            "editSelling"

        ).value

    );

    item.qty=qty;

    item.costPrice=cost;

    item.sellingPrice=selling;

    item.price=selling;

    purchase.total=

    purchaseTotal(

        purchase.items

    );

    /*------------------------------------
    UPDATE PRODUCT
    ------------------------------------*/

    const product=

    products.find(

        p=>

        String(p.id)===

        String(item.id)

    );

    if(product){

        product.costPrice=cost;

        product.price=selling;

    }

    /*------------------------------------
    UPDATE INVENTORY ROOM
    ------------------------------------*/

    const room=

    rooms.find(

        r=>

        String(r.purchaseId)===

        String(purchase.id)

        &&

        String(r.productId)===

        String(item.id)

    );

    if(room){

        room.costPrice=cost;

        room.sellingPrice=selling;

        room.purchasedQty=qty;

        room.availableQty=Math.min(

            qty,

            room.availableQty

        );

    }

    saveProducts(

        products

    );

    savePurchases(

        purchases

    );

    saveInventoryRooms(

        rooms

    );

    refreshPurchaseCache();

    renderPurchaseTable();

    openPurchase(

        purchase.id

    );

}

initializePurchaseHistory();
