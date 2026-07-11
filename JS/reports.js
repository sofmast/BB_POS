// ========================================
// LOAD DATA
// ========================================

const sales =
    JSON.parse(
        localStorage.getItem(
            "pos_sales"
        )
    ) || [];

const products =
    JSON.parse(
        localStorage.getItem(
            "pos_products"
        )
    ) || [];

/* =========================
   DAILY SALES CHART
========================= */

function renderDailySalesChart() {

    const dailyTotals = {};

    sales.forEach(sale => {

        const date =

            new Date(
                sale.date
            )

            .toLocaleDateString();

        if (!dailyTotals[date]) {

            dailyTotals[date] = 0;

        }

        dailyTotals[date] += sale.total;

    });

    new Chart(

        document.getElementById(
            "dailySalesChart"
        ),

        {

            type:"line",

            data:{

                labels:
                    Object.keys(
                        dailyTotals
                    ),

                datasets:[{

                    label:
                        "Daily Sales",

                    data:
                        Object.values(
                            dailyTotals
                        ),

                    tension:0.4,

                    fill:true

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* =========================
   MONTHLY SALES CHART
========================= */

function renderMonthlySalesChart() {

    const monthlyTotals = {};

    sales.forEach(sale => {

        const d =
            new Date(
                sale.date
            );

        const month =

            d.getFullYear()

            +

            "-"

            +

            String(
                d.getMonth()+1
            )

            .padStart(
                2,
                "0"
            );

        if (!monthlyTotals[month]) {

            monthlyTotals[month] = 0;

        }

        monthlyTotals[month] += sale.total;

    });

    new Chart(

        document.getElementById(
            "monthlySalesChart"
        ),

        {

            type:"bar",

            data:{

                labels:
                    Object.keys(
                        monthlyTotals
                    ),

                datasets:[{

                    label:
                        "Monthly Sales",

                    data:
                        Object.values(
                            monthlyTotals
                        )

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* =========================
   EXPORT EXCEL
========================= */
document
.getElementById(
    "exportExcelBtn"
)
.addEventListener(
    "click",
    exportExcel
);
function exportExcel() {

    const workbook =
        XLSX.utils.book_new();

    /* =========================
       SUMMARY SHEET
    ========================= */

    const totalSales =
        sales.length;

    const revenue =
        sales.reduce(
            (sum,sale) =>
                sum + Number(sale.total || 0),
            0
        );

    const totalCost =
        sales.reduce(
            (sum,sale) =>
                sum + Number(sale.costTotal || 0),
            0
        );

    const totalProfit =
        sales.reduce(
            (sum,sale) =>
                sum + Number(sale.profit || 0),
            0
        );

    const summaryData = [

        {
            METRIC:
                "Total Transactions",

            VALUE:
                totalSales
        },

        {
            METRIC:
                "Revenue",

            VALUE:
                revenue
        },

        {
            METRIC:
                "Cost",

            VALUE:
                totalCost
        },

        {
            METRIC:
                "Profit",

            VALUE:
                totalProfit
        }

    ];

    const summarySheet =
        XLSX.utils.json_to_sheet(
            summaryData
        );

    summarySheet["!cols"] = [

        { wch: 30 },

        { wch: 20 }

    ];

    XLSX.utils.book_append_sheet(

        workbook,

        summarySheet,

        "Summary"

    );

    /* =========================
       SALES SHEET
    ========================= */

    const salesRows = [];

    let rowId = 1;

    sales.forEach(sale => {

        sale.items.forEach(item => {

            const qty =
                Number(item.qty || 0);

            const cost =
                Number(item.costPrice || 0);

            const price =
                Number(item.price || 0);

            const costValue =
                qty * cost;

            const salesValue =
                qty * price;

            const profit =
                salesValue -
                costValue;

            salesRows.push({

                ID:
                    rowId++,

                SALE_ID:
                    sale.id,

                DATE:
                    new Date(
                        sale.date
                    )
                    .toLocaleString(),

                CATEGORY:
                    item.category,

                ITEM:
                    item.name,

                QTY:
                    qty,

                COST_PRICE:
                    cost,

                UNIT_PRICE:
                    price,

                COST_VALUE:
                    costValue,

                SALES_VALUE:
                    salesValue,

                PROFIT:
                    profit

            });

        });

    });

    /* TOTAL ROW */

    salesRows.push({

        ID: "",

        SALE_ID: "",

        DATE: "",

        CATEGORY: "",

        ITEM: "TOTALS",

        QTY:
            salesRows.reduce(
                (s,r) =>
                    s + Number(r.QTY || 0),
                0
            ),

        COST_PRICE: "",

        UNIT_PRICE: "",

        COST_VALUE:
            salesRows.reduce(
                (s,r) =>
                    s +
                    Number(
                        r.COST_VALUE || 0
                    ),
                0
            ),

        SALES_VALUE:
            salesRows.reduce(
                (s,r) =>
                    s +
                    Number(
                        r.SALES_VALUE || 0
                    ),
                0
            ),

        PROFIT:
            salesRows.reduce(
                (s,r) =>
                    s +
                    Number(
                        r.PROFIT || 0
                    ),
                0
            )

    });

    const salesSheet =
        XLSX.utils.json_to_sheet(
            salesRows
        );

        /* ======================
   STYLE HEADER
====================== */

const range = XLSX.utils.decode_range(
    salesSheet["!ref"]
);

for(let C = range.s.c; C <= range.e.c; C++){

    const address =
        XLSX.utils.encode_cell({
            r:0,
            c:C
        });

    if(!salesSheet[address])
        continue;

    salesSheet[address].s = {

        font:{
            bold:true,
            color:{
                rgb:"FFFFFF"
            }
        },

        fill:{
            fgColor:{
                rgb:"115a96"
            }
        },

        alignment:{
            horizontal:"center",
            vertical:"center"
        },

        border:{
            top:{
                style:"thin"
            },
            bottom:{
                style:"thin"
            },
            left:{
                style:"thin"
            },
            right:{
                style:"thin"
            }
        }

    };

}

    salesSheet["!cols"] = [

        { wch: 8 },   // ID

        { wch: 25 },  // SALE ID

        { wch: 25 },  // DATE

        { wch: 20 },  // CATEGORY

        { wch: 35 },  // ITEM

        { wch: 10 },  // QTY

        { wch: 15 },  // COST

        { wch: 15 },  // PRICE

        { wch: 15 },  // COST VALUE

        { wch: 15 },  // SALES VALUE

        { wch: 15 }   // PROFIT

    ];

    /* ======================
   ROW HEIGHTS
====================== */

salesSheet["!rows"] = [];

/* Header row */

salesSheet["!rows"][0] = {

    hpx: 32

};
//====================================
// ADD AUTO FILTERS
// ===================================
    salesSheet["!autofilter"] = {
ref: salesSheet["!ref"]
};

// ======================================
// FREEZEHEADER      
//======================================= 

salesSheet["!freeze"] = {
xSplit:0,
ySplit:1
};

    XLSX.utils.book_append_sheet(

        workbook,

        salesSheet,

        "Sales"

    );

    /* =========================
       INVENTORY SHEET
    ========================= */

    const inventoryRows =

        products.map(product => ({

            PRODUCT:
                product.name,

            CATEGORY:
                product.category,

            STOCK:
                Number(
                    product.stock || 0
                ),

            COST_PRICE:
                Number(
                    product.costPrice || 0
                ),

            SELLING_PRICE:
                Number(
                    product.price || 0
                ),

            STOCK_VALUE:

                Number(
                    product.stock || 0
                ) *

                Number(
                    product.costPrice || 0
                )

        }));

    const inventorySheet =
        XLSX.utils.json_to_sheet(
            inventoryRows
        );

    inventorySheet["!cols"] = [

        { wch: 35 },

        { wch: 20 },

        { wch: 10 },

        { wch: 15 },

        { wch: 15 },

        { wch: 15 }

    ];

    XLSX.utils.book_append_sheet(

        workbook,

        inventorySheet,

        "Inventory"

    );

    /* =========================
       TOP PRODUCTS
    ========================= */

    const topProducts = {};

    sales.forEach(sale => {

        sale.items.forEach(item => {

            if (
                !topProducts[
                    item.name
                ]
            ) {

                topProducts[
                    item.name
                ] = {

                    product:
                        item.name,

                    qty: 0,

                    revenue: 0,

                    profit: 0

                };

            }

            topProducts[
                item.name
            ].qty += item.qty;

            topProducts[
                item.name
            ].revenue +=

                item.qty *
                item.price;

            topProducts[
                item.name
            ].profit +=

                item.qty *

                (
                    item.price -
                    item.costPrice
                );

        });

    });

    const topSheet =
        XLSX.utils.json_to_sheet(

            Object.values(
                topProducts
            )

        );

    XLSX.utils.book_append_sheet(

        workbook,

        topSheet,

        "Top Products"

    );

    /* =========================
       DOWNLOAD
    ========================= */

    XLSX.writeFile(

        workbook,

        `POS_REPORT_${
            new Date()
            .toISOString()
            .split("T")[0]
        }.xlsx`

    );

}
/* =========================
   EXPORT PDF
========================= */
function exportPDF() {

    const {
        jsPDF
    } = window.jspdf;

    const doc =
        new jsPDF();

    const sales =
        JSON.parse(
            localStorage.getItem(
                "pos_sales"
            )
        ) || [];

    const settings =
        JSON.parse(
            localStorage.getItem(
                "pos_settings"
            )
        ) || {};

    let y = 20;

    /* =========================
       HEADER
    ========================= */

    doc.setFontSize(20);

    doc.setFont(
        undefined,
        "bold"
    );

    doc.text(

        settings.businessName ||

        "BUSINESS SALES REPORT",

        15,

        y

    );

    y += 8;

    doc.setFontSize(10);

    doc.setFont(
        undefined,
        "normal"
    );

    doc.text(

        settings.businessPhone ||

        "",

        15,

        y

    );

    y += 5;

    doc.text(

        settings.businessAddress ||

        "",

        15,

        y

    );

    y += 5;

    doc.text(

        `Generated: ${new Date().toLocaleString()}`,

        15,

        y

    );

    y += 8;

    doc.line(
        15,
        y,
        195,
        y
    );

    y += 10;

    /* =========================
       SUMMARY
    ========================= */

    const totalRevenue =

        sales.reduce(

            (sum,sale) =>

                sum + sale.total,

            0

        );

    doc.setFontSize(12);

    doc.setFont(
        undefined,
        "bold"
    );

    doc.text(

        "REPORT SUMMARY",

        15,

        y

    );

    y += 8;

    doc.setFont(
        undefined,
        "normal"
    );

    doc.text(

        `Transactions: ${sales.length}`,

        15,

        y

    );

    y += 6;

    doc.text(

        `Revenue: K${totalRevenue.toFixed(2)}`,

        15,

        y

    );

    y += 10;

    doc.line(
        15,
        y,
        195,
        y
    );

    y += 10;

    /* =========================
       SALES DETAILS
    ========================= */

    sales.forEach(

        sale => {

            if (y > 240) {

                doc.addPage();

                y = 20;

            }

            doc.setFontSize(12);

            doc.setFont(
                undefined,
                "bold"
            );

            doc.text(

                `Receipt: ${sale.id}`,

                15,

                y

            );

            y += 6;

            doc.setFont(
                undefined,
                "normal"
            );

            doc.text(

                `Date: ${sale.date}`,

                15,

                y

            );

            y += 10;

            /* TABLE HEADER */

            doc.setFont(
                undefined,
                "bold"
            );

            doc.text(
                "Product",
                20,
                y
            );

            doc.text(
                "Qty",
                120,
                y
            );

            doc.text(
                "Amount",
                180,
                y,
                {
                    align:
                    "right"
                }
            );

            y += 4;

            doc.line(
                20,
                y,
                180,
                y
            );

            y += 6;

            doc.setFont(
                undefined,
                "normal"
            );

            sale.items.forEach(

                item => {

                    if (y > 260) {

                        doc.addPage();

                        y = 20;

                    }

                    doc.text(

                        item.name,

                        20,

                        y

                    );

                    doc.text(

                        `${item.qty} x K${item.price}`,

                        120,

                        y

                    );

                    doc.text(

                        `K${(

                            item.qty *

                            item.price

                        ).toFixed(2)}`,

                        180,

                        y,

                        {
                            align:
                            "right"
                        }

                    );

                    y += 6;

                }

            );

            y += 2;

            doc.line(
                20,
                y,
                180,
                y
            );

            y += 7;

            doc.setFont(
                undefined,
                "bold"
            );

            doc.text(

                `Sale Total: K${sale.total.toFixed(2)}`,

                20,

                y

            );

            y += 8;

            doc.setFont(
                undefined,
                "normal"
            );

            doc.line(
                15,
                y,
                195,
                y
            );

            y += 10;

        }

    );

    /* =========================
       GRAND TOTAL
    ========================= */

    if (y > 240) {

        doc.addPage();

        y = 20;

    }

    doc.setFontSize(14);

    doc.setFont(
        undefined,
        "bold"
    );

    doc.text(

        `GRAND TOTAL REVENUE: K${totalRevenue.toFixed(2)}`,

        15,

        y

    );

    y += 10;

    /* =========================
       FOOTER
    ========================= */

    doc.setFontSize(10);

    doc.setFont(
        undefined,
        "normal"
    );

    doc.text(

        "Generated by Babbage POS System",

        15,

        285

    );

    /* =========================
       SAVE
    ========================= */

    doc.save(

        `Sales_Report_${
            new Date()
            .toISOString()
            .split("T")[0]
        }.pdf`

    );

}

document
.getElementById(
    "exportPdfBtn"
)
.addEventListener(
    "click",
    exportPDF
);

/* =========================
   INIT
========================= */

renderDailySalesChart();

renderMonthlySalesChart();