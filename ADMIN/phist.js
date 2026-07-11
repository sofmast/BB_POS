/*=========================================
BABBAGE POS
PURCHASE HISTORY ENGINE
Current Architecture
=========================================*/


/*=========================================
STATE
=========================================*/

let activePurchaseId = null;

let purchaseCache = [];


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

const closeModalBtn =
document.getElementById(
"closePurchaseModal"
);


/*=========================================
LOAD
=========================================*/

function loadPurchases(){

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

}


/*=========================================
UTILITIES
=========================================*/

function calculatePurchaseTotal(

items=[]

){

return items.reduce(

(total,item)=>{

return total +

(

Number(item.qty||0)

*

Number(item.costPrice||0)

);

},

0

);

}


function formatPurchaseDate(

purchase

){

if(

typeof formatPrettyDate ===

"function"

){

return formatPrettyDate(

purchase

);

}

if(

purchase.date?.display

){

return purchase.date.display;

}

return "";

}


function formatMoney(

amount

){

if(

typeof formatCurrency===

"function"

){

return formatCurrency(

Number(amount||0)

);

}

return

`K${Number(

amount||0

).toFixed(2)}`;

}


/*=========================================
RENDER PURCHASE TABLE
=========================================*/

function renderPurchases(){

loadPurchases();

const keyword =

(searchInput.value || "")

.toLowerCase()

.trim();

const filtered =

purchaseCache.filter(

purchase=>{

const id =

String(

purchase.id || ""

).toLowerCase();

const supplier =

String(

purchase.supplier || ""

).toLowerCase();

const date =

formatPurchaseDate(

purchase

)

.toLowerCase();

return(

id.includes(keyword)

||

supplier.includes(keyword)

||

date.includes(keyword)

);

}

);

tableBody.innerHTML="";

if(filtered.length===0){

tableBody.innerHTML=`

<tr>

<td colspan="7"

style="padding:35px;text-align:center;">

No Purchases Found

</td>

</tr>

`;

return;

}

filtered.forEach(

purchase=>{

const total =

calculatePurchaseTotal(

purchase.items

);

const row =

document.createElement(

"tr"

);

row.innerHTML=`

<td>

${purchase.id}

</td>

<td>

${purchase.supplier || "-"}

</td>

<td>

${formatPurchaseDate(

purchase

)}

</td>

<td>

${purchase.items?.length || 0}

</td>

<td>

${formatMoney(total)}

</td>

<td>

<button

class="action-btn view-btn"

data-id="${purchase.id}">

<i class="fas fa-eye"></i>

</button>

</td>

<td>

<button

class="action-btn delete-btn"

data-id="${purchase.id}">

<i class="fas fa-trash"></i>

</button>

</td>

`;

tableBody.appendChild(

row

);

});



}

/*=========================================
OPEN PURCHASE
=========================================*/

function openPurchase(

purchaseId

){

const purchase =

purchaseCache.find(

p=>p.id===purchaseId

);

if(!purchase){

return;

}

activePurchaseId=

purchaseId;

document.getElementById(

"receiptTitle"

).textContent=

purchase.id;

document.getElementById(

"purchaseSupplier"

).textContent=

purchase.supplier || "-";

document.getElementById(

"purchaseDate"

).textContent=

formatPurchaseDate(

purchase

);

document.getElementById(

"purchaseTotal"

).textContent=

formatMoney(

calculatePurchaseTotal(

purchase.items

)

);

renderPurchaseItems(

purchase.items || []

);

purchaseModal.classList.add(

"show"

);

}


/*=========================================
MODAL
=========================================*/

function closePurchaseModal(){

purchaseModal.classList.remove(

"show"

);

activePurchaseId=null;

}

closeModalBtn.onclick=

closePurchaseModal;

