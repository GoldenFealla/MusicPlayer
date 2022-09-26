const controller = document.getElementById("controller");
const volume = document.getElementById("volume");

volume.addEventListener("input", (e) => {
    console.log(e.target.value);
});
