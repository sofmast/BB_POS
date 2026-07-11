
const intervals  = createDateObject();

const sysAdmin={
    firstLoad:20260706,
    myDate:intervals.dateId,

};

function storeInfo(){
   
}
function showMyIdentity(){
showModal(`Created`,`${sysAdmin.myDate-sysAdmin.firstLoad} Day(s) Ago`,'info');
return;
}
showMyIdentity();