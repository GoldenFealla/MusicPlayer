import { AudioController } from "./core";
import { DisplayAudio } from "./canvas";
const { BASE_URL } = import.meta.env;

const play_svg = `${BASE_URL}images/play.svg`;
const pause_svg = `${BASE_URL}images/pause.svg`;

//Window thingy
const root = (document.querySelector(':root') as HTMLElement).style;
const ratio = 0.8;

let width: number;
let height: number;

window.onload = () => {
    showDisplay();
    initialize();
};

window.onresize = showDisplay;

function showDisplay() {
    width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) * ratio;
    height = width * 0.5625;

    displayAudio.width = width;
    displayAudio.height = height;

    root.setProperty('--res-width', width + 'px');
    root.setProperty('--res-height', height + 'px');
}

window.addEventListener('resize', () => {
    if (window.innerWidth < width) {
        root.setProperty('--res-width', window.innerWidth + 'px');
        root.setProperty('--res-height', window.innerWidth / width + 'px');
    }
    else {
        root.setProperty('--res-width', width + 'px');
        root.setProperty('--res-height', height + 'px');
    }
});


// import "./canvas.ts"
const audioController = new AudioController(new Audio());

audioController.audioReaction.config = {
    minDecibels: -75,
    maxDecibels: -10,
    fftSize: 2 ** 13,
}

const audio = audioController.audio;

const displayAudio: DisplayAudio = new DisplayAudio(audioController.audioReaction.audioCore.analyser, width, height);
//background
const background = document.getElementById('background')

//Handle Import File
const au = document.getElementById('au') as HTMLInputElement;
const bg = document.getElementById('bg') as HTMLInputElement;

//mode
const mode = document.getElementById('mode') as HTMLSelectElement;

mode.addEventListener('change', () => {
    console.log(mode.value)
    displayAudio.mode = mode.value === "1" ? false : true;
})


au.addEventListener('change', () => {
    let tempURL = URL.createObjectURL(au.files[0]);
    audio.src = tempURL;
});

bg.addEventListener('change', () => {
    let tempFileURL = URL.createObjectURL(bg.files[0]);
    background.style.backgroundImage = `url('${tempFileURL}')`;
    background.style.backgroundSize = "cover";
});


//audio controller
const play = document.getElementById('play') as HTMLInputElement;
const volume = document.getElementById('volume') as HTMLInputElement;
const slide = document.getElementById('slide') as HTMLInputElement;

audio.addEventListener('play', () => {
    play.src = pause_svg;
    slideChange();
});

audio.addEventListener('pause', () => {
    play.src = play_svg;
});

audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.pause();
    play.src = play_svg;
});

audio.addEventListener('loadedmetadata', () => {
    audio.volume = 0.5;
    audio.currentTime = 0;

    play.src = play_svg;

    slide.value = "0";
    slide.max = audio.duration.toFixed(0);
});

play.addEventListener('click', () => {
    if (!audio.src) return;

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

volume.addEventListener('input', (e) => {
    let value = (e.target as HTMLTextAreaElement).value;
    audio.volume = Number(value) / 100;
});

function slideChange() {
    slide.value = (Math.round(audio.currentTime * 100) / 100).toFixed(0);
    if (audio.paused) return;
    requestAnimationFrame(slideChange);
}

slide.addEventListener('input', (e) => {
    let value = (e.target as HTMLTextAreaElement).value;
    audio.currentTime = Number(value);

    if (audio.src === "") return;

    if (audio.paused) {
        audio.play();
    }
});


//canvas
function initialize() {
    const canvas = document.getElementById('audio-reaction') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    displayAudio.canvas = canvas;
    displayAudio.ctx = ctx;

    displayAudio.width = width;
    displayAudio.height = height;
    displayAudio.mode = true;

    displayAudio.animate(audioController.audioReaction);
}

