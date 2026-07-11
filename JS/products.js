/*==========================================
    PRODUCTS UI MODULE
==========================================*/

/*==========================================
    RENDER PRODUCTS
==========================================*/

function renderProducts(

    productList = getProducts()

){

    const grid =

    document.getElementById(

        "productGrid"

    );

    if(!grid) return;

    grid.innerHTML = "";

    if(productList.length===0){

        grid.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-box-open"></i>

            <h3>No Products Found</h3>

        </div>

        `;

        return;

    }

    productList.forEach(product=>{

        const card =

        document.createElement("div");

        card.className =

        "product-card";

        card.innerHTML = `

        <div class="product-top">

            <h3>

                ${product.name}

            </h3>

            <span class="stock-badge">

                ${product.stock}

            </span>

        </div>

        <div class="product-category">

            ${product.category||"General"}

        </div>

        <div class="product-price">

            ${formatCurrency(product.price)}

        </div>

        <button class="add-btn">

            <i class="fa-solid fa-cart-plus"></i>

            Add To Cart

        </button>

        `;

        card

        .querySelector(".add-btn")

        .addEventListener(

            "click",

            ()=>{

                if(typeof addToCart==="function"){

                    addToCart(product);

                }

            }

        );

        grid.appendChild(card);

    });

}

/*==========================================
    CATEGORY FILTER
==========================================*/

function renderCategories(){

    const select =

    document.getElementById(

        "categoryFilter"

    );

    if(!select) return;

    const products =

    getProducts();

    const categories =

    [

        "all",

        ...new Set(

            products.map(

                p=>p.category||"General"

            )

        )

    ];

    select.innerHTML = "";

    categories.forEach(category=>{

        const option =

        document.createElement("option");

        option.value = category;

        option.textContent =

        category==="all"

        ?

        "All Categories"

        :

        category;

        select.appendChild(option);

    });

}

/*==========================================
    SEARCH
==========================================*/

function searchProducts(){

    const keyword =

    document

    .getElementById("search")

    ?.value

    .toLowerCase()

    .trim() || "";

    let list =

    getProducts();

    if(keyword){

        list = list.filter(product=>{

            return (

                (product.name||"")

                .toLowerCase()

                .includes(keyword)

                ||

                (product.category||"")

                .toLowerCase()

                .includes(keyword)

            );

        });

    }

    const category =

    document

    .getElementById(

        "categoryFilter"

    )?.value;

    if(

        category &&

        category!=="all"

    ){

        list = list.filter(

            p=>p.category===category

        );

    }

    renderProducts(list);

}

/*==========================================
    INITIALIZE
==========================================*/

function initializeProducts(){

    renderCategories();

    renderProducts();

    const search =

    document.getElementById(

        "search"

    );

    if(search){

        search.addEventListener(

            "input",

            searchProducts

        );

    }

    const filter =

    document.getElementById(

        "categoryFilter"

    );

    if(filter){

        filter.addEventListener(

            "change",

            searchProducts

        );

    }

}

/*==========================================
    START
==========================================*/

initializeProducts();