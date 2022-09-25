const expand = 20;
const time = 1500; //ms
let minWidthHeight;

let background = document.getElementById("background");
let scale = (minWidthHeight + expand) / minWidthHeight;

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