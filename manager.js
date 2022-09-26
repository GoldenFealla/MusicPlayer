//
const WIDTH = 800;
const HEIGHT = 600;

const HALFWIDTH = WIDTH / 2;
const HALFHEIGHT = HEIGHT / 2;

//canvas
const canvas = document.getElementById("audio-reaction");
const wave = document.getElementById("wave");

canvas.width = WIDTH / 2;
canvas.height = HEIGHT / 2;
canvas.halfWidth = canvas.width / 2;
canvas.halfHeight = canvas.height / 2;

wave.style.width = `${canvas.width}px`;
wave.style.height = `${canvas.height / 2}px`;

const ctx = canvas.getContext("2d");
ctx.translate(canvas.halfWidth, canvas.halfHeight);

const foreground = document.getElementById("foreground");

//start
function start() {
    startAudio();
    foreground.classList.remove("hidden");
    foreground.classList.add("active");
}





