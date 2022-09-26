const expand = 20;
const time = 1500; //ms
let minWidthHeight;

//set background when user select image
const backgroundInput = document.getElementById("background-input");
backgroundInput.addEventListener("change", function () {
    let background = document.getElementById("background")
    let tempImage = URL.createObjectURL(backgroundInput.files[0]);
    
    Object.assign(background.style, {
        backgroundImage: "url('" + tempImage + "')",
    });
})

//increase width and height of background
const background = document.getElementById("background");

background.style.width = `${background.clientWidth + 2 * expand}px`;
background.style.height = `${background.clientHeight + 2 * expand}px`;


//shaking effect
function shake() {
    background.style.transition = `all ${(time / 1000).toFixed(1)}s ease-in-out`;
    background.style.transform = `translate(${(Math.random() - 1.5) * expand}px, ${(Math.random() - 1.5) * expand }px)`;
}

function stopShake() {
    background.style.transform = ``;
}

setInterval(() => {
    shake();
}, time);