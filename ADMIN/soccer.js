function watchMan(){
    const activeUser = JSON.parse(localStorage.getItem("currentUser")) ?? [];

            if(!activeUser){
                
                
             return(window.location="login.html");
            }

    if(activeUser.access!=="Administrator"||!activeUser){
           showModal(`Sorry ${activeUser.firstName}`,'Login As Admin','info');
                  setTimeout(()=>{
                    localStorage.removeItem('currentUser');
                window.location="login.html";  
        },2000);
    }
}

function linso(){
    setInterval(watchMan,500);
}
linso();