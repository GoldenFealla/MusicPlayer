export class AudioCore {
  /**
   * @type {AudioCore}
   * @static
   * @private
   */
  static _instance = null;

  /**
   *  @type {HTMLAudioElement}
   *  @static
   */
  static _audio = null;

  /**
   * @type {AudioContext}
   * @static
   * @public
   * @description The audio context of the audio
   */
  static _audioContext = null;

  /**
   * @type {AnalyserNode}
   * @static
   * @public
   * @description The analyser node of the audio
   */
  static _audioAnalyser = null;

  /**
   * @type {MediaElementAudioSourceNode}
   * @static
   * @public
   * @description The source node of the audio
   */
  static _source = null;

  constructor() {
    if (AudioCore._instance) {
      throw new Error("AudioCore is a singleton class");
    }

    AudioCore._audio = new Audio();
  }

  static #checkInstance() {
    if (AudioCore._instance == null) {
      throw new Error("AudioCore is not initialized");
    }
  }

  static #reloadAudioContext() {
    AudioCore._audioContext = new AudioContext();

    AudioCore._audioAnalyser = AudioCore._audioContext.createAnalyser();
    AudioCore._audioAnalyser.fftSize = 2048;
    AudioCore._audioAnalyser.smoothingTimeConstant = 0.8;

    AudioCore._source = AudioCore._audioContext.createMediaElementSource(
      AudioCore._audio
    );
    AudioCore._source.connect(AudioCore._audioAnalyser);

    AudioCore._audioAnalyser.connect(AudioCore._audioContext.destination);
  }

  /**
   * @param {string} src
   */
  static setAudioSource(src) {
    AudioCore._audio.src = src;
    AudioCore.#reloadAudioContext();
  }

  /**
   * @param { number } fftSize
   */
  static setfftSize(fftSize) {
    if (fftSize < 32 || fftSize > 32768) {
      throw new Error("fftSize must be between 32 and 32768");
    }

    if (Math.log2(fftSize) % 1 != 0) {
      throw new Error("fftSize must be a power of 2");
    }

    AudioCore._audioAnalyser.fftSize = fftSize;
  }

  /**
   * @param {number} smoothingTimeConstant
   */
  static setSmoothingTimeConstant(smoothingTimeConstant) {
    AudioCore._audioAnalyser.smoothingTimeConstant = smoothingTimeConstant;
  }

  static getInstance() {
    if (AudioCore._instance == null) {
      AudioCore._instance = new AudioCore();
    }
    return AudioCore._instance;
  }

  static get audioContext() {
    AudioCore.#checkInstance();
    return AudioCore._audioContext;
  }

  static get audioAnalyser() {
    AudioCore.#checkInstance();
    return AudioCore._audioAnalyser;
  }
}

export const AudioCoreInstance = AudioCore.getInstance();
