//========================
// RENDER SALES
//========================

function renderSalesCards(){

    const container =
        document.getElementById(
            "salesContainer"
        );

    const sales =
        getSales();

    container.innerHTML = "";

    if(!sales.length){

        container.innerHTML=`

        <div style="
        text-align:center;
        padding:40px;
        font-size:18px">

        No Sales Found

        </div>

        `;

        return;

    }

    sales.reverse().forEach(

        sale=>{

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "sale-card";

            const itemsHTML =
                sale.items.map(

                item=>`

                <div class="sale-item">

                <span>

                ${item.name}
                x${item.qty}

                </span>

                <span>

                K${(
                    item.price*
                    item.qty
                ).toFixed(2)}

                </span>

                </div>

                `

                ).join("");

            card.innerHTML=`

            <div class="sale-header">

                <div>

                    <div class="sale-id">

                    ${sale.id}

                    </div>

                    <div class="sale-date">

                    ${sale.date}

                    </div>

                </div>

                <strong>

                K${sale.total.toFixed(2)}

                </strong>

            </div>

            <div class="sale-items">

            ${itemsHTML}

            </div>

            <div class="sale-footer">

                <div class="sale-summary">

                    <div>

                    Paid:
                    K${sale.paid}

                    </div>

                    <div>

                    Change:
                    K${sale.change}

                    </div>

                    <div>

                    Profit:
                    K${sale.profit}

                    </div>

                </div>

                <div class="sale-actions">

                    <button
                    class="
                    sale-btn
                    edit-btn"
                    onclick="
                    editSale(
                    '${sale.id}'
                    )">

                    Edit

                    </button>


                    <button
                    class="
                    sale-btn
                    delete-btn"
                    onclick="
                    deleteSale(
                    '${sale.id}'
                    )">

                    Delete

                    </button>


                    <button
                    class="
                    sale-btn
                    print-btn"
                    onclick="
                    printSale(
                    '${sale.id}'
                    )">

                    Print

                    </button>


                    <button
                    class="
                    sale-btn
                    pdf-btn"
                    onclick="
                    exportSalePDF(
                    '${sale.id}'
                    )">

                    PDF

                    </button>


                    <button
                    class="
                    sale-btn
                    excel-btn"
                    onclick="
                    exportSaleExcel(
                    '${sale.id}'
                    )">

                    Excel

                    </button>

                </div>

            </div>

            `;

            container.appendChild(
                card
            );

        }

    );

}