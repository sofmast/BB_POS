const form =
document.getElementById(
    "productForm"
);

const steps =
document.querySelectorAll(
    ".step"
);

const nextBtn =
document.getElementById(
    "nextBtn"
);

const prevBtn =
document.getElementById(
    "prevBtn"
);

const submitBtn =
document.getElementById(
    "submitBtn"
);

const progress =
document.getElementById(
    "progress"
);

let currentStep = 0;

function updateSteps(){

    steps.forEach(

        (step,index)=>{

            step.classList.remove(
                "active"
            );

            if(
                index === currentStep
            ){

                step.classList.add(
                    "active"
                );

            }

        }

    );

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

    progress.style.width =
        (
            (
                currentStep + 1
            )
            /
            steps.length
        ) * 100 + "%";

}

nextBtn.addEventListener(
    "click",
    ()=>{

        if(
            currentStep <
            steps.length - 1
        ){

            currentStep++;

            updateSteps();

        }

    }
);

prevBtn.addEventListener(
    "click",
    ()=>{

        if(
            currentStep > 0
        ){

            currentStep--;

            updateSteps();

        }

    }
);

updateSteps();

function getProducts() {

    const products =
        localStorage.getItem(
            "pos_products"
        );

    return products
        ? JSON.parse(products)
        : [];

}

function saveProducts(
    products
) {

    localStorage.setItem(
        "pos_products",
        JSON.stringify(
            products
        )
    );

}

form.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        const products =
            getProducts();

        const product = {

            id:
                Date.now(),

            name:
                document
                .getElementById(
                    "productName"
                )
                .value,

            category:
                document
                .getElementById(
                    "productCategory"
                )
                .value,

            costPrice:
                Number(
                    document
                    .getElementById(
                        "costPrice"
                    )
                    .value
                ),

            price:
                Number(
                    document
                    .getElementById(
                        "sellingPrice"
                    )
                    .value
                ),

            stock:
                Number(
                    document
                    .getElementById(
                        "stockQty"
                    )
                    .value
                ),

            image:
                document
                .getElementById(
                    "productImage"
                )
                .value

        };

        products.push(
            product
        );

        saveProducts(
            products
        );

        alert(
            "Product Added Successfully"
        );

        form.reset();

        currentStep = 0;

        updateSteps();

    }
);