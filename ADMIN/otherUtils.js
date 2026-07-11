/*=========================================================
    POS UTILITIES
    Version 2.0
=========================================================*/

/*=========================================================
GLOBAL STATE
=========================================================*/

let currentView = "summary";


/*=========================================================
LOCAL STORAGE KEYS
=========================================================*/

const STORAGE_KEYS = {

    PRODUCTS: "pos_products",

    SALES: "pos_sales",

    PURCHASES: "pos_purchases",

    CART: "pos_cart",

    USER: "currentUser"

};


/*=========================================================
STORAGE HELPERS
=========================================================*/

function getProducts() {

    return JSON.parse(

        localStorage.getItem(

            STORAGE_KEYS.PRODUCTS

        )

    ) || [];

}

function saveProducts(products) {

    localStorage.setItem(

        STORAGE_KEYS.PRODUCTS,

        JSON.stringify(products)

    );

}

function getSales() {

    return JSON.parse(

        localStorage.getItem(

            STORAGE_KEYS.SALES

        )

    ) || [];

}

function saveSales(sales) {

    localStorage.setItem(

        STORAGE_KEYS.SALES,

        JSON.stringify(sales)

    );

}

function getPurchases() {

    return JSON.parse(

        localStorage.getItem(

            STORAGE_KEYS.PURCHASES

        )

    ) || [];

}

function savePurchases(purchases) {

    localStorage.setItem(

        STORAGE_KEYS.PURCHASES,

        JSON.stringify(purchases)

    );

}


/*=========================================================
NUMBER HELPERS
=========================================================*/

function toNumber(value) {

    return Number(value) || 0;

}

function pad(value) {

    return String(value).padStart(2, "0");

}


/*=========================================================
ISO WEEK NUMBER
=========================================================*/

function getWeekNumber(date = new Date()) {

    const utc = new Date(

        Date.UTC(

            date.getFullYear(),

            date.getMonth(),

            date.getDate()

        )

    );

    const day = utc.getUTCDay() || 7;

    utc.setUTCDate(

        utc.getUTCDate() + 4 - day

    );

    const yearStart = new Date(

        Date.UTC(

            utc.getUTCFullYear(),

            0,

            1

        )

    );

    return Math.ceil(

        (

            (

                (utc - yearStart) /

                86400000

            ) + 1

        ) / 7

    );

}


/*=========================================================
CREATE DATE OBJECT
=========================================================*/

function createDateObject() {

    const now = new Date();

    const year = now.getFullYear();

    const month = now.getMonth() + 1;

    const day = now.getDate();

    const hour = now.getHours();

    const minute = now.getMinutes();

    const second = now.getSeconds();

    return {

        /* Calendar */

        day,

        month,

        year,

        weekday: now.getDay(),

        week: getWeekNumber(now),

        quarter: Math.ceil(month / 3),

        /* Time */

        hour,

        minute,

        second,

        /* IDs */

        dateId: Number(

            `${year}${pad(month)}${pad(day)}`

        ),

        monthId: Number(

            `${year}${pad(month)}`

        ),

        yearId: year,

        /* Display */

        displayDate:

            `${pad(day)}/${pad(month)}/${year}`,

        displayTime:

            `${pad(hour)}:${pad(minute)}:${pad(second)}`,

        display:

            `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}`,

        /* Raw */

        timestamp: now.getTime(),

        iso: now.toISOString()

    };

}


/*=========================================================
GET RECORD DATE

Supports BOTH

record.date
record.Date

Supports BOTH

Old ISO String
New Date Object

=========================================================*/

function getRecordDate(record) {

    if (!record) return null;

    const value = record.date || record.Date;

    if (!value) return null;

    /*
        NEW FORMAT
    */

    if (typeof value === "object") {

        return value;

    }

    /*
        OLD FORMAT
    */

    const d = new Date(value);

    return {

        day: d.getDate(),

        month: d.getMonth() + 1,

        year: d.getFullYear(),

        hour: d.getHours(),

        minute: d.getMinutes(),

        second: d.getSeconds(),

        weekday: d.getDay(),

        week: getWeekNumber(d),

        quarter: Math.ceil(

            (d.getMonth() + 1) / 3

        ),

        dateId: Number(

            `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`

        ),

        monthId: Number(

            `${d.getFullYear()}${pad(d.getMonth()+1)}`

        ),

        yearId: d.getFullYear(),

        displayDate:

            `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`,

        displayTime:

            `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,

        display:

            `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`,

        timestamp: d.getTime(),

        iso: d.toISOString()

    };

}

// PART 2//




/* ==========================================================
   PRODUCT ANALYTICS ENGINE
========================================================== */

function getProductAnalytics(productId) {

    const product = getProducts().find(

        p => String(p.id) === String(productId)

    );

    if (!product) return null;

    const sales = getSales();

    const purchases = getPurchases();

    let purchasedQty = 0;
    let purchasedValue = 0;

    let soldQty = 0;
    let revenue = 0;
    let costOfSales = 0;
    let profit = 0;

    const purchaseHistory = [];
    const salesHistory = [];
    const ledger = [];

    /* ---------------- Purchases ---------------- */

    purchases.forEach(purchase => {

        purchase.items.forEach(item => {

            if (String(item.id) !== String(product.id)) return;

            const amount = item.qty * item.costPrice;

            purchasedQty += item.qty;
            purchasedValue += amount;

            purchaseHistory.push({

                purchaseId: purchase.id,

                supplier: purchase.supplier,

                qty: item.qty,

                costPrice: item.costPrice,

                total: amount,

                date: getRecordDate(purchase)

            });

            ledger.push({

                type: "Purchase",

                qty: item.qty,

                balance: 0,

                date: getRecordDate(purchase)

            });

        });

    });

    /* ---------------- Sales ---------------- */

    sales.forEach(sale => {

        sale.items.forEach(item => {

            if (String(item.id) !== String(product.id)) return;

            const saleTotal = item.qty * item.price;
            const costTotal = item.qty * item.costPrice;

            soldQty += item.qty;
            revenue += saleTotal;
            costOfSales += costTotal;
            profit += saleTotal - costTotal;

            salesHistory.push({

                saleId: sale.id,

                qty: item.qty,

                price: item.price,

                total: saleTotal,

                profit: saleTotal - costTotal,

                date: getRecordDate(sale)

            });

            ledger.push({

                type: "Sale",

                qty: -item.qty,

                balance: 0,

                date: getRecordDate(sale)

            });

        });

    });

    /* ---------------- Sort Ledger ---------------- */

    ledger.sort(

        (a, b) =>

            a.date.timestamp -

            b.date.timestamp

    );

    /* ---------------- Running Balance ---------------- */

    let running =

        purchasedQty -

        soldQty -

        product.stock;

    ledger.forEach(row => {

        running += row.qty;

        row.balance = running;

    });

    /* ---------------- Calculations ---------------- */

    const openingStock =

        product.stock +

        soldQty -

        purchasedQty;

    const averageCost =

        purchasedQty

            ? purchasedValue / purchasedQty

            : product.costPrice;

    const averageSellingPrice =

        soldQty

            ? revenue / soldQty

            : product.price;

    const stockValue =

        product.stock *

        product.costPrice;

    const turnover =

        openingStock > 0

            ? ((soldQty / openingStock) * 100)

            : 0;

    const profitMargin =

        revenue > 0

            ? ((profit / revenue) * 100)

            : 0;

    return {

        product,

        openingStock,

        currentStock: product.stock,

        purchasedQty,

        soldQty,

        revenue,

        purchasedValue,

        costOfSales,

        profit,

        stockValue,

        averageCost,

        averageSellingPrice,

        turnover,

        profitMargin,

        purchaseHistory,

        salesHistory,

        ledger

    };

}




/* ==========================================================
   SALES ANALYTICS ENGINE
========================================================== */

function getSalesAnalytics() {

    const sales = getSales();

    const analytics = {

        records: sales,

        count: 0,

        revenue: 0,

        cost: 0,

        profit: 0,

        itemsSold: 0,

        averageSale: 0,

        averageProfit: 0,

        today: {

            count: 0,

            revenue: 0,

            cost: 0,

            profit: 0,

            itemsSold: 0

        },

        week: {

            count: 0,

            revenue: 0,

            cost: 0,

            profit: 0,

            itemsSold: 0

        },

        month: {

            count: 0,

            revenue: 0,

            cost: 0,

            profit: 0,

            itemsSold: 0

        },

        year: {

            count: 0,

            revenue: 0,

            cost: 0,

            profit: 0,

            itemsSold: 0

        },

        categories: {},

        topProducts: {}

    };

    const today = createDateObject();

    sales.forEach(sale => {

        const d = getRecordDate(sale);

        if (!d) return;

        analytics.count++;

        analytics.revenue += Number(sale.total || 0);

        analytics.cost += Number(sale.costTotal || 0);

        analytics.profit += Number(sale.profit || 0);

        sale.items.forEach(item => {

            const qty = Number(item.qty || 0);

            analytics.itemsSold += qty;

            /* Category */

            const category = item.category || "Uncategorized";

            if (!analytics.categories[category]) {

                analytics.categories[category] = {

                    qty: 0,

                    revenue: 0,

                    profit: 0

                };

            }

            analytics.categories[category].qty += qty;

            analytics.categories[category].revenue += Number(item.amount || (item.qty * item.price));

            analytics.categories[category].profit += Number(item.profit || ((item.price - item.costPrice) * item.qty));

            /* Product */

            if (!analytics.topProducts[item.id]) {

                analytics.topProducts[item.id] = {

                    id: item.id,

                    name: item.name,

                    qty: 0,

                    revenue: 0,

                    profit: 0

                };

            }

            analytics.topProducts[item.id].qty += qty;

            analytics.topProducts[item.id].revenue += Number(item.amount || (item.qty * item.price));

            analytics.topProducts[item.id].profit += Number(item.profit || ((item.price - item.costPrice) * item.qty));

        });

        /* TODAY */

        if (d.dateId === today.dateId) {

            analytics.today.count++;

            analytics.today.revenue += Number(sale.total || 0);

            analytics.today.cost += Number(sale.costTotal || 0);

            analytics.today.profit += Number(sale.profit || 0);

            sale.items.forEach(item => {

                analytics.today.itemsSold += Number(item.qty);

            });

        }

        /* WEEK */

        if (

            d.week === today.week &&

            d.year === today.year

        ) {

            analytics.week.count++;

            analytics.week.revenue += Number(sale.total || 0);

            analytics.week.cost += Number(sale.costTotal || 0);

            analytics.week.profit += Number(sale.profit || 0);

            sale.items.forEach(item => {

                analytics.week.itemsSold += Number(item.qty);

            });

        }

        /* MONTH */

        if (d.monthId === today.monthId) {

            analytics.month.count++;

            analytics.month.revenue += Number(sale.total || 0);

            analytics.month.cost += Number(sale.costTotal || 0);

            analytics.month.profit += Number(sale.profit || 0);

            sale.items.forEach(item => {

                analytics.month.itemsSold += Number(item.qty);

            });

        }

        /* YEAR */

        if (d.yearId === today.yearId) {

            analytics.year.count++;

            analytics.year.revenue += Number(sale.total || 0);

            analytics.year.cost += Number(sale.costTotal || 0);

            analytics.year.profit += Number(sale.profit || 0);

            sale.items.forEach(item => {

                analytics.year.itemsSold += Number(item.qty);

            });

        }

    });

    analytics.averageSale =

        analytics.count

            ? analytics.revenue / analytics.count

            : 0;

    analytics.averageProfit =

        analytics.count

            ? analytics.profit / analytics.count

            : 0;

    analytics.topProducts =

        Object.values(analytics.topProducts)

        .sort((a,b)=>b.qty-a.qty);

    analytics.categories =

        Object.entries(analytics.categories)

        .sort((a,b)=>b[1].revenue-a[1].revenue);

    return analytics;

}


/* ==========================================================
// PURCHASE ANALYTICS ENGINE
==========================================================*/


function getPurchaseAnalytics() {

    const purchases = getPurchases();

    const analytics = {

        records: purchases,

        count: 0,

        totalSpent: 0,

        itemsPurchased: 0,

        averagePurchase: 0,

        suppliers: {},

        topProducts: {},

        today: {

            count: 0,

            totalSpent: 0,

            itemsPurchased: 0

        },

        week: {

            count: 0,

            totalSpent: 0,

            itemsPurchased: 0

        },

        month: {

            count: 0,

            totalSpent: 0,

            itemsPurchased: 0

        },

        year: {

            count: 0,

            totalSpent: 0,

            itemsPurchased: 0

        }

    };

    const today = createDateObject();

    purchases.forEach(purchase => {

        const d = getRecordDate(purchase);

        if (!d) return;

        analytics.count++;

        analytics.totalSpent += Number(purchase.total || 0);

        /* Suppliers */

        const supplier = purchase.supplier || "Walk-in Supplier";

        if (!analytics.suppliers[supplier]) {

            analytics.suppliers[supplier] = {

                supplier,

                purchases: 0,

                amount: 0

            };

        }

        analytics.suppliers[supplier].purchases++;

        analytics.suppliers[supplier].amount += Number(purchase.total || 0);

        purchase.items.forEach(item => {

            const qty = Number(item.qty || 0);

            analytics.itemsPurchased += qty;

            /* Products */

            if (!analytics.topProducts[item.id]) {

                analytics.topProducts[item.id] = {

                    id: item.id,

                    name: item.name,

                    qty: 0,

                    amount: 0

                };

            }

            analytics.topProducts[item.id].qty += qty;

            analytics.topProducts[item.id].amount +=

                qty * Number(item.costPrice || 0);

        });

        /* TODAY */

        if (d.dateId === today.dateId) {

            analytics.today.count++;

            analytics.today.totalSpent += Number(purchase.total || 0);

            purchase.items.forEach(item => {

                analytics.today.itemsPurchased += Number(item.qty);

            });

        }

        /* WEEK */

        if (

            d.week === today.week &&

            d.year === today.year

        ) {

            analytics.week.count++;

            analytics.week.totalSpent += Number(purchase.total || 0);

            purchase.items.forEach(item => {

                analytics.week.itemsPurchased += Number(item.qty);

            });

        }

        /* MONTH */

        if (d.monthId === today.monthId) {

            analytics.month.count++;

            analytics.month.totalSpent += Number(purchase.total || 0);

            purchase.items.forEach(item => {

                analytics.month.itemsPurchased += Number(item.qty);

            });

        }

        /* YEAR */

        if (d.yearId === today.yearId) {

            analytics.year.count++;

            analytics.year.totalSpent += Number(purchase.total || 0);

            purchase.items.forEach(item => {

                analytics.year.itemsPurchased += Number(item.qty);

            });

        }

    });

    analytics.averagePurchase =

        analytics.count

            ? analytics.totalSpent / analytics.count

            : 0;

    analytics.topProducts =

        Object.values(analytics.topProducts)

        .sort((a,b)=>b.qty-a.qty);

    analytics.suppliers =

        Object.values(analytics.suppliers)

        .sort((a,b)=>b.amount-a.amount);

    return analytics;

}