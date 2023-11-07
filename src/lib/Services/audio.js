import { EventEmitter } from "../helper/event.js";

function createAudioContext() {}

class createAudioPlayer {
  audio = new Audio();
  events = new EventEmitter();

  constructor() {
    this.audio.onloadedmetadata = () => {
      this.events.emit("loadedduration", this.audio.duration);
    };

    this.audio.onpause = () => {
      this.events.emit("isplaying", false);
    };

    this.audio.onplay = () => {
      this.events.emit("isplaying", true);
    };

    this.audio.ontimeupdate = () => {
      this.events.emit("currentTime", this.audio.currentTime);
    };

    this.audio.onended = () => {
      this.events.emit("ended");
    };

    this.audio.onvolumechange = () => {
      this.events.emit("volumechange", this.audio.volume);
    };
  }

  /**
   * change the source of the audio
   * @param {string} src
   */
  changeSource = function (src) {
    this.audio.src = src;
    this.audio.volume = 0.5;
    this.audio.load();

    this.events.emit("changedSource", src);
  };

  /**
   * plays or pauses the audio
   */
  play = function () {
    if (this.audio.src === "") return console.log("no audio source");

    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  };

  /**
   *
   */
  skipNext = function () {
    console.log("skip next");
  };

  /**
   * skip to the previous audio
   */
  skipPrevious = function () {
    console.log("skip previous");
  };

  /**
   * repeat the audio
   */
  repeat = function () {
    console.log("repeat");
  };

  /**
   * shuffle the audio
   */
  shuffle = function () {
    console.log("shuffle");
  };

  /**
   * Change the volume of the audio
   * @param {number} volume
   */
  setVolume = function (volume) {
    this.audio.volume = volume;
  };

  /**
   * @param {number} time
   */
  setCurrentTime = function (time) {
    this.audio.currentTime = time;
  };
}

export const AudioPlayer = new createAudioPlayer();
