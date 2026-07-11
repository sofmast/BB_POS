// ========================================
// MOBILE MENU
// ========================================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("show");
    });
}
// ========================================
// MESSAGE MODAL
// ========================================

const messageModal =
document.getElementById(
"messageModal"
);

const messageTitle =
document.getElementById(
"messageTitle"
);

const messageText =
document.getElementById(
"messageText"
);

const messageOk =
document.getElementById(
"messageOk"
);

const messageCancel =
document.getElementById(
"messageCancel"
);

//===============================
//  ALERT REPLACEMENT FUNCTION
//===============================
function showMessage(

title,

message

){

messageTitle.textContent =
title;

messageText.textContent =
message;

messageCancel.style.display =
"none";

messageModal.classList.add(
"show"
);

messageOk.onclick = () => {

messageModal.classList.remove(
"show"
);

};

}

//=======================================
// CONFIRM POPUP REPLACEMENT
//=======================================

function showConfirmation(

title,

message,

callback

){

messageTitle.textContent =
title;

messageText.textContent =
message;

messageCancel.style.display =
"inline-block";

messageModal.classList.add(
"show"
);

messageOk.onclick = () => {

messageModal.classList.remove(
"show"
);

callback();

};

messageCancel.onclick = () => {

messageModal.classList.remove(
"show"
);

};

}

// ========================================
// LIVE CLOCK
// ========================================

function updateClock() {
    const clock = document.getElementById("clock");

    if (!clock) return;

    const now = new Date();

    clock.textContent = now.toLocaleString("en-ZM", {
        dateStyle: "medium",
        timeStyle: "medium"
    });
}

updateClock();
setInterval(updateClock, 1000);

// ========================================
// ELEMENTS
// ========================================

const productGrid = document.getElementById("productGrid");
const cartItemsDiv = document.getElementById("cartItems");
const totalSpan = document.getElementById("total");
const searchInput = document.getElementById("search");

// ========================================
// CART
// ========================================
let cart = [];

// ========================================
// STORAGE
// ========================================

function saveCart() {

    try {

        localStorage.setItem(
            "pos_cart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Failed to save cart",
            error
        );

    }

}

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem("pos_cart");

        if (!savedCart) {

            cart = [];
            return;

        }

        cart = JSON.parse(savedCart);

        if (!Array.isArray(cart)) {

            cart = [];

        }

    } catch (error) {

        console.error(
            "Failed to load cart",
            error
        );

        cart = [];

    }

}





// ========================================
// BUSINESS SETTINGS
// ========================================

const defaultSettings = {

    businessName:
        "My Store",

    phone:
        "",

    address:
        "",

    currency:
        "ZMW",

    footer:
        "Thank you for shopping with us."

};

function saveSettings(settings) {

    localStorage.setItem(
        "pos_settings",
        JSON.stringify(settings)
    );

}

//=====================================
// LOAD SETTINGS FUNCTION
//=====================================

function loadSettings() {

    const saved =
        localStorage.getItem(
            "pos_settings"
        );

    if (!saved) {

        return defaultSettings;

    }

    try {

        return {
            ...defaultSettings,
            ...JSON.parse(saved)
        };

    } catch {

        return defaultSettings;

    }

}

// ========================================
// SALES
// ========================================



// CLEAR CART FUNCTION //

function clearCart() {

    cart = [];

    saveCart();

    renderCart();

}
// ========================================
// RENDER PRODUCTS
// ========================================



// ========================================
// ADD TO CART
// ========================================

