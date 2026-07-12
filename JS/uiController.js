/*==================================================
 BABBAGE POS
 UI CONTROLLER ENGINE
==================================================*/


document.addEventListener(
"DOMContentLoaded",
function(){



/*==================================================
 SIDEBAR CONTROL
==================================================*/


const menuBtn =
document.getElementById(
"menuBtn"
);


const sidebar =
document.getElementById(
"sidebar"
);


const sidebarOverlay =
document.getElementById(
"sidebarOverlay"
);



function openSidebar(){


    sidebar.classList.add(
        "active"
    );


    sidebarOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
    "hidden";


}



function closeSidebar(){


    sidebar.classList.remove(
        "active"
    );


    sidebarOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
    "";


}




if(menuBtn){


    menuBtn.addEventListener(
        "click",
        function(){


            if(
                sidebar.classList.contains(
                    "active"
                )
            ){

                closeSidebar();

            }
            else{

                openSidebar();

            }


        }
    );


}





if(sidebarOverlay){


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );


}






/* ESCAPE KEY CLOSE */

document.addEventListener(
"keydown",
function(e){


    if(e.key==="Escape"){


        closeSidebar();

        closeAllModals();


    }


});







/*==================================================
 MODAL ENGINE
==================================================*/



function openModal(id){


    const modal =
    document.getElementById(
        id
    );


    if(!modal)
    return;



    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
    "hidden";


}




function closeModal(id){


    const modal =
    document.getElementById(
        id
    );


    if(!modal)
    return;



    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
    "";


}





function closeAllModals(){


    document
    .querySelectorAll(
        ".modal.show,.custom-modal.show"
    )
    .forEach(
        modal=>{


            modal.classList.remove(
                "show"
            );


        }
    );


    document.body.style.overflow =
    "";


}






/*==================================================
 CHECKOUT MODAL
==================================================*/


const checkoutBtn =
document.getElementById(
"checkoutBtn"
);



const closeCheckout =
document.getElementById(
"closeModal"
);



if(checkoutBtn){


    checkoutBtn.addEventListener(
        "click",
        function(){


            openModal(
                "checkoutModal"
            );


        }
    );


}



if(closeCheckout){


    closeCheckout.addEventListener(
        "click",
        function(){


            closeModal(
                "checkoutModal"
            );


        }
    );


}








/*==================================================
 RECEIPT MODAL
==================================================*/


const closeReceipt =
document.getElementById(
"closeReceiptBtn"
);



if(closeReceipt){


    closeReceipt.addEventListener(
        "click",
        function(){


            closeModal(
                "receiptModal"
            );


        }
    );


}






/*==================================================
 SETTINGS MODAL
==================================================*/


const settingsLink =
document.getElementById(
"settingsLink"
);



const closeSettings =
document.getElementById(
"closeSettingsBtn"
);





if(settingsLink){


    settingsLink.addEventListener(
        "click",
        function(e){


            e.preventDefault();


            openModal(
                "settingsModal"
            );


            closeSidebar();


        }
    );


}





if(closeSettings){


    closeSettings.addEventListener(
        "click",
        function(){


            closeModal(
                "settingsModal"
            );


        }
    );


}







/*==================================================
 CLICK OUTSIDE MODAL CLOSE
==================================================*/


document
.querySelectorAll(
".modal"
)
.forEach(
modal=>{


    modal.addEventListener(
    "click",
    function(e){


        if(
            e.target === modal
        ){

            modal.classList.remove(
                "show"
            );


            document.body.style.overflow =
            "";


        }


    });


});








/*==================================================
 WINDOW RESIZE FIX
==================================================*/


window.addEventListener(
"resize",
function(){


    if(
        window.innerWidth > 900
    ){

        closeSidebar();

    }


});



});

/*==================================================
 BABBAGE POS
 PRODUCT UI RENDERER
==================================


function renderProductCard(product){


    const stock =
    Number(product.stock || 0);



    let stockClass =
    "stock-available";


    let stockText =
    "Available";



    if(stock <= 0){

        stockClass =
        "stock-out";

        stockText =
        "Out of Stock";

    }

    else if(stock <= 5){

        stockClass =
        "stock-low";

        stockText =
        "Low Stock";

    }



    return `

    <div
    class="product-card"
    data-id="${product.id}">


        <div class="product-image">

            <i class="fas fa-box"></i>

        </div>



        <div class="product-info">


            <div class="product-name">

                ${product.name}

            </div>



            <div class="product-category">

                ${product.category || "General"}

            </div>



            <div class="product-price">

                ${formatCurrency(product.price)}

            </div>



            <div
            class="product-stock ${stockClass}">

                ${stockText}
                (${stock})

            </div>


        </div>



        <button
        class="add-product-btn"
        onclick="quickAdd(${product.id})">


            <i class="fas fa-cart-plus"></i>

            Add


        </button>


    </div>

    `;


}





function renderProductsUI(products){


    const grid =
    document.getElementById(
        "productGrid"
    );


    if(!grid)
    return;



    if(
        !products ||
        products.length===0
    ){


        grid.innerHTML = `

        <div class="empty">

            No products found

        </div>

        `;


        return;


    }



    grid.innerHTML =
    products
    .map(
        product=>
        renderProductCard(product)
    )
    .join("");



}*/


