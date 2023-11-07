<script>
  import { onMount } from "svelte";

  import { AudioVisualizer } from "../Services/visualizer.js";

  /** @type {HTMLCanvasElement} */
  let canvasElement;

  onMount(() => {
    AudioVisualizer.createAudioVisualizer(canvasElement);

    AudioVisualizer.setHeight(canvasElement.height);
    AudioVisualizer.setWidth(canvasElement.width);
    AudioVisualizer.setMode(0);
    AudioVisualizer.setBarWidth(2);
    AudioVisualizer.setDivisor(1);

    AudioVisualizer.animate();
  });

  function test(e) {
    console.log(e);

    AudioVisualizer.setHeight(canvasElement.height);
    AudioVisualizer.setWidth(canvasElement.width);
  }
</script>

<div class="container">
  <canvas bind:this={canvasElement} on:resize={test} />
</div>

<style>
  .container {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  canvas {
    width: 100%;
    height: 100%;

    aspect-ratio: 16 / 9;

    background-color: black;
  }
</style>