function addToCart(product) {
    

    // Refresh products from storage
    const products = getProducts();

    // Find latest product data
    const currentProduct = products.find(
        p => String(p.id) === String(product.id)
    );

    // Product no longer exists
    if (!currentProduct) {

showModal('Attention','Product Not found.','nop');

        return;
    }

    // Out of stock
    if (currentProduct.stock <= 0) {

    showModal('Attention','This Item is out of Stock','nop');
          

        return;
    }

    // Check if already in cart
    const existingItem = cart.find(
        item =>
            String(item.id) ===
            String(currentProduct.id)
    );

    if (existingItem) {

        // Prevent adding more than available stock
        if (
            existingItem.qty >=
            currentProduct.stock
        ) {

  showModal('Attention!',`Only ${product.stock} items In Stock`,'nop');

            return;
        }

        existingItem.qty++;

    } else {

        // Add new item to cart
       cart.push({

    id: currentProduct.id,

    name: currentProduct.name,

    category: currentProduct.category,

    price: Number(
        currentProduct.price
    ),

    costPrice: Number(
        currentProduct.costPrice || 0
    ),

    qty: 1

});

    }

    saveCart();

    renderCart();
}

// ========================================
// RENDER CART
// ========================================

function renderCart() {

    if (cart.length === 0) {

        cartItemsDiv.innerHTML = `
            <p class="empty">
                No products selected
            </p>
        `;

        totalSpan.textContent = "K0.00";

        return;
    }

    cartItemsDiv.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        const subtotal = item.price * item.qty;

        total += subtotal;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-left">

                <h4>${item.name}</h4>

                <p>
                    K${item.price.toFixed(2)} each
                </p>

            </div>

            <div class="qty-controls">

                <button class="qty-btn minus">
                    -
                </button>

                <input
                    type="number"
                    class="qty-input"
                    min="1"
                    value="${item.qty}"
                >

                <button class="qty-btn plus">
                    +
                </button>

                <button class="remove-btn">
                    ×
                </button>

            </div>

            <div class="cart-subtotal">
                K${subtotal.toFixed(2)}
            </div>
        `;

        // PLUS BUTTON

       div.querySelector(".plus")
.addEventListener("click", () => {

    const products =
        getProducts();

    const product =
        products.find(

            p =>

            String(p.id) ===
            String(item.id)

        );

    if (!product) return;

    if (
        item.qty >=
        product.stock
    ) {

   showModal('Attention!',`Only ${product.stock} items In Stock`,'nop');
            return;

    }

    item.qty++;

    saveCart();

    renderCart();

});

        // MINUS BUTTON

        div.querySelector(".minus")
            .addEventListener("click", () => {

                if (item.qty > 1) {

                    item.qty--;

                } else {

                    cart = cart.filter(
                        p => p.id !== item.id
                    );

                }

                    saveCart();
                    renderCart();

            });

        // QUANTITY INPUT

        const qtyInput =
            div.querySelector(".qty-input");

       qtyInput.addEventListener(

    "blur",

    () => {

        const products =
            getProducts();

        const product =
            products.find(

                p =>

                String(p.id) ===
                String(item.id)

            );

        if (!product) return;

        let value =
            parseInt(
                qtyInput.value
            );

        if (
            isNaN(value) ||
            value < 1
        ) {

            value = 1;

        }

        if (
            value >
            product.stock
        ) {

            value =
                product.stock;

            showModal('Attention!',`Only ${product.stock} items In Stock`,'nop');
        }

        item.qty = value;

        saveCart();

        renderCart();

    }

);

        // ENTER KEY SUPPORT

        qtyInput.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {

                qtyInput.blur();

            }

        });

        // REMOVE BUTTON

div.querySelector(".remove-btn")
    .addEventListener("click", () => {

        cart = cart.filter(
            p => p.id !== item.id
        );

        saveCart();

        renderCart();

    });

        cartItemsDiv.appendChild(div);
    });

totalSpan.textContent =
    `K${total.toFixed(2)}`;

saveCart();
}

// ========================================
// SEARCH PRODUCTS
// ========================================



//========================================
// CLEAR CARTBUTTON
//========================================
const clearCartBtn =
    document.getElementById(
        "clearCartBtn"
    );

clearCartBtn.addEventListener(
    "click",
    () => {

        showConfirmation(
            "Clear Cart",
            "Remove all items from the cart?",
            () => {

                clearCart();

            }
        );

    }
);


// ========================================
// INITIAL LOAD
// ========================================



loadCart();
renderCart();


// settings code
//=======================================
//SETTINGS LINK VARIABLES 
//=======================================

            const settingsLink =
document.getElementById(
    "settingsLink"
);

const settingsModal =
document.getElementById(
    "settingsModal"
);

const closeSettingsBtn =
document.getElementById(
    "closeSettingsBtn"
);

const saveSettingsBtn =
document.getElementById(
    "saveSettingsBtn"
);

const businessNameInput =
document.getElementById(
    "businessName"
);

const businessPhoneInput =
document.getElementById(
    "businessPhone"
);

const businessAddressInput =
document.getElementById(
    "businessAddress"
);

const businessCurrencyInput =
document.getElementById(
    "businessCurrency"
);

const receiptFooterInput =
document.getElementById(
    "receiptFooter"
);

        const settings =
        loadSettings();


//CLOSE SETTINGS//

if (settingsLink) {

    settingsLink.addEventListener(
        "click",
        e => {

            e.preventDefault();
            businessNameInput.value =
                settings.businessName;

            businessPhoneInput.value =
                settings.phone;

            businessAddressInput.value =
                settings.address;

            businessCurrencyInput.value =
                settings.currency;

            receiptFooterInput.value =
                settings.footer;

            settingsModal.classList.add(
                "show"
            );

        }
    );

}

// SAVE SETTINGS //

if (saveSettingsBtn) {

    saveSettingsBtn.addEventListener(
        "click",
        () => {

            const settings = {

                businessName:
                    businessNameInput.value.trim(),

                phone:
                    businessPhoneInput.value.trim(),

                address:
                    businessAddressInput.value.trim(),

                currency:
                    businessCurrencyInput.value.trim(),

                footer:
                    receiptFooterInput.value.trim()

            };

            saveSettings(settings);

         showModal(`Success`,'Details Successfully saved','success');

            settingsModal.classList.remove(
                "show"
            );

        }
    );

}
//closemodal
if (closeSettingsBtn) {

    closeSettingsBtn.addEventListener(
        "click",
        () => {

            settingsModal.classList.remove(
                "show"
            );

        }
    );

}
//end of

// SHOWRECEIPT FUNCTION


/*=========================================
SHOW RECEIPT
=========================================*/

function showReceipt(sale){

    if(!sale) return;

    const settings =

    loadSettings();

    document.getElementById(
        "receiptBusinessName"
    ).textContent =
    settings.businessName || "";

    document.getElementById(
        "receiptAddress"
    ).textContent =
    settings.address || "";

    document.getElementById(
        "receiptPhone"
    ).textContent =
    settings.phone || "";

    receiptNo.textContent =
    sale.id || "";

    receiptDate.textContent =
    formatPrettyDate(sale);

    receiptItems.innerHTML = "";

    let total = 0;

    sale.items.forEach(item=>{

        const qty =

        Number(item.qty||0);

        const price =

        Number(item.price||0);

        const lineTotal =

        qty*price;

        total += lineTotal;

        const row =

        document.createElement(
            "div"
        );

        row.className =
        "receipt-item";

        row.innerHTML =

        `
        <div class="receipt-item-left">

            <strong>

                ${item.name}

            </strong>

            <small>

                ${qty} × ${formatCurrency(price)}

            </small>

        </div>

        <div class="receipt-item-right">

            ${formatCurrency(lineTotal)}

        </div>
        `;

        receiptItems.appendChild(row);

    });

    receiptTotal.textContent =

    formatCurrency(total);

    receiptPaid.textContent =

    formatCurrency(

        Number(sale.paid||0)

    );

    receiptChange.textContent =

    formatCurrency(

        Number(sale.change||0)

    );

    receiptModal.classList.add(
        "show"
    );

}


//===========================
//  CHECKOUT FUNCTION
//===========================

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );

const checkoutModal =
    document.getElementById(
        "checkoutModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const checkoutTotal =
    document.getElementById(
        "checkoutTotal"
    );

const cashReceived =
    document.getElementById(
        "cashReceived"
    );

const changeAmount =
    document.getElementById(
        "changeAmount"
    );

const completeSaleBtn =
    document.getElementById(
        "completeSaleBtn"
    );


    
    // OPEN MODALCODE//
if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

showModal('Attention','Cart is Empty','info');
                return;

            }

            let total = 0;

            cart.forEach(item => {

                total +=
                    item.price *
                    item.qty;

            });

            checkoutTotal.value =
                total.toFixed(2);

            cashReceived.value = "";

            changeAmount.value = "";

            checkoutModal.classList.add(
                "show"
            );

        }
    );

}

//RECEIPT MODAL//

const receiptModal =
document.getElementById(
    "receiptModal"
);

const receiptNo =
document.getElementById(
    "receiptNo"
);

const receiptDate =
document.getElementById(
    "receiptDate"
);

const receiptItems =
document.getElementById(
    "receiptItems"
);

const receiptTotal =
document.getElementById(
    "receiptTotal"
);

const receiptPaid =
document.getElementById(
    "receiptPaid"
);

const receiptChange =
document.getElementById(
    "receiptChange"
);

const printReceiptBtn =
document.getElementById(
    "printReceiptBtn"
);

const closeReceiptBtn =
document.getElementById(
    "closeReceiptBtn"
);

// CLOSE MODAL CODE

if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            checkoutModal.classList.remove(
                "show"
            );

        }
    );

}

// CHANGE CALCULATE

if (cashReceived) {

    cashReceived.addEventListener(
        "input",
        () => {

            const total =
                Number(
                    checkoutTotal.value
                );

            const paid =
                Number(
                    cashReceived.value
                );

            const change =
                paid - total;

            changeAmount.value =
                change >= 0
                ? change.toFixed(2)
                : "0.00";

        }
    );

}



// ========================================
// CLOSE RECEIPT MODAL
// ========================================


if (
    closeReceiptBtn &&
    receiptModal
) {

    closeReceiptBtn.addEventListener(
        "click",
        () => {

            receiptModal.style.display =
                "none";

            // OR

            receiptModal.classList.remove(
                "show"
            );

        }
    );

}

// ========================================
// COMPLETE SALE
// ========================================

if (completeSaleBtn) {

    completeSaleBtn.addEventListener(

        "click",

        () => {

            const total =
                Number(
                    checkoutTotal.value
                );

            const paid =
                Number(
                    cashReceived.value
                );

            if (paid < total) {

   showModal("Attention!.","Amount is less than total","info");

                return;

            }

         /*=========================================
    FIFO SALE
=========================================*/

let costTotal = 0;

let profit = 0;

let roomAllocations = [];

const saleId =

"SALE-" +

Date.now();

for(const item of cart){

    const result =

    InventoryEngine.sell(

        item.id,

        item.qty,

        saleId

    );

    if(!result.success){

        showModal(

            "Stock Error",

            result.message,

            "info"

        );

        return;

    }

    costTotal +=

        result.totalCost;

    profit +=

        result.totalProfit;

    roomAllocations.push({

        productId:item.id,

        productName:item.name,

        allocations:

            result.allocations

    });

}
           const sale = {

    id: saleId,

    date: createDateObject(),

    items: [...cart],

    /*====================================
        FIFO ROOM ALLOCATIONS
    ====================================*/

    inventory:

        roomAllocations,

    total,

    costTotal,

    profit,

    paid,

    change:

        paid - total

};

            saveSale(
                sale
            );

            showReceipt(
                sale
            );

            cart = [];

            saveCart();

            renderCart();

            renderProducts();
 showModal(`${settings.businessName}`,"Transaction Complete","success");
            checkoutModal.classList.remove(
                "show"
            );

        }

    );

}

function shopName(){
    
}



