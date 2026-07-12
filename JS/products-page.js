let products =
    JSON.parse(
        localStorage.getItem(
            "pos_products"
        )
    ) || [];

const tableBody =
    document.getElementById(
        "productsTableBody"
    );

function saveProducts() {

    localStorage.setItem(
        "pos_products",
        JSON.stringify(products)
    );

}

function renderProducts(
    list = products
) {

    tableBody.innerHTML = "";

    list.forEach(product => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>K${product.costPrice}</td>

            <td>K${product.price}</td>

            <td>${product.stock}</td>

            <td>
<td>

    <button
        class="view-btn"
        onclick="viewProduct(${product.id})">

        <i class="fas fa-eye"></i>

    </button>

</td>

        `;

        tableBody.appendChild(row);

    });

}

function deleteProduct(id) {
    if (
        !confirm(
            "Delete this product?"
        )
    ) return;

    products =
        products.filter(
            p => p.id !== id
        );

    saveProducts();

    renderProducts();

}

function editProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );

    if (!product) return;

    document.getElementById("editId").value =
        product.id;

    document.getElementById("editName").value =
        product.name;

    document.getElementById("editCategory").value =
        product.category;

    document.getElementById("editCostPrice").value =
        product.costPrice;

    document.getElementById("editSellingPrice").value =
        product.price;

    document.getElementById("editStock").value =
        product.stock;

    document
        .getElementById("editModal")
        .classList.add("show");

}

document
.getElementById("saveEditBtn")
.addEventListener(
    "click",
    () => {
    if(thisUser.access!=='Administrator'){
        showModal(`Hi ${thisUser.firstName}`, 'Sorry Something Went Wrong','nop');
        return;
    }
        const id =
            Number(
                document
                .getElementById(
                    "editId"
                ).value
            );

        const product =
            products.find(
                p => p.id === id
            );

        product.name =
            document
            .getElementById(
                "editName"
            ).value;

        product.category =
            document
            .getElementById(
                "editCategory"
            ).value;

        product.costPrice =
            Number(
                document
                .getElementById(
                    "editCostPrice"
                ).value
            );

        product.price =
            Number(
                document
                .getElementById(
                    "editSellingPrice"
                ).value
            );

        product.stock =
            Number(
                document
                .getElementById(
                    "editStock"
                ).value
            );

        saveProducts();

        renderProducts();

        document
        .getElementById(
            "editModal"
        )
        .classList.remove(
            "show"
        );
  showModal(`Hi ${thisUser.firstName}`, 'Updated Successfully','success');
    }
   
);

document
.getElementById(
    "closeModalBtn"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "editModal"
        )
        .classList.remove(
            "show"
        );

    }
);

document
.getElementById(
    "productSearch"
)
.addEventListener(
    "input",
    e => {

        const keyword =
            e.target.value
            .toLowerCase();

        const filtered =
            products.filter(
                product =>

                product.name
                .toLowerCase()
                .includes(keyword)

                ||

                product.category
                .toLowerCase()
                .includes(keyword)
            );

        renderProducts(filtered);

    }
);


let selectedProductId = null;

function viewProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );

    if (!product) return;

    selectedProductId = id;

    document
        .getElementById(
            "actionProductName"
        )
        .textContent =
        product.name;

    document
        .getElementById(
            "actionCategory"
        )
        .textContent =
        product.category;

    document
        .getElementById(
            "actionCost"
        )
        .textContent =
        "K" +
        product.costPrice;

    document
        .getElementById(
            "actionPrice"
        )
        .textContent =
        "K" +
        product.price;

    document
        .getElementById(
            "actionStock"
        )
        .textContent =
        product.stock;

    document
        .getElementById(
            "productActionModal"
        )
        .classList.add(
            "show"
        );

}


// close modal

document
.getElementById(
    "closeActionModal"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "productActionModal"
        )
        .classList.remove(
            "show"
        );

    }
);

//connect edit button

document
.getElementById(
    "editProductBtn"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "productActionModal"
        )
        .classList.remove(
            "show"
        );

        editProduct(
            selectedProductId
        );

    }
);
document
.getElementById("deleteProductBtn")
.addEventListener(
    "click",
    () => {
    if(thisUser.access!=='Administrator'){
        showModal(`Hi ${thisUser.firstName}`, 'Sorry Something Went Wrong','nop');
        return;
    }
        products =
            products.filter(
                p => p.id !== selectedProductId
            );

        saveProducts();

        renderProducts();

        document
        .getElementById(
            "productActionModal"
        )
        .classList.remove(
            "show"
        );

    }
);

// connect delete button

document
.getElementById(
    "deleteProductBtn"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "productActionModal"
        )
        .classList.remove(
            "show"
        );

        showConfirm(

            "Delete Product",

            "This product will be permanently deleted.",

            () => {

                products =
                    products.filter(
                        p =>
                        p.id !==
                        selectedProductId
                    );

                saveProducts();

                renderProducts();

            }

        );

    }
);


renderProducts();