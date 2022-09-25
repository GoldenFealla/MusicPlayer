const track = document.getElementById('track');
const trackLife = document.getElementById('track-life');

function startTrack() {
    Object.assign(trackLife.style, {
        position: "absolute",
        width: '100%',
        height: '100%', 
        backgroundColor: ' rgb(150, 150, 150)',
    });

    Object.assign(track.style, {
        position: "absolute",
        width: '0%',
        height: '100%', 
        backgroundColor: ' rgb(255, 255, 255)',
    });

    setInterval(() => {
        trackRun();
    }, 100);
}

function trackRun() {
    track.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
}