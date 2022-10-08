const display = document.getElementById('display');
const play_svg = "./images/play.svg";
const pause_svg = "./images/pause.svg";


//Handle Import File
const au = document.getElementById('au');
const bg = document.getElementById('bg');

au.addEventListener('change', () => {
    let tempFileURL = URL.createObjectURL(au.files[0]);
    audio.src = tempFileURL;
});

bg.addEventListener('change', () => {
    let tempFileURL = URL.createObjectURL(bg.files[0]);
    console.log(tempFileURL);
});

//audio
const audio = new Audio();

audio.addEventListener('timeupdate', () => {
    slide.value = audio.currentTime;
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
        playButton.src = pause_svg;
    } else {
        audio.pause();
        playButton.src = play_svg;
    }
});

volume.addEventListener('change', (e) => {
    audio.volume = e.target.value / 100;
});

slide.addEventListener('input', (e) => {
    audio.currentTime = e.target.value;

    if(audio.src === "") return;

    if (audio.paused) {
        audio.play();
        playButton.src = pause_svg;
    }
});


//audio reaction
const canvas = document.getElementById('audio-reaction');

canvas.width = 400;
canvas.height = 300;

const ctx = canvas.getContext('2d');

ctx.translate(canvas.width / 2, canvas.height / 2);

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

function audioReactionStart ({ isConfigured, audioCtx, analyser, audioSource} = audioReaction, { bufferLength, dataArray, barWidth } = audioReactionData) {
    if(!isConfigured) {
        audioCtx = new (window.AudioContext)();
        analyser = audioCtx.createAnalyser();
        audioSource = audioCtx.createMediaElementSource(audio);
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        isConfigured = true;
    }

    Object.assign(analyser, config);
    
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    barWidth = canvas.width / (analyser.frequencyBinCount / 32);

    Object.assign(audioReaction, { isConfigured, audioCtx, analyser, audioSource });
    Object.assign(audioReactionData, { bufferLength, dataArray, barWidth });

    animate(audioReactionData, audioReaction);
}

function animate({ bufferLength, dataArray, barWidth } = audioReactionData, { analyser } = audioReaction) {
    x = 0;
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength / 32; i++) {
        let barHeight = dataArray[i] / 2;
        ctx.fillStyle = "white";
        ctx.fillRect(-canvas.width / 2 + x, - barHeight - 1, barWidth, barHeight + 1);
        x += barWidth;
    }
    requestAnimationFrame(animate.bind(null, audioReactionData, audioReaction));
}
