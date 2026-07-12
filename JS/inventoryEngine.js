"use strict";

/*==================================================
    BABBAGE POS INVENTORY ENGINE
    Version: 2.0
==================================================*/

const INVENTORY_ROOMS_KEY = "pos_inventory_rooms";

/*==================================================
    ROOM STORAGE
==================================================*/

function getInventoryRooms(){

    return JSON.parse(

        localStorage.getItem(

            INVENTORY_ROOMS_KEY

        ) || "[]"

    );

}

function saveInventoryRooms(

    rooms

){

    localStorage.setItem(

        INVENTORY_ROOMS_KEY,

        JSON.stringify(rooms)

    );

}

/*==================================================
    ROOM HELPERS
==================================================*/

function getRoom(

    roomId

){

    return getInventoryRooms()

    .find(

        room=>

        room.roomId===roomId

    );

}

function updateRoom(

    updatedRoom

){

    const rooms=

    getInventoryRooms();

    const index=

    rooms.findIndex(

        room=>

        room.roomId===updatedRoom.roomId

    );

    if(index===-1){

        return false;

    }

    rooms[index]=updatedRoom;

    saveInventoryRooms(

        rooms

    );

    return true;

}

function deleteRoom(

    roomId

){

    const rooms=

    getInventoryRooms()

    .filter(

        room=>

        room.roomId!==roomId

    );

    saveInventoryRooms(

        rooms

    );

}

/*==================================================
    ID GENERATORS
==================================================*/

function generateRoomId(){

    return(

        "ROOM-"

        +

        Date.now()

        +

        "-"

        +

        Math.floor(

            Math.random()*1000

        )

    );

}

function generateMovementId(){

    return(

        "MOV-"

        +

        Date.now()

        +

        "-"

        +

        Math.floor(

            Math.random()*1000

        )

    );

}

/*==================================================
    MOVEMENT OBJECT
==================================================*/

function createMovement({

    type,

    quantity,

    balance,

    costPrice,

    sellingPrice,

    reference

}){

    return{

        id:

            generateMovementId(),

        date:

            createDateObject(),

        type,

        quantity,

        balance,

        costPrice,

        sellingPrice,

        reference

    };

}

/*==================================================
    INVENTORY ENGINE
==================================================*/

