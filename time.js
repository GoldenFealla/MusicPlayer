
let duration = 0;

const timeCount = document.getElementById("time-count");

function startTime() {
    setInterval(() => {
        duration += 1;
        timeCount.innerText = new Date(duration * 1000).toISOString().substring(14, 19);
    }, 1000);
}
