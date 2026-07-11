
// ======================================
// ELEMENTS
// ======================================

const form =
document.getElementById(
    "productForm"
);

const steps =
document.querySelectorAll(
    ".step"
);

const navSteps =
document.querySelectorAll(
    ".nav-step"
);

const progressFill =
document.getElementById(
    "progressFill"
);

const prevBtn =
document.getElementById(
    "prevBtn"
);

const nextBtn =
document.getElementById(
    "nextBtn"
);

const submitBtn =
document.getElementById(
    "submitBtn"
);

const toast =
document.getElementById(
    "toast"
);

const productImage =
document.getElementById(
    "productImage"
);

const previewImage =
document.getElementById(
    "previewImage"
);

const reviewContent =
document.getElementById(
    "reviewContent"
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
// WIZARD
// ======================================

let currentStep = 0;

function updateWizard() {

    steps.forEach(

        (step,index)=>{

            step.classList.toggle(
                "active",
                index === currentStep
            );

        }

    );

    navSteps.forEach(

        (step,index)=>{

            step.classList.toggle(
                "active",
                index <= currentStep
            );

        }

    );

    const progress =
        (
            currentStep
            /
            (steps.length - 1)
        ) * 100;

    progressFill.style.width =
        progress + "%";

    prevBtn.style.display =
        currentStep === 0
        ? "none"
        : "block";

    nextBtn.style.display =
        currentStep ===
        steps.length - 1
        ? "none"
        : "block";

    submitBtn.style.display =
        currentStep ===
        steps.length - 1
        ? "block"
        : "none";

    if(
        currentStep === 3
    ){

        generateReview();

    }

}

// ======================================
// NEXT
// ======================================

nextBtn.addEventListener(
    "click",
    ()=>{

        if(
            currentStep <
            steps.length - 1
        ){

            currentStep++;

            updateWizard();

        }

    }
);

// ======================================
// PREVIOUS
// ======================================

prevBtn.addEventListener(
    "click",
    ()=>{

        if(
            currentStep > 0
        ){

            currentStep--;

            updateWizard();

        }

    }
);

// ======================================
// PROFIT CALCULATION
// ======================================

function calculateProfit(){

    const cost =
        Number(
            costPriceInput.value
        ) || 0;

    const selling =
        Number(
            sellingPriceInput.value
        ) || 0;

    const profit =
        selling - cost;

    let margin = 0;

    if(
        cost > 0
    ){

        margin =
            (
                profit / cost
            ) * 100;

    }

    profitAmount.textContent =
        "K" +
        profit.toFixed(2);

    profitMargin.textContent =
        margin.toFixed(1)
        + "%";

}

costPriceInput.addEventListener(
    "input",
    calculateProfit
);

sellingPriceInput.addEventListener(
    "input",
    calculateProfit
);

// ======================================
// IMAGE PREVIEW
// ======================================

productImage.addEventListener(
    "input",
    ()=>{

        const url =
            productImage.value.trim();

        if(
            url
        ){

            previewImage.src =
                url;

        }

    }
);

// ======================================
// REVIEW
// ======================================

function generateReview(){

    const name =
        document
        .getElementById(
            "productName"
        )
        .value;

    const category =
        document
        .getElementById(
            "productCategory"
        )
        .value;

    const costPrice =
        document
        .getElementById(
            "costPrice"
        )
        .value;

    const sellingPrice =
        document
        .getElementById(
            "sellingPrice"
        )
        .value;

    const stock =
        document
        .getElementById(
            "stockQty"
        )
        .value;

    const profit =
        (
            Number(
                sellingPrice
            )
            -
            Number(
                costPrice
            )
        );

    reviewContent.innerHTML =

        `
        <p>
            <strong>Name:</strong>
            ${name}
        </p>

        <p>
            <strong>Category:</strong>
            ${category}
        </p>

        <p>
            <strong>Cost Price:</strong>
            K${costPrice}
        </p>

        <p>
            <strong>Selling Price:</strong>
            K${sellingPrice}
        </p>

        <p>
            <strong>Profit:</strong>
            K${profit}
        </p>

        <p>
            <strong>Stock:</strong>
            ${stock}
        </p>
        `;

}

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

// ======================================
// TOAST
// ======================================

function showToast(){

    toast.classList.add(
        "show"
    );

    setTimeout(

        ()=>{

            toast.classList.remove(
                "show"
            );

        },

        3000

    );

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

if (exists) {
    alert("This product already exists.");
    return;
}

products.push(product);

// ADD PRODUCT TO LS ARRAY//

        products.push(
            product
        );

        saveProducts(
            products
        );

        showToast();

        form.reset();

        previewImage.src =
        "https://via.placeholder.com/200x150?text=Product+Image";

        profitAmount.textContent =
            "K0.00";

        profitMargin.textContent =
            "0%";

        currentStep = 0;

        updateWizard();

    }

);

document.addEventListener(
    "keydown",
    e => {

        if(
            e.key === "Enter" &&
            currentStep < 3
        ){

            e.preventDefault();

            nextBtn.click();

        }

    }
);

// ======================================
// INITIALIZE
// ======================================

updateWizard();

