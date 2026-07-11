// ========================================
// ELEMENTS
// ========================================

const purchaseSearch =
document.getElementById(
    "purchaseSearch"
);

const supplierName =
document.getElementById(
    "supplierName"
);

const purchaseProductGrid =
document.getElementById(
    "purchaseProductGrid"
);

const purchaseItems =
document.getElementById(
    "purchaseItems"
);

const purTotal =
document.getElementById(
    "totalDisplay"
);

const productCount =
document.getElementById(
    "productCount"
);

const completePurchaseBtn =
document.getElementById(
    "completePurchaseBtn"
);

// ========================================
// DATA
// ========================================

let purchaseCart = [];

// ========================================
// PRODUCTS
// ========================================


// ========================================
// PURCHASES
// ========================================


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(
    keyword = ""
){

    /*if(thisUser.access !== "Administrator"){

        showModal(

            `Sorry ${thisUser.firstName}`,

            "You have no permissions to perform this task.",

            "nop"

        );

        return;

    }*/

    const products = getProducts();

    const filtered = products.filter(

        product =>

        product.name

        .toLowerCase()

        .includes(

            keyword.toLowerCase()

        )

    );

    productCount.textContent =

        `${filtered.length} Products`;

    purchaseProductGrid.innerHTML = "";

    if(filtered.length===0){

        purchaseProductGrid.innerHTML =

        `<div class="empty-state">

            No products found

        </div>`;

        return;

    }

    filtered.forEach(product=>{

        const card=

        document.createElement(

            "div"

        );

        card.className=

        "purchase-product-card";

        card.innerHTML=`

<div class="product-card-top">

<h3>${product.name}</h3>

<span class="stock-badge">

Stock: ${product.stock}

</span>

</div>

<div class="product-card-bottom">

<div class="cost-price">

K${Number(

product.costPrice||0

).toFixed(2)}

</div>

<button class="add-btn">

<i class="fas fa-plus"></i>

Add

</button>

</div>

`;

        card.addEventListener(

            "click",

            ()=>{

                addToPurchaseCart(

                    product

                );

            }

        );

        purchaseProductGrid.appendChild(

            card

        );

    });

}
// ========================================
// ADD TO CART
// ========================================
function addToPurchaseCart(
    product
){

    if(!thisUser){

        window.location="login.html";

        return;

    }

    if(thisUser.access!=="Administrator"){

        showModal(

            `Hi ${thisUser.firstName}`,

            "Something Went Wrong",

            "nop"

        );

        return;

    }

    const existing=

    purchaseCart.find(

        item=>

        String(item.id)===

        String(product.id)

    );

    if(existing){

        existing.qty++;

    }else{

        purchaseCart.push({

            id:product.id,

            name:product.name,

            qty:1,

            costPrice:Number(

                product.costPrice||0

            ),

            /*=========================
                VERY IMPORTANT
            =========================*/

            price:Number(

                product.price||0

            ),

            category:

                product.category||"",

            lookUpName:

                product.lookUpName||""

        });

    }

    renderPurchaseCart();

}

// ========================================
// RENDER CART
// ========================================

function renderPurchaseCart() {

    if (
        purchaseCart.length === 0
    ) {

        purchaseItems.innerHTML = `

            <div class="empty-state">

                <i class="fas fa-cart-plus"></i>

                <p>
                    No items added
                </p>

            </div>

        `;

        purTotal.textContent =
            "K0.00";

        return;

    }

    purchaseItems.innerHTML =
        "";

    let total = 0;

    purchaseCart.forEach(

        (item,index) => {

            const itemTotal =

                item.qty *
                item.costPrice;

            total += itemTotal;

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "purchase-cart-card";

            div.innerHTML = `

            <div class="item-details">

            <h4>

            ${item.name}

            </h4>

            <span>

            Total

            </span>

            <strong>

            K${itemTotal.toFixed(2)}

            </strong>

            </div>

            <div class="controls">

            <div class="control-group">

            <label>

            Cost

            </label>

            <input
            type="number"
            step="0.01"
            class="cost-input"
            value="${item.costPrice}">

            </div>

            <div class="control-group">

            <label>

            Qty

            </label>

            <input
            type="number"
            min="1"
            class="qty-input"
            value="${item.qty}">

            </div>

            <button
            class="remove-btn">

            <i class="fas fa-trash"></i>

            </button>

            </div>

            `;



        
            // REMOVE

            div.querySelector(
                ".remove-btn"
            )

            .addEventListener(

                "click",

                () => {

                    purchaseCart.splice(
                        index,
                        1
                    );

                    renderPurchaseCart();

                }

            );

            // COST

            div.querySelector(
                ".cost-input"
            )

            .addEventListener(

                "blur",

                e => {

                    const value =
                        Number(
                            e.target.value
                        );

                    if (
                        value > 0
                    ) {

                        item.costPrice =
                            value;

                    }

                    renderPurchaseCart();

                }

            );

            // QTY

            div.querySelector(
                ".qty-input"
            )

            .addEventListener(

                "blur",

                e => {

                    const value =
                        parseInt(
                            e.target.value
                        );

                    if (
                        value > 0
                    ) {

                        item.qty =
                            value;

                    }

                    renderPurchaseCart();

                }

            );

            purchaseItems
                .appendChild(div);

        }

    );

    purTotal.textContent =

        `K${total.toFixed(2)}`;

}

// ========================================
// COMPLETE PURCHASE
// ========================================

completePurchaseBtn
.addEventListener(

    "click",

    () => {

        if (
            purchaseCart.length === 0
        ) {

       showModal(`Hi  ${thisUser.firstName}` , 'You have not added any items ','info');

            return;

        }

        const products =
            getProducts();

        purchaseCart.forEach(
            item => {

                const product =
                    products.find(

                        p =>

                        String(p.id) ===

                        String(item.id)

                    );

                if (
                    product
                ) {

                    product.stock +=
                        item.qty;

                    product.costPrice =
                        item.costPrice;

                }

            }
        );

        saveProducts(
            products
        );

        const purchase = {

            id:
                "PUR-" +
                Date.now(),

            supplier:
                supplierName.value
                ||
                "Walk-in Supplier",

            date:
                createDateObject(),

            items:
                [...purchaseCart],

            total:

                purchaseCart.reduce(

                    (
                        sum,
                        item
                    ) =>

                        sum +

                        (
                            item.qty *
                            item.costPrice
                        ),

                    0

                )

        };

  savePurchase(

    purchase

);

/*=====================================
    CREATE FIFO ROOMS
=====================================*/

InventoryEngine.purchase(

    purchase

);

showModal(

    `Hi ${thisUser.firstName}`,

    `Your Order Was completed successfully`,

    "info"

);

        purchaseCart = [];

        supplierName.value =
            "";

        renderPurchaseCart();

        renderProducts();

    }

);

// ========================================
// SEARCH
// ========================================

purchaseSearch
.addEventListener(

    "input",

    () => {

        renderProducts(
            purchaseSearch.value
        );

    }

);

// ========================================
// INIT
// ========================================

renderProducts();

renderPurchaseCart();