const InventoryEngine={

/*=========================================
    CREATE INVENTORY ROOM
=========================================*/

createRoom(

    purchase,

    item

){

    return{

        roomId:

            generateRoomId(),

        purchaseId:

            purchase.id,

        productId:

            item.id,

        productName:

            item.name,

        supplier:

            purchase.supplier,

        purchaseDate:

            purchase.date,

        purchasedQty:

            Number(item.qty),

        availableQty:

            Number(item.qty),

        costPrice:

            Number(item.costPrice),

        sellingPrice:

            Number(item.price),

        status:"OPEN",

        history:[

            createMovement({

                type:"PURCHASE",

                quantity:

                    Number(item.qty),

                balance:

                    Number(item.qty),

                costPrice:

                    Number(item.costPrice),

                sellingPrice:

                    Number(item.price),

                reference:

                    purchase.id

            })

        ]

    };

},

/*=========================================
    PURCHASE
=========================================*/

purchase(

    purchase

){

    const rooms=

    getInventoryRooms();

    purchase.items.forEach(

        item=>{

            rooms.push(

                this.createRoom(

                    purchase,

                    item

                )

            );

        }

    );

    saveInventoryRooms(

        rooms

    );

    purchase.items.forEach(

        item=>{

            this.refreshProduct(

                item.id

            );

        }

    );

},

/*=========================================
    PRODUCT ROOMS
=========================================*/

getProductRooms(

    productId

){

    return getInventoryRooms()

    .filter(

        room=>

        String(room.productId)===

        String(productId)

    )

    .sort(

        (a,b)=>

        new Date(a.purchaseDate)

        -

        new Date(b.purchaseDate)

    );

},

/*=========================================
    AVAILABLE ROOMS (FIFO)
=========================================*/

getAvailableRooms(

    productId

){

    return this

    .getProductRooms(

        productId

    )

    .filter(

        room=>

        room.availableQty>0

    );

},

/*=========================================
    PRODUCT STOCK REFRESH
=========================================*/

refreshProduct(

    productId

){

    const products=

    getProducts();

    const product=

    products.find(

        p=>

        String(p.id)===

        String(productId)

    );

    if(!product){

        return;

    }

    const rooms=

    this.getProductRooms(

        productId

    );

    product.stock=

    rooms.reduce(

        (sum,room)=>

        sum+

        Number(

            room.availableQty

        ),

        0

    );

    if(rooms.length){

        const latest=

        rooms.reduce(

            (latest,current)=>{

                return new Date(

                    current.purchaseDate

                )>

                new Date(

                    latest.purchaseDate

                )

                ?

                current

                :

                latest;

            }

        );

        product.costPrice=

        latest.costPrice;

        product.price=

        latest.sellingPrice;

    }

    saveProducts(

        products

    );

},

/*=========================================
    FIFO SELL ENGINE
=========================================*/

sell(

    productId,

    quantity,

    saleId = null

){

    quantity = Number(quantity);

    const rooms = this.getAvailableRooms(productId);

    if(rooms.length===0){

        return{

            success:false,

            message:"No stock available."

        };

    }

    let remaining = quantity;

    let totalCost = 0;

    let totalSelling = 0;

    let totalProfit = 0;

    const allocations = [];

    for(const room of rooms){

        if(remaining<=0){

            break;

        }

        const take = Math.min(

            remaining,

            room.availableQty

        );

        room.availableQty -= take;

        remaining -= take;

        if(room.availableQty===0){

            room.status="CLOSED";

        }

        room.history.push(

            createMovement({

                type:"SALE",

                quantity:-take,

                balance:room.availableQty,

                costPrice:room.costPrice,

                sellingPrice:room.sellingPrice,

                reference:saleId

            })

        );

        updateRoom(room);

        const cost =

            take * room.costPrice;

        const selling =

            take * room.sellingPrice;

        const profit =

            selling - cost;

        totalCost += cost;

        totalSelling += selling;

        totalProfit += profit;

        allocations.push({

            roomId:room.roomId,

            purchaseId:room.purchaseId,

            qty:take,

            costPrice:room.costPrice,

            sellingPrice:room.sellingPrice,

            totalCost:cost,

            totalSelling:selling,

            profit:profit

        });

    }

    if(remaining>0){

        return{

            success:false,

            message:`Only ${quantity-remaining} in stock.`

        };

    }

    this.refreshProduct(productId);

    return{

        success:true,

        allocations,

        totalCost,

        totalSelling,

        totalProfit

    };

},

/*=========================================
    RESTORE SALE (FIFO REVERSE)
=========================================*/

restoreSale(

    sale

){

    if(

        !sale ||

        !sale.inventory

    ){

        return false;

    }

    sale.inventory.forEach(

        product=>{

            product.allocations.forEach(

                allocation=>{

                    const room =

                    getRoom(

                        allocation.roomId

                    );

                    if(!room){

                        return;

                    }

                    room.availableQty +=

                    allocation.qty;

                    room.status =

                    "OPEN";

                    room.history.push(

                        createMovement({

                            type:"SALE_REVERSED",

                            quantity:

                                allocation.qty,

                            balance:

                                room.availableQty,

                            costPrice:

                                room.costPrice,

                            sellingPrice:

                                room.sellingPrice,

                            reference:

                                sale.id

                        })

                    );

                    updateRoom(

                        room

                    );

                    this.refreshProduct(

                        room.productId

                    );

                }

            );

        }

    );

    return true;

},

getTransactions(){

    const rooms =
        getInventoryRooms();

    const transactions = [];

    rooms.forEach(room=>{

        room.history.forEach(history=>{

            transactions.push({

                roomId:
                    room.roomId,

                purchaseId:
                    room.purchaseId,

                productId:
                    room.productId,

                productName:
                    room.productName,

                supplier:
                    room.supplier,

                movementId:
                    history.id,

                date:
                    history.date,

                type:
                    history.type,

                quantity:
                    history.quantity,

                balance:
                    history.balance,

                costPrice:
                    history.costPrice,

                sellingPrice:
                    history.sellingPrice,

                reference:
                    history.reference

            });

        });

    });

    return transactions.sort(

        (a,b)=>

        new Date(b.date.iso) -

        new Date(a.date.iso)

    );

}


};