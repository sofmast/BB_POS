
// ======================================
// MODAL SOUNDS
// ======================================

const modalSounds = {
    success: new Audio("sounds/success.mp3"),
    error: new Audio("sounds/error.mp3"),
    warning: new Audio("sounds/warning.mp3"),
    info: new Audio("sounds/info.mp3"),
    nop: new Audio("sounds/nop.mp3")
};

function playModalSound(type, playDuration = 2000){

    if(modalSounds[type]){

        const sound = modalSounds[type];

        // restart if already playing
        sound.pause();
        sound.currentTime = 0;

        // clear previous stop timer
        if(sound.stopTimer){
            clearTimeout(sound.stopTimer);
        }

        sound.play()
        .catch(err => {

            console.log(
                "Sound blocked:",
                err
            );

        });

        // stop after specified duration
        sound.stopTimer = setTimeout(()=>{

            sound.pause();

            sound.currentTime = 0;

        }, playDuration);

    }

}

//=======================================================
// CUSTOM MODAL ELEMENTS
//=======================================================


const modal = document.getElementById("customModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalIcon = document.getElementById("modalIcon");
//const closeModal = document.getElementById("closeModal");

//======================================================
//          SHOW MODAL FUNCTION
//======================================================
function showModal(title, message, type = "success") {

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalIcon.className = "modal-icon";

    switch(type){

        case "success":
            modalIcon.classList.add("success");
            modalIcon.innerHTML = '<i class="fas fa-check"></i>';
            break;

        case "error":
            modalIcon.classList.add("error");
            modalIcon.innerHTML = '<i class="fas fa-times"></i>';
            break;

        case "warning":
            modalIcon.classList.add("warning");
            modalIcon.innerHTML = '<i class="fas fa-exclamation"></i>';
            break;

        case "info":
            modalIcon.classList.add("info");
            modalIcon.innerHTML = '<i class="fas fa-info"></i>';
            break;

        case "nop":
            modalIcon.classList.add("nop");
            modalIcon.innerHTML = '<i class="fas fa-lock"></i>';
            break;
    }

    // play matching sound
    playModalSound(type);

    modal.classList.add("show");
}

function hideModal(){
    modal.classList.remove("show");
}

closeGlobalModal.addEventListener("click", hideModal);

modal.addEventListener("click", function(e){
    if(e.target === modal){
        hideModal();
    }
});

        /*const ineligibleMessage =
        showModal(`Sorry ${thisUser.firstName}`,'Something Went Wrong','nop' );*/