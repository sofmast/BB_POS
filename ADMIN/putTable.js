

/*==================================
PURCHASE TABLE RENDER
==================================*/

function getPurchases(){

return JSON.parse(

localStorage.getItem(
"pos_purchases"
)

) || [];

}


const purchaseTableBody =

document.getElementById(
"purchaseTableBody"
);


function renderPurchases(search=""){

const purchases =
getPurchases();

purchaseTableBody.innerHTML="";


/*==============================
FLATTEN PURCHASE ITEMS
==============================*/

const rows = [];

purchases.forEach(

purchase=>{

purchase.items.forEach(

item=>{

rows.push({

purchaseId:
purchase.id,

supplier:
purchase.supplier,

date:
purchase.date.display,

productId:
item.id,

productName:
item.name,

qty:
Number(item.qty),

costPrice:
Number(item.costPrice),

subtotal:

Number(item.qty) *

Number(item.costPrice)

});

}

);

}

);


/*==============================
SEARCH
==============================*/

const filtered = rows.filter(

row=>{

const keyword =

search
.toLowerCase()
.trim();

return(

row.purchaseId
.toLowerCase()
.includes(keyword)

||

row.supplier
.toLowerCase()
.includes(keyword)

||

row.productName
.toLowerCase()
.includes(keyword)

);

}

);


/*==============================
EMPTY STATE
==============================*/

if(filtered.length===0){

purchaseTableBody.innerHTML=`

<tr>

<td
colspan="8"
style="text-align:center;padding:40px;"
>

No purchases found

</td>

</tr>

`;

return;

}


/*==============================
RENDER
==============================*/

filtered.forEach(

row=>{

purchaseTableBody.innerHTML += `

<tr>

<td>

${row.purchaseId}

</td>

<td>

${row.supplier}

</td>

<td>

${row.date}

</td>

<td>

${row.productName}

</td>

<td>

${row.qty}

</td>

<td>

K${row.costPrice.toFixed(2)}

</td>

<td>

K${row.subtotal.toFixed(2)}

</td>

<td>

<button

class="action-btn view-btn"

data-id="${row.purchaseId}"

>

<i class="fas fa-eye"></i>

</button>

</td>

</tr>

`;

}

);


/*==============================
ACTION EVENTS
==============================*/

document

.querySelectorAll(
".view-btn"
)

.forEach(

btn=>{

btn.onclick=()=>{

openPurchase(
btn.dataset.id
);

};

}

);

}



/*==================================
LIVE SEARCH
==================================*/

document

.getElementById(
"purchaseSearch"
)

.addEventListener(

"input",

e=>{

renderPurchases(
e.target.value
);

}

);



/*==================================
INITIAL LOAD
==================================*/

renderPurchases();


