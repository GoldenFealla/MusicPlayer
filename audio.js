let musicInput = document.getElementById("music-input");


let audio = new Audio();
audio.src = "";
let audioReaction;

musicInput.addEventListener("change", function () {
    try {
        let tempMusic = URL.createObjectURL(musicInput.files[0]);
        audio.src = tempMusic;
        audioReaction.changeAudio(audio);
        startTrack();
    } catch (error) {}
});


class CreateMediaSource {
    constructor(audio, config) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = this.audioCtx.createMediaElementSource(audio);
        this.analyser = this.audioCtx.createAnalyser();
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        Object.assign(this.analyser, config);

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.barWidth = canvas.width / (this.bufferLength / 32);
    }
}


class AudioReaction extends CreateMediaSource{
    constructor(audio) {
        super(audio, {
            minDecibels: -60,
            maxDecibels: -20,
            fftSize: 2 ** 14,
        });
        this.animate();
    }

    animate() {
        this.x = 0;
        ctx.clearRect(-canvas.halfWidth, -canvas.halfHeight, canvas.width, canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        for (let i = 0; i < this.bufferLength / 32; i++) {
            let barHeight = this.dataArray[i] / 2;
            ctx.fillStyle = "white";
            ctx.fillRect(-canvas.halfWidth + this.x, - barHeight - 1, this.barWidth, barHeight + 1);
            this.x += this.barWidth;
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}

function startAudio() {
    console.log('triggered the audio functions');
    audio.volume = 0.5;
    if(audio.paused || audio.ended) {
        audio.play();
    }
    setUp();
}

function setUp() {
    if(!audioReaction) {
        audioReaction = new AudioReaction(audio); 
    }
}