window.addEventListener(

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
DELETE PURCHASE ITEM
=========================================*/

function deletePurchaseItem(

itemIndex

){

const purchases =

getPurchases();

const purchase =

purchases.find(

p=>p.id===activePurchaseId

);

if(!purchase){

return;

}

if(

!confirm(

"Delete this item from the purchase?"

)

){

return;

}

const item =

purchase.items[itemIndex];

if(!item){

return;

}


/*---------------------------------------
RESTORE PRODUCT STOCK
---------------------------------------*/

const products =

getProducts();

const product =

products.find(

p=>String(p.id)===

String(item.id)

);

if(product){

product.stock =

Math.max(

0,

Number(product.stock)-

Number(item.qty)

);

}

saveProducts(

products

);


/*---------------------------------------
UPDATE INVENTORY ROOM
---------------------------------------*/

const rooms =

getInventoryRooms();

const room =

rooms.find(

r=>

String(r.purchaseId)===

String(purchase.id)

&&

String(r.productId)===

String(item.id)

);

if(room){

room.status="DELETED";

room.availableQty=0;

room.deleted=true;

room.deletedDate=

new Date().toISOString();

}

saveInventoryRooms(

rooms);


/*---------------------------------------
REMOVE ITEM
---------------------------------------*/

purchase.items.splice(

itemIndex,

1

);


/*---------------------------------------
RECALCULATE TOTAL
---------------------------------------*/

purchase.total=

calculatePurchaseTotal(

purchase.items

);


/*---------------------------------------
REMOVE EMPTY PURCHASE
---------------------------------------*/

if(

purchase.items.length===0

){

const index=

purchases.findIndex(

p=>p.id===purchase.id

);

if(index>-1){

purchases.splice(

index,

1

);

closePurchaseModal();

}

}


/*---------------------------------------
SAVE
---------------------------------------*/

savePurchases(

purchases

);

renderPurchases();

if(

activePurchaseId

){

openPurchase(

activePurchaseId

);

}

showToast(

"Purchase Updated"

);

}


/*=========================================
EDIT PURCHASE
=========================================*/

document.getElementById(

"editPurchaseBtn"

).onclick = ()=>{

if(!activePurchaseId){

return;

}

const purchases=

getPurchases();

const purchase=

purchases.find(

p=>p.id===activePurchaseId

);

if(!purchase){

return;

}

const body=

document.getElementById(

"purchaseItemsTable"

);

body.innerHTML="";

purchase.items.forEach(

(item,index)=>{

const row=

document.createElement(

"tr"

);

row.innerHTML=`

<td>

${item.name}

</td>

<td>

<input

class="editQty"

type="number"

min="1"

value="${item.qty}"

data-index="${index}">

</td>

<td>

<input

class="editCost"

type="number"

min="0"

step="0.01"

value="${item.costPrice}"

data-index="${index}">

</td>

<td>

<input

class="editSelling"

type="number"

min="0"

step="0.01"

value="${item.sellingPrice || item.price}"

data-index="${index}">

</td>

<td>

<button

class="action-btn save-edit"

data-index="${index}">

<i class="fas fa-save"></i>

</button>

</td>

`;

body.appendChild(

row

);

}

);

attachPurchaseEditors();

};


/*=========================================
ATTACH EDIT EVENTS
=========================================*/

function attachPurchaseEditors(){

document

.querySelectorAll(

".save-edit"

)

.forEach(

button=>{

button.onclick=()=>{

savePurchaseItem(

Number(

button.dataset.index

)

);

};

}

);

}


/*=========================================
SAVE PURCHASE ITEM
=========================================*/

function savePurchaseItem(

index

){

const purchases=

getPurchases();

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

document.querySelectorAll(

".editQty"

)[index].value

);

const cost=

Number(

document.querySelectorAll(

".editCost"

)[index].value

);

const selling=

Number(

document.querySelectorAll(

".editSelling"

)[index].value

);

item.qty=qty;

item.costPrice=cost;

item.sellingPrice=selling;

item.price=selling;

purchase.total=

calculatePurchaseTotal(

purchase.items

);

/*---------------------------------------
UPDATE PRODUCT
---------------------------------------*/

const products=

getProducts();

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

saveProducts(

products);

/*---------------------------------------
UPDATE INVENTORY ROOM
---------------------------------------*/

const rooms=

getInventoryRooms();

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

room.availableQty=qty;

room.purchasedQty=qty;

}

saveInventoryRooms(

rooms);

savePurchases(

purchases

);

showToast(

"Purchase Updated"

);

openPurchase(

purchase.id

);

renderPurchases();

}

tableBody.addEventListener("click",(e)=>{

    const view=e.target.closest(".view-btn");

    if(view){

        openPurchase(view.dataset.id);

        return;

    }

    const del=e.target.closest(".delete-btn");

    if(del){

        deletePurchase(del.dataset.id);

    }

});


searchInput.addEventListener("input", renderPurchases);

renderPurchases();

