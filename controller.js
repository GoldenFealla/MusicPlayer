const controller = document.getElementById("controller");
const playbutton = document.getElementById("playbutton");
const volume = document.getElementById("volume");
const goto = document.getElementById("goto");

volume.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

playbutton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

goto.addEventListener("input", (e) => {
    audio.currentTime = e.target.value;
    if(audio.paused || audio.ended){
        audio.play();
    }
});
