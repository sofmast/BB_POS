



// ======================================
// ELEMENTS
// ======================================

const form =
document.getElementById(
    "productForm"
);

const costPriceInput =
document.getElementById(
    "costPrice"
);

const sellingPriceInput =
document.getElementById(
    "sellingPrice"
);

const profitAmount =

document.getElementById(
"profitAmount"
);

const profitMargin =

document.getElementById(
"profitMargin"
);


// ======================================
// STORAGE
// ======================================

function getProducts(){

    const products =
        localStorage.getItem(
            "pos_products"
        );

    return products
        ? JSON.parse(
            products
        )
        : [];

}

function saveProducts(
    products
){

    localStorage.setItem(
        "pos_products",
        JSON.stringify(
            products
        )
    );

}





/*==================================
PROFIT CALCULATOR
==================================*/

function calculateProfit(){

const cost = Number(

costPriceInput.value || 0

);

const selling = Number(

sellingPriceInput.value || 0

);


/*--------------------------
Profit Per Unit
--------------------------*/

const profit =

selling - cost;


/*--------------------------
Margin
--------------------------*/

 if(
        cost > 0
    ){

        margin =
            (
                profit / cost
            ) * 100;

    }

/*--------------------------
Update UI
--------------------------*/

profitAmount.textContent =

`K${profit.toFixed(2)}`;


profitMargin.textContent =

`${margin.toFixed(1)}%`;



/*--------------------------
Optional visual feedback
--------------------------*/

if(profit > 0){

profitAmount.style.color =
"#16a34a";

profitMargin.style.color =
"#16a34a";

}

else if(profit < 0){

profitAmount.style.color =
"#dc2626";

profitMargin.style.color =
"#dc2626";

}

else{

profitAmount.style.color =
"#64748b";

profitMargin.style.color =
"#64748b";

}

}


/*==================================
LIVE UPDATE
==================================*/

costPriceInput.addEventListener(

"input",

calculateProfit

);


sellingPriceInput.addEventListener(

"input",

calculateProfit

);


/*==================================
INITIAL LOAD
==================================*/


/*==================================
RESET PRODUCT FORM
==================================*/

function resetProductForm(){

/* form fields */

document.getElementById(
"productName"
).value="";


document.getElementById(
"productCategory"
).value="";


document.getElementById(
"costPrice"
).value="";


document.getElementById(
"sellingPrice"
).value="";


document.getElementById(
"stockQty"
).value=0;


/* profit display */

document.getElementById(
"profitAmount"
).textContent=

"K0.00";


document.getElementById(
"profitMargin"
).textContent=

"0%";


/* restore colors */

document.getElementById(
"profitAmount"
).style.color="";


document.getElementById(
"profitMargin"
).style.color="";


/* focus first field

document.getElementById(
"productName"
).focus();*/

} 


// ======================================
// SAVE PRODUCT
// ======================================

form.addEventListener(

    "submit",

    function(e){
  
        e.preventDefault();

        const products =
            getProducts();

        //=====================
        // PRODUCT OBJECT
        //=====================

        const productName = document
    .getElementById("productName")
    .value
    .trim();

const product = {
    id: Date.now(),

    name: productName,

    category: document
        .getElementById("productCategory")
        .value
        .trim(),

    costPrice: Number(
        document.getElementById("costPrice").value
    ),

    price: Number(
        document.getElementById("sellingPrice").value
    ),

    stock: Number(
        document.getElementById("stockQty").value
    ),

lookUpName: productName
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
};
// PREVENT DUPLICATE CREATION//

const exists = products.some(
    p => p.lookUpName === product.lookUpName
);

if(thisUser.access!=='Administrator'){
    showModal(`Hi ${thisUser.firstName}`, 'Sorry Something Went Wrong','nop');
        return;
}

if (exists) {
    showModal('Duplicate!','This Item already exists','warning');
    return;
}
if (product.costPrice>= product.price) {
    showModal('Wrong Data','Price must always be above cost','warning');
    return;
}

// ADD PRODUCT TO LS ARRAY//

        products.push(
            product
        );

        saveProducts(
            products
        );
showModal('Success','Product Saved Successfully','success');
          resetProductForm();  
    }

);

// CLEAR FORM BUTTON  EVEN//

document.getElementById(
"clearFormBtn"
)

.addEventListener(

"click",

resetProductForm

);

//home btn//

const homeBttn =document.getElementById(
"homeFormBtn"
);

homeBttn.addEventListener(

"click",()=>{
window.location="index.html";
}

);


calculateProfit();


