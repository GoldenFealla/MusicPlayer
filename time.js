
const timeCount = document.getElementById("time-count");

function startTime() {
    resetTime();
    test();
}

function test() {
    timeCount.innerText = new Date(audio.currentTime * 1000).toISOString().substring(14, 19);
    requestAnimationFrame(test);
}

function resetTime() {
    timeCount.innerText = "00:00";
}
