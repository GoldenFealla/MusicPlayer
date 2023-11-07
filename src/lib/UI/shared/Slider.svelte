<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();

  export let min = 0;
  export let max = 1;
  export let step = 0.001;
  export let value = 0;

  const progress = tweened(value, {
    duration: 200,
    easing: cubicOut,
  });

  import { MdSlider } from "@material/web/slider/slider.js";

  /**
   *  @param {Object} e
   *  @param {MdSlider} e.target
   */
  const onChangeValue = ({ target }) => {
    const { min, max, value } = target;
    dispatch("current", { min, max, value });

    progress.set(value);
  };

  /**
   * @type {MdSlider} sliderEl
   */
  let sliderEl;

  $: {
    progress.set(value);
  }
</script>

<div>
  <md-slider
    bind:this={sliderEl}
    on:input={onChangeValue}
    {min}
    {max}
    value={$progress}
    {step}
  />
</div>

<style>
  md-slider {
    width: 100%;
  }
</style>
