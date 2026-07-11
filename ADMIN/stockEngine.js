
/* ======================================
BABBAGE POS - STOCK ENGINE (FIXED)
====================================== */

function getProducts(){
return JSON.parse(localStorage.getItem("pos_products")) || [];
}

function saveProducts(products){
localStorage.setItem("pos_products", JSON.stringify(products));
}

/* ======================================
INCREASE STOCK (PURCHASE / SALE DELETE)
====================================== */

function increaseStock(items){

const products = getProducts();

items.forEach(item => {

const product = products.find(p =>
String(p.id) === String(item.id)
);

if(product){
product.stock = Number(product.stock || 0) + Number(item.qty || 0);
}

});

saveProducts(products);
}

/* ======================================
DECREASE STOCK (SALE / PURCHASE DELETE)
====================================== */

function decreaseStock(items){

const products = getProducts();

items.forEach(item => {

const product = products.find(p =>
String(p.id) === String(item.id)
);

if(product){

product.stock = Math.max(
0,
Number(product.stock || 0) - Number(item.qty || 0)
);

}

});

saveProducts(products);
}

/* ======================================
WRAPPERS
====================================== */

function applyPurchaseStock(purchase){
increaseStock(purchase.items || []);
}

function reversePurchaseStock(purchase){
decreaseStock(purchase.items || []);
}

function applySaleStock(sale){
decreaseStock(sale.items || []);
}

function reverseSaleStock(sale){
increaseStock(sale.items || []);
}