/*=========================================
    BABBAGE POS
    TRANSACTION ENGINE
=========================================*/

const TransactionEngine = {


/*=====================================
    COMPLETE PURCHASE
=====================================*/

completePurchase(

    purchase

){

    if(

        !purchase ||

        !purchase.items ||

        purchase.items.length===0

    ){

        throw new Error(

            "Purchase contains no items."

        );

    }

    /*=================================
        CREATE FIFO ROOMS
    =================================*/

    InventoryEngine.purchase(

        purchase

    );

    /*=================================
        SAVE PURCHASE
    =================================*/

    savePurchase(

        purchase

    );

    /*=================================
        REFRESH PRODUCTS
    =================================*/

    purchase.items.forEach(

        item=>{

            InventoryEngine.refreshProduct(

                item.id

            );

        }

    );

    return{

        success:true,

        purchase

    };

},



    /*=====================================
        COMPLETE SALE
    =====================================*/

    completeSale(

        sale

    ){

        const inventory = [];

        let totalCost = 0;

        let totalProfit = 0;

        sale.items.forEach(

            item=>{

                const result =

                InventoryEngine.sell(

                    item.id,

                    item.qty

                );

                inventory.push(

                    result

                );

                totalCost +=

                    result.totalCost;

                totalProfit +=

                    result.profit;

            }

        );

        sale.inventory = inventory;

        sale.costTotal = totalCost;

        sale.profit = totalProfit;

        saveSale(

            sale

        );

        return sale;

    },



    /*=====================================
        DELETE ENTIRE SALE
    =====================================*/

    deleteSale(

        saleId

    ){

        let sales =

        getSales();

        const sale =

        sales.find(

            s=>

            s.id===saleId

        );

        if(

            !sale

        ){

            return false;

        }

        InventoryEngine.restoreSale(

            sale

        );

        sales = sales.filter(

            s=>

            s.id!==saleId

        );

        saveSales(

            sales

        );

        return true;

    }

};