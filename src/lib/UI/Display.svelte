<script>
  import { onMount } from "svelte";

  import {
    AudioCore,
    createAudioVisualizer,
  } from "../Services/audio";
  import { renderByBar } from "../Services/visualizer.js";

  /**
   * @type {HTMLCanvasElement} canvasEl
   */
  let canvasEl;

  /**
   * @type {createAudioVisualizer}
   */
  let AudioVisualizer;

  onMount(() => {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;

    AudioVisualizer = new createAudioVisualizer(canvasEl);

    AudioCore.events.on("contextReloaded", () => {
      AudioVisualizer.animate(renderByBar, AudioCore._aa);
    });
  });
</script>

<div class="wrapper">
  <canvas bind:this={canvasEl} />
</div>

<style lang="scss">
  .wrapper,
  .wrapper > canvas {
    width: 100%;
    height: 100%;

    margin: 0;
    padding: 0;
  }

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  canvas {
    background-color: var(--md-sys-color-surface-variant);
  }
</style>
