/*==================================
SYSTEM ENGINE
==================================*/

function getSystem(){

return JSON.parse(

localStorage.getItem(
"pos_system"
)

) || null;

}


function saveSystem(data){

localStorage.setItem(

"pos_system",

JSON.stringify(data)

);

}


/*==================================
CHECK FIRST USE
==================================*/

function initializeSystem(){

const sales =

JSON.parse(
localStorage.getItem(
"pos_sales"
)
) || [];


const purchases =

JSON.parse(
localStorage.getItem(
"pos_purchases"
)
) || [];


const staff =

JSON.parse(
localStorage.getItem(
"staff"
)
) || [];


const products =

JSON.parse(
localStorage.getItem(
"pos_products"
)
) || [];


/* system already exists */

let system =
getSystem();


/* check if app is fresh */

const firstUse =

sales.length === 0
&&
purchases.length === 0
&&
staff.length === 0
&&
products.length === 0;


/* create system */

if(!system){

const now =
createDateObject();

system={

appId:

"BABBAGE-"

+

Date.now(),

firstUseDate:

firstUse

?

now

:

now,

lastUseDate:

now,

masterResetId:

"RESET-"

+

Date.now(),

version:

"1.0.0"

};

saveSystem(
system
);

}


/* update last use */

else{

system.lastUseDate =

createDateObject();

saveSystem(
system
);

}

return system;

}