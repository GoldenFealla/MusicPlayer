const display = document.getElementById('display');
const play_svg = "./images/play.svg";
const pause_svg = "./images/pause.svg";

let resizeRatio = 1;
//window resize
const root = document.querySelector(':root').style;

const ratio = 0.8;

let width;
let height;

window.onload = showDisplay;
window.onresize = showDisplay;

function showDisplay() {
    width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) * ratio;
    height = width * 0.5625;

    root.setProperty('--res-width', width + 'px');
    root.setProperty('--res-height', height + 'px');
}

window.addEventListener('resize', () => {
    if (window.innerWidth < width) {
        root.setProperty('--res-width', window.innerWidth  + 'px');
        root.setProperty('--res-height', window.innerWidth / width + 'px');
    }
    else {
        root.setProperty('--res-width', width + 'px');
        root.setProperty('--res-height', height + 'px');
    }
    recalculateBarWidth();
});

//Handle Import File
const au = document.getElementById('au');
const bg = document.getElementById('bg');

au.addEventListener('change', () => {
    let tempFileURL = URL.createObjectURL(au.files[0]);

    //change audio src
    audio.src = tempFileURL;
});

bg.addEventListener('change', () => {
    let tempFileURL = URL.createObjectURL(bg.files[0]);

    //change background after load
    background.style.backgroundImage = `url('${tempFileURL}')`;
    background.style.backgroundSize = "cover";
});
//background
const background = document.getElementById('background')

//audio
const audio = new Audio();

audio.addEventListener('play', () => {
    playButton.src = pause_svg;
    slideChange();
});

audio.addEventListener('pause', () => {
    playButton.src = play_svg;
});

audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.pause();
    playButton.src = play_svg;
});

audio.addEventListener('loadedmetadata', () => {
    audio.volume = 0.5;
    audio.currentTime = 0;

    playButton.src = play_svg;

    slide.value = 0;
    slide.max = audio.duration;

    audioReactionStart(audioReaction);
});

//audio controller
const playButton = document.getElementById('play'); 
const volume = document.getElementById('volume');
const slide = document.getElementById('slide'); 

playButton.addEventListener('click', () => {
    if(!audio.src) return;

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

volume.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

slideChange = () => {
    slide.value = Math.round(audio.currentTime * 100) / 100;
    if(audio.paused) return;
    requestAnimationFrame(slideChange);
}

slide.addEventListener('input', (e) => {
    audio.currentTime = e.target.value;

    if(audio.src === "") return;

    if (audio.paused) {
        audio.play();
    }
});


//audio reaction

//event to resize canvas
const canvas = document.getElementById('audio-reaction');
const ctx = canvas.getContext('2d');

const audioReaction = {
    isConfigured: false,
    audioCtx: window.AudioContext,
    analyser: AnalyserNode,
    audioSource: MediaStreamAudioSourceNode
}

const audioReactionData = {
    bufferLength: Number,
    dataArray: [],
    barWidth: Number
}

const config = {
    minDecibels: -60,
    maxDecibels: -20,
    fftSize: 2 ** 14,
}

const recalculateBarWidth = () => {
    audioReactionData.barWidth = (width * 0.5) / (audioReaction.analyser.frequencyBinCount / 32);
}

function audioReactionStart ({ isConfigured, audioCtx, analyser, audioSource} = audioReaction, { bufferLength, dataArray, barWidth } = audioReactionData) {
    if(!isConfigured) {
        audioCtx = new (window.AudioContext)();
        analyser = audioCtx.createAnalyser();
        audioSource = audioCtx.createMediaElementSource(audio);
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        isConfigured = true;

        Object.assign(audioReaction, { isConfigured, audioCtx, analyser, audioSource });
        Object.assign(analyser, config);
    }

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    barWidth = (width * 0.5) / (analyser.frequencyBinCount / 32);

    Object.assign(audioReactionData, { bufferLength, dataArray, barWidth });
    animate(audioReactionData, audioReaction, canvas, ctx);
}

const animate = function ({ bufferLength, dataArray, barWidth } = audioReactionData, { analyser } = audioReaction) {
    x = 0;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < bufferLength / 32; i++) {
        let barHeight = dataArray[i] / 2;
        ctx.fillStyle = "white";
        ctx.fillRect(-canvas.width / 2 + x, - barHeight - 1, barWidth, barHeight + 1);
        x += barWidth;
    }

    let buffer = document.createElement('canvas');
    let bufferCtx = buffer.getContext('2d');
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    buffer.style.display = "none";

    bufferCtx.drawImage(canvas, 0, 0);

    canvas.width = width * 0.5;
    canvas.height = width * 0.25;

    ctx.drawImage(buffer, 0, 0, canvas.width , canvas.height);

    requestAnimationFrame(animate.bind(null, audioReactionData, audioReaction));
}
