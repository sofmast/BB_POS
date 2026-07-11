// ========================================
// LOAD CATEGORIES
// ========================================

function loadCategories() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    if (!categoryFilter) return;

    categoryFilter.innerHTML =
        `<option value="all">
            All Categories
        </option>`;

    const categories =
        [...new Set(
            products.map(
                p => p.category
            )
        )];

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category;

        option.textContent =
            category;

        categoryFilter.appendChild(
            option
        );

    });

}


// ========================================
// CATEGORY FILTER
// ========================================

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        () => {

            const selected =
                categoryFilter.value;

            if (
                selected === "all"
            ) {

                renderProducts();

                return;

            }

            const filtered =
                products.filter(
                    product =>
                        product.category ===
                        selected
                );

            renderProducts(
                filtered
            );

        }
    );

}


// ========================================
// REDUCE STOCK
// ========================================

function reduceStock() {

    cart.forEach(cartItem => {

        const product =
            products.find(
                p =>
                p.id ===
                cartItem.id
            );

        if (product) {

            product.stock -=
                cartItem.qty;

            if (
                product.stock < 0
            ) {

                product.stock = 0;

            }

        }

    });

    localStorage.setItem(
        "pos_products",
        JSON.stringify(
            products
        )
    );

}

//============================
// INITIALIZE
//============================
saveSale(sale);

reduceStock();

renderProducts();

loadCategories();

showReceipt(sale);