<script>
  import { MdRadio } from "@material/web/radio/radio.js";
  import { ThemesGenerator } from "../Services/themes";

  import Slider from "./shared/Slider.svelte";
  import { onMount } from "svelte";

  $: currentHue = ThemesGenerator.currentHCT.hue;
  $: currentChroma = ThemesGenerator.currentHCT.chroma;
  $: currentTone = ThemesGenerator.currentHCT.tone;

  /**
   * @param {MdRadio} radio
   */
  const onChangedMode = (radio) => {
    const mode = radio.value;

    if (mode === "system" || mode === "light" || mode === "dark") {
      ThemesGenerator.changeMode(mode);
    }
  };

  /**
   * @type {HTMLInputElement}
   */
  let inputEl;

  /**
   * @param {HTMLInputElement} input
   */
  const onChangedColor = (input) => {
    const color = input.value;
    ThemesGenerator.changeColorHex(color);
  };

  ThemesGenerator.events.on(
    "update-color",
    /**
     * @param {Object} data
     * @property {string} color
     */
    (data) => {
      inputEl.value = "#" + data.color.substring(2);
    }
  );

  ThemesGenerator.events.on(
    "update-hct",
    /**
     * @param {Object} data
     * @property {number} hue
     * @property {number} chroma
     * @property {number} tone
     */
    (data) => {
      currentHue = data.hue;
      currentChroma = data.chroma;
      currentTone = data.tone;
    }
  );

  onMount(() => {
    inputEl.addEventListener(
      "input",
      /**
       * @param {any} e
       */
      (e) => onChangedColor(e.target)
    );
  });
</script>

<div class="main">
  <h1>Theme Control</h1>

  <div class="color-picker">
    <input
      bind:this={inputEl}
      type="color"
      value={ThemesGenerator.currentColor}
    />
  </div>

  <div class="hex-chroma-tone">
    <h3>Hue</h3>
    <Slider
      on:current={(data) => {
        ThemesGenerator.changeHue(data.detail.value);
      }}
      min={0}
      max={255}
      value={currentHue}
    />

    <h3>Chroma</h3>
    <Slider
      on:current={(data) => {
        ThemesGenerator.changeChroma(data.detail.value);
      }}
      min={0}
      max={150}
      value={currentChroma}
    />

    <h3>Tone</h3>
    <Slider
      on:current={(data) => {
        ThemesGenerator.changeTone(data.detail.value);
      }}
      min={0}
      max={100}
      value={currentTone}
    />
  </div>

  <div class="dark-mode">
    <form>
      <span>
        <md-radio
          id="system"
          name="dark-mode"
          value="system"
          on:change={(e) => onChangedMode(e.target)}
          checked
        />
        <label for="system">System</label>
      </span>

      <span>
        <md-radio
          id="light"
          name="dark-mode"
          value="light"
          on:change={(e) => onChangedMode(e.target)}
        />
        <label for="light">Light</label>
      </span>

      <span>
        <md-radio
          id="dark"
          name="dark-mode"
          value="dark"
          on:change={(e) => onChangedMode(e.target)}
        />
        <label for="dark">Dark</label>
      </span>
    </form>
  </div>
</div>

<style lang="scss">
  .main > h1 {
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
  }

  .main > div {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;

    border-radius: 0.5rem;
    background-color: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
  }

  .hex-chroma-tone {
    h3 {
      text-align: center;
      margin-top: 0.5rem;
      margin-bottom: 0.25rem;
    }
  }

  .dark-mode > form {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    gap: 1rem;

    & > span {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      gap: 0.5rem;
    }
  }
</style>
