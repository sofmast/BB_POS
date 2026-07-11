//MAINPART//

/*========================================
SALES DATA
========================================*/

function getSales() {
    return JSON.parse(
        localStorage.getItem("pos_sales")
    ) || [];
}

const salesTableBody =
    document.getElementById("salesTableBody");
    const salesContainer=document.getElementById("salesTableBody");

/*========================================
FLATTEN SALES (CORE ENGINE)
========================================*/

function flattenSales(sales) {

    salesContainer.innerHTML = "";

    const table =
        document.createElement(
            "table"
        );

    table.className =
        "sales-table";

    let tableHTML = `

        <thead>

            <tr>

                <th>Receipt</th>

                <th>Date</th>

                <th>Item</th>

                <th>Qty</th>

                <th>Price</th>

                <th>Cost</th>

                <th>Total</th>

                <th>Profit</th>

            </tr>

        </thead>

        <tbody>

    `;

    data.forEach(sale => {

        sale.items.forEach(item => {

            const total =
                item.qty *
                item.price;

            const profit =
                (
                    item.price -
                    item.costPrice
                ) *
                item.qty;

            tableHTML += `

                <tr>

                    <td>
                        ${sale.id}
                    </td>

                    <td>
                        ${formatDate(sale)}
                    </td>

                    <td>
                        ${item.name}
                    </td>

                    <td>
                        ${item.qty}
                    </td>

                    <td>
                        ${formatCurrency(item.price)}
                    </td>

                    <td>
                        ${formatCurrency(item.costPrice)}
                    </td>

                    <td>
                        ${formatCurrency(total)}
                    </td>

                    <td>
                        ${formatCurrency(profit)}
                    </td>

                </tr>

            `;

        });

    });

    tableHTML += `

        </tbody>

    `;

    table.innerHTML =
        tableHTML;

    salesContainer.appendChild(
        table
    );

}

/*========================================
RENDER FUNCTION
========================================*/

function renderSales(search = "") {

    const sales = getSales();

    const rows = flattenSales(sales);

    const keyword = search.toLowerCase().trim();

    const filtered = rows.filter(row => {

        return (
            row.saleId.toLowerCase().includes(keyword) ||
            row.product.toLowerCase().includes(keyword) ||
            row.customer.toLowerCase().includes(keyword)
        );

    });

    salesTableBody.innerHTML = "";

    if (filtered.length === 0) {

        salesTableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:40px;">
                    No sales found
                </td>
            </tr>
        `;

        return;
    }

    const html = filtered.map(row => `
        <tr>

            <td>${row.saleId}</td>
            <td>${row.date}</td>
            <td>${row.product}</td>
            <td>${row.qty}</td>
            <td>${row.cost}</td>

            <td>K${row.unitPrice.toFixed(2)}</td>
            <td style="color:${row.profit >= 0 ? 'green' : 'red'}">
                K${row.profit.toFixed(2)}
            </td>

            <td>
                <button class="action-btn view-sale" data-id="${row.saleId}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>

        </tr>
    `).join("");

    salesTableBody.innerHTML = html;

    bindEvents();
}

/*========================================
EVENT BINDING (SAFE RE-BIND PATTERN)
========================================*/

function bindEvents() {

    document.querySelectorAll(".view-sale")
        .forEach(btn => {

            btn.onclick = () => {
                openSale(btn.dataset.id);
            };

        });

}

/*========================================
SEARCH
========================================*/

document.getElementById("salesSearch")
    .addEventListener("input", (e) => {
        renderSales(e.target.value);
    });

/*========================================
INIT
========================================*/

renderSales();
function renderSalesTable(data = sales) {

    salesContainer.innerHTML = "";

    const table =
        document.createElement(
            "table"
        );

    table.className =
        "sales-table";

    let tableHTML = `

        <thead>

            <tr>

                <th>Receipt</th>

                <th>Date</th>

                <th>Item</th>

                <th>Qty</th>

                <th>Price</th>

                <th>Cost</th>

                <th>Total</th>

                <th>Profit</th>

            </tr>

        </thead>

        <tbody>

    `;

    data.forEach(sale => {

        sale.items.forEach(item => {

            const total =
                item.qty *
                item.price;

            const profit =
                (
                    item.price -
                    item.costPrice
                ) *
                item.qty;

            tableHTML += `

                <tr>

                    <td>
                        ${sale.id}
                    </td>

                    <td>
                        ${formatDate(sale)}
                    </td>

                    <td>
                        ${item.name}
                    </td>

                    <td>
                        ${item.qty}
                    </td>

                    <td>
                        ${formatCurrency(item.price)}
                    </td>

                    <td>
                        ${formatCurrency(item.costPrice)}
                    </td>

                    <td>
                        ${formatCurrency(total)}
                    </td>

                    <td>
                        ${formatCurrency(profit)}
                    </td>

                </tr>

            `;

        });

    });

    tableHTML += `

        </tbody>

    `;

    table.innerHTML =
        tableHTML;

    salesContainer.appendChild(
        table
    );

}


//TABLE RENDERING LISTNERS//

document
.getElementById(
    "tableViewLink"
)
.addEventListener(
    "click",
    () => {

        renderSalesTable();

    }
);



const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
document.getElementById("menuToggle").onclick = () => {
    sidebar.classList.add("active");
    overlay.style.display = "block";
};

document.getElementById("closeSidebar").onclick = closeSidebar;
overlay.onclick = closeSidebar;

function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.style.display = "none";
}

/* =========================
SUMMARY ENGINE
========================= */

function getSales() {
    return JSON.parse(localStorage.getItem("pos_sales")) || [];
}

function updateSummary() {

    const sales = getSales();

    let totalSales = 0;
    let revenue = 0;
    let profit = 0;

    sales.forEach(s => {

        (s.items || []).forEach(i => {

            const qty = Number(i.qty || 0);
            const price = Number(i.price || 0);
            const cost = Number(i.costPrice || 0);

            totalSales += qty;
            revenue += qty * price;
            profit += (price - cost) * qty;

        });

    });

    document.getElementById("totalSales").innerText = totalSales;
    document.getElementById("totalRevenue").innerText = "K" + revenue.toFixed(2);
    document.getElementById("totalProfit").innerText = "K" + profit.toFixed(2);
}

/* =========================
EXPORT HOOKS (STUBS)
========================= */

function printSales() {
    window.print();
}

function exportPDF() {
    alert("PDF export will be integrated (jsPDF ready)");
}

function exportExcel() {
    alert("Excel export will be integrated (SheetJS ready)");
}

updateSummary();