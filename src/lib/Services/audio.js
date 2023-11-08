import { EventEmitter } from "../helper/event.js";

class createAudioCore {
  events = new EventEmitter();

  constructor() {}

  /**
   * @param {HTMLAudioElement} audio
   */
  reloadContext(audio) {
    this._ac = new AudioContext();
    this._aa = this._ac.createAnalyser();

    //default values
    this._aa.fftSize = 2 ** 14;
    this._aa.smoothingTimeConstant = 0.8;

    this._source = this._ac.createMediaElementSource(audio);

    this._source.connect(this._aa);
    this._aa.connect(this._ac.destination);

    this.events.emit("contextReloaded");
  }

  /**
   * @param {number} value
   */
  set fftSize(value) {
    if (value < 32 || value > 32768)
      throw new Error("fftSize is out of range");
    if (Math.log2(value) % 1 != 0)
      throw new Error("fftSize must be a power of 2");

    this._aa.fftSize = value;
  }

  /**
   * @param {number} value
   */
  set smoothingTimeConstant(value) {
    if (value < 0 || value > 1)
      throw new Error("smoothingTimeConstant is out of range");

    this._aa.smoothingTimeConstant = value;
  }
}

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
      AudioCore._ac.resume();
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

export class createAudioVisualizer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");

    this.height = canvas.clientHeight;
    this.width = canvas.clientWidth;
  }

  /**
   * @param {number} value
   */
  set height(value) {
    this._canvas.height = value;
  }

  /**
   * @param {number} value
   */
  set width(value) {
    this._canvas.width = value;
  }

  /**
   * @param {(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, windowHeight: number, windowWidth: number, analyzer: AnalyserNode) => void} functionToAnimate
   * @param {AnalyserNode} analyzer
   * @returns {void}
   *
   */
  animate(functionToAnimate, analyzer) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    functionToAnimate(
      this._canvas,
      this._ctx,
      width,
      height,
      analyzer
    );
    requestAnimationFrame(() =>
      this.animate(functionToAnimate, analyzer)
    );
  }
}

export const AudioPlayer = new createAudioPlayer();
export const AudioCore = new createAudioCore();
