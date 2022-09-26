
let duration = 0;

const timeCount = document.getElementById("time-count");

function startTime() {
    if(!duration) {
        resetTime();
        setInterval(() => {
            duration += 1;
            timeCount.innerText = new Date(duration * 1000).toISOString().substring(14, 19);
        }, 1000);
    }
}

function resetTime() {
    duration = 0;
    timeCount.innerText = "00:00";
}
