/*=========================================
    BABBAGE POS
    SHARED STORAGE LAYER
=========================================*/


/*=========================================
    PRODUCTS
=========================================*/

function getProducts(){

    return JSON.parse(

        localStorage.getItem(

            "pos_products"

        )

    ) || [];

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


/*=========================================
    SALES
=========================================*/

function getSales(){

    return JSON.parse(

        localStorage.getItem(

            "pos_sales"

        )

    ) || [];

}

function saveSales(

    sales

){

    localStorage.setItem(

        "pos_sales",

        JSON.stringify(

            sales

        )

    );

}

function saveSale(

    sale

){

    const sales =

    getSales();

    sales.push(

        sale

    );

    saveSales(

        sales

    );

}


/*=========================================
    PURCHASES
=========================================*/

function getPurchases(){

    return JSON.parse(

        localStorage.getItem(

            "pos_purchases"

        )

    ) || [];

}

function savePurchases(

    purchases

){

    localStorage.setItem(

        "pos_purchases",

        JSON.stringify(

            purchases

        )

    );

}

function savePurchase(

    purchase

){

    const purchases =

    getPurchases();

    purchases.push(

        purchase

    );

    savePurchases(

        purchases

    );

}


/*=========================================
    INVENTORY ROOMS
=========================================*/

function getInventoryRooms(){

    return JSON.parse(

        localStorage.getItem(

            "inventory_rooms"

        )

    ) || [];

}

function saveInventoryRooms(

    rooms

){

    localStorage.setItem(

        "inventory_rooms",

        JSON.stringify(

            rooms

        )

    );

}


/*=========================================
    CART
=========================================*/

function getCart(){

    return JSON.parse(

        localStorage.getItem(

            "cart"

        )

    ) || [];

}

function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(

            cart

        )

    );

}
/* BUSINESS NAME SETTINGS
function thisBusinee(){

    return JSON.parse(

        localStorage.getItem(

            "pos_settings"

        )

    ) || [];

}

function saveThisBusiness(){

    localStorage.setItem(

        "pos_settings",

        JSON.stringify(

            cart

        )

    );

}*/