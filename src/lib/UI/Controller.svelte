<script>
  // helper
  import { minutes } from "../helper/helper";

  // shared components
  import IconButton from "./shared/IconButton.svelte";
  import Slider from "./shared/Slider.svelte";

  import { AudioPlayer } from "../Services/audio.js";

  $: isPlaying = !AudioPlayer.audio.paused;

  AudioPlayer.events.on(
    "isplaying",
    /**
     * @param {any} e
     */
    (e) => {
      isPlaying = e;
    }
  );

  $: maxTime = 0;
  $: currentTime = 0;

  AudioPlayer.events.on(
    "loadedduration",
    /**
     * @param {any} e
     */
    (e) => {
      maxTime = e;
    }
  );

  $: volume = AudioPlayer.audio.volume;

  AudioPlayer.events.on(
    "volumechanged",
    /**
     * @param {any} e
     */
    (e) => {
      console.log(e);
      volume = e;
    }
  );

  /**
   * @type {{action: () => void, iconName: string, size: 'small' | 'medium' | 'large'}[]}
   * @description
   * action: function to call
   * iconName: name of the icon
   * size: size of the icon
   */
  $: controlsElement = [
    {
      action: AudioPlayer.shuffle.bind(AudioPlayer),
      iconName: "shuffle",
      size: "small",
    },
    {
      action: AudioPlayer.skipPrevious.bind(AudioPlayer),
      iconName: "skip_previous",
      size: "medium",
    },
    {
      action: AudioPlayer.play.bind(AudioPlayer),
      iconName: !isPlaying ? "play_arrow" : "pause",
      size: "large",
    },
    {
      action: AudioPlayer.skipNext.bind(AudioPlayer),
      iconName: "skip_next",
      size: "medium",
    },
    {
      action: AudioPlayer.repeat.bind(AudioPlayer),
      iconName: "repeat",
      size: "small",
    },
  ];

  const loop = () => {
    currentTime = AudioPlayer.audio.currentTime;
    requestAnimationFrame(loop);
  };

  loop();
</script>

<div class="container">
  <div class="main">
    <div class="left" />

    <div class="middle">
      <div class="control">
        {#each controlsElement as element}
          <IconButton
            on:click={() => {
              element.action();
            }}
            iconName={element.iconName}
            size={element.size}
          />
        {/each}
      </div>

      <div class="timespan">
        <span class="time">{minutes(currentTime)}</span>
        <span class="slider">
          <Slider
            min={0}
            max={maxTime}
            value={currentTime}
            on:current={(c) => {
              const second = c.detail.value;
              AudioPlayer.setCurrentTime(second);
            }}
          />
        </span>
        <span class="time">{minutes(maxTime)}</span>
      </div>
    </div>

    <div class="right">
      <div>
        <IconButton
          iconName={volume === 0
            ? "volume_off"
            : volume < 0.5
            ? "volume_down"
            : "volume_up"}
          size="small"
        />
        <Slider
          on:current={(c) => {
            const volume = c.detail.value;
            AudioPlayer.setVolume(volume);
          }}
          min={0}
          max={1}
          value={0.5}
        />
      </div>
    </div>
  </div>
  <div />
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;

    flex-direction: column;
    justify-content: flex-end;

    padding: 10px;
  }

  .container,
  .main {
    display: flex;
    align-items: center;
  }

  .main {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }

  $side-size: 15%;

  .left,
  .right {
    width: $side-size;
  }

  .middle {
    width: calc(100% - #{$side-size * 2});

    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 10px;
  }

  .middle > div {
    width: 100%;
  }

  .control {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    gap: 10px;
  }

  .timespan {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    gap: 10px;

    & > .slider {
      width: 100%;
    }

    & > .time {
      color: white;
      font-size: 1rem;
      width: 3rem;
    }
  }

  .right > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
</style>
