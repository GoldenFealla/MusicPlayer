const track = document.getElementById('track');
const trackLife = document.getElementById('track-life');

const height = 5;

function startTrack() {
    Object.assign(trackLife.style, {
        position: "absolute",
        width: '85%',
        height: `${height}px`, 
        backgroundColor: ' rgb(150, 150, 150)',
    });

    Object.assign(track.style, {
        position: "absolute",
        width: '85%',
        height: `${height}px`, 
        backgroundColor: ' rgb(255, 255, 255)',
    });

    trackRun();
}

function trackRun() {
    track.style.width = `${(audio.currentTime / audio.duration) * 85}%`;
    requestAnimationFrame(trackRun);
}