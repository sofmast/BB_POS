// ========================================
// STORAGE
// ========================================

function getProducts() {

    return JSON.parse(
        localStorage.getItem(
            "pos_products"
        )
    ) || [];

}

function getSales() {

    return JSON.parse(
        localStorage.getItem(
            "pos_sales"
        )
    ) || [];

}

function getPurchases() {

    return JSON.parse(
        localStorage.getItem(
            "pos_purchases"
        )
    ) || [];

}

// ========================================
// ELEMENTS
// ========================================

const reportTableBody =
    document.getElementById(
        "reportTableBody"
    );

const productSearch =
    document.getElementById(
        "productSearch"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const recordCount =
    document.getElementById(
        "recordCount"
    );

const totalProducts =
    document.getElementById(
        "totalProducts"
    );

const inventoryValue =
    document.getElementById(
        "inventoryValue"
    );

const unitsSold =
    document.getElementById(
        "unitsSold"
    );

const profitToday =
    document.getElementById(
        "profitToday"
    );

const lowStockCount =
document.getElementById(
    "lowStockCount"
);

const outStockCount =
document.getElementById(
    "outStockCount"
);

// ========================================
// CATEGORY FILTER
// ========================================

function loadCategories() {

    const products =
        getProducts();

    const categories =
        [...new Set(
            products.map(
                p => p.category
            )
        )];

    categoryFilter.innerHTML =
        `<option value="">
            All Categories
        </option>`;

    categories.forEach(cat => {

        categoryFilter.innerHTML += `

            <option value="${cat}">

                ${cat}

            </option>

        `;

    });

}

// ========================================
// REPORT DATA
// ========================================

function buildProductReport() {

    const products =
        getProducts();

    const sales =
        getSales();

    const purchases =
        getPurchases();

    return products.map(product => {

        let purchasedQty = 0;

        let purchasedValue = 0;

        let soldQty = 0;

        let soldValue = 0;

        let profit = 0;

        // PURCHASES

        purchases.forEach(purchase => {

            if (
                !purchase.items
            ) return;

            purchase.items.forEach(item => {

                if (
                    String(item.id) ===
                    String(product.id)
                ) {

                    const qty =
                        Number(
                            item.qty || 0
                        );

                    const cost =
                        Number(
                            item.costPrice || 0
                        );

                    purchasedQty += qty;

                    purchasedValue +=
                        qty * cost;

                }

            });

        });

        // SALES

        sales.forEach(sale => {

            if (
                !sale.items
            ) return;

            sale.items.forEach(item => {

                if (
                    String(item.id) ===
                    String(product.id)
                ) {

                    const qty =
                        Number(
                            item.qty || 0
                        );

                    const price =
                        Number(
                            item.price || 0
                        );

                    const cost =
                        Number(
                            item.costPrice || 0
                        );

                    soldQty += qty;

                    soldValue +=
                        qty * price;

                    profit +=
                        qty *
                        (price - cost);

                }

            });

        });

        const openingStock =

            Number(
                product.stock || 0
            )

            +

            soldQty

            -

            purchasedQty;

        const stockValue =

            Number(
                product.stock || 0
            )

            *

            Number(
                product.costPrice || 0
            );

        return {

            ...product,

            openingStock,

            purchasedQty,

            purchasedValue,

            soldQty,

            soldValue,

            profit,

            stockValue

        };

    });

}

// ========================================
// RENDER TABLE
// ========================================

function renderReport() {

    const search =
        productSearch.value
        .toLowerCase();

    const category =
        categoryFilter.value;

    let data =
        buildProductReport();

    if (search) {

        data = data.filter(

            product =>

                product.name
                .toLowerCase()
                .includes(search)

        );

    }

    if (category) {

        data = data.filter(

            product =>

                product.category ===
                category

        );

    }

    recordCount.textContent =

        `${data.length} Products`;

    reportTableBody.innerHTML =
        "";

    data.forEach(product => {

        let statusClass =
            "good";

        let statusText =
            "Healthy";

        if (
            product.stock <= 0
        ) {

            statusClass =
                "out";

            statusText =
                "Out";

        }

        else if (
            product.stock <= 10
        ) {

            statusClass =
                "low";

            statusText =
                "Low";

        }

        reportTableBody.innerHTML += `

<tr>

<td>
    ${product.name}
</td>

<td>
    ${product.category}
</td>

<td>
    ${product.openingStock}
</td>

<td>
    ${product.purchasedQty}
</td>

<td>
    ${product.soldQty}
</td>

<td>
    ${product.stock}
</td>

<td>
 ${formatCurrency(product.costPrice)}
</td>

<td>
  ${formatCurrency(product.price)}
</td>

<td>
   ${formatCurrency(product.soldQty*product.price)}
</td>

<td>
  ${formatCurrency(product.profit)}
</td>

<td>

<span class="status ${statusClass}">

    ${statusText}

</span>

</td>

</tr>

`;

    });

    updateSummaryCards();

}

// ========================================
// SUMMARY CARDS
// ========================================

function updateSummaryCards() {

    const data =
        buildProductReport();

    totalProducts.textContent =

        data.length;

    const inventory =
        data.reduce(

            (sum,product) =>

                sum +

                product.stockValue,

            0

        );

    inventoryValue.textContent =

        `K${inventory
            .toFixed(2)}`;

    const sold =
        data.reduce(

            (sum,product) =>

                sum +

                product.soldQty,

            0

        );

    unitsSold.textContent =
        sold;

    const profit =
        data.reduce(

            (sum,product) =>

                sum +

                product.profit,

            0

        );

    profitToday.textContent =

        `K${profit
            .toFixed(2)}`;

            const lowStock =

    data.filter(

        p =>

            p.stock > 0 &&

            p.stock <= 10

    ).length;

const outStock =

    data.filter(

        p =>

            p.stock <= 0

    ).length;

lowStockCount.textContent =
    lowStock;

outStockCount.textContent =
    outStock;

}

// ========================================
// EVENTS
// ========================================

productSearch.addEventListener(

    "input",

    renderReport

);

categoryFilter.addEventListener(

    "change",

    renderReport

);

//SIDEBAR SCRIPT -->

const menuBtn = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");

menuBtn.addEventListener("click", ()=>{

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");

});


overlay.addEventListener("click", ()=>{

    sidebar.classList.remove("active");
    overlay.classList.remove("active");

});


// Optional desktop hover behavior

if(window.innerWidth > 992){

    sidebar.addEventListener("mouseenter", ()=>{

        sidebar.classList.add("active");

    });

    sidebar.addEventListener("mouseleave", ()=>{

        sidebar.classList.remove("active");

    });

}

// ========================================
// INIT
// ========================================

loadCategories();

