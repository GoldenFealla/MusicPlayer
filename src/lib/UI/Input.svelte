<script>
  import { AudioPlayer } from "../Services/audio.js";

  /**
   * @type {HTMLInputElement}
   */
  let inputElement;

  function openFile() {
    inputElement.click();
  }

  if (inputElement) {
    inputElement.addEventListener("change", handleFile);
  }

  function handleFile() {
    const file = inputElement.files[0];
    const tempURL = URL.createObjectURL(file);

    AudioPlayer.changeSource(tempURL);
  }
</script>

<div>
  <input
    id="audio"
    type="file"
    accept="audio/*"
    bind:this={inputElement}
    on:change={handleFile}
  />
  <md-filled-button
    on:click={openFile}
    on:keyup={() => {}}
    role="button"
    tabindex="0"
    aria-label="Open audio file"
  >
    Audio
  </md-filled-button>
</div>

<style lang="scss">
  #audio {
    display: none;
  }
</style>
