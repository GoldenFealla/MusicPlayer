//
const WIDTH = 800;
const HEIGHT = 600;

const HALFWIDTH = WIDTH / 2;
const HALFHEIGHT = HEIGHT / 2;

//canvas
const canvas = document.getElementById("audio-reaction");
canvas.width = WIDTH / 2;
canvas.height = HEIGHT / 2;
canvas.halfWidth = canvas.width / 2;
canvas.halfHeight = canvas.height / 2;
const ctx = canvas.getContext("2d");
ctx.translate(canvas.halfWidth, canvas.halfHeight);

function start() {
    startAudio();
    startTime();
    startTrack();
}

const backgroundInput = document.getElementById("background-input");
backgroundInput.addEventListener("change", function () {
    let background = document.getElementById("background")
    let tempImage = URL.createObjectURL(backgroundInput.files[0]);

    background.style.width = `${background.clientWidth + 2 * expand}` + "px";
    background.style.height = `${background.clientHeight + 2 * expand}` + "px";
    
    Object.assign(background.style, {
        backgroundImage: "url('" + tempImage + "')",
    });
})

const canvasPosition = document.getElementById("canvas-position");
canvasPosition.style.width = `${canvas.width}px`;
canvasPosition.style.height = `${canvas.height / 2}px`;




