import { AudioCore } from "./core.js";

export class AudioController {
    /**
     * @type {AudioController}
     * @private
     */
    static _instance = null;

    /**
     * @type {HTMLAudioElement}
     * @private
     */
    static _ac = null;

    /**
     * @param {HTMLAudioElement} audio
     */
    constructor(audio) {
        if (AudioController._instance) {
            throw new Error("AudioController is a singleton class");
        }

        AudioController._ac = audio;
    }

    /**
     * @param {number} volume - The volume to set the audio to (0 - 1)
     */
    static setVolume(volume) {
        AudioController._ac.volume = volume;
    }

    /**
     * @param {number} time - The time to seek to in seconds
     */
    static seek(time) {
        AudioController._ac.currentTime = time;
    }

    static getDuration() {
        return AudioController._ac.duration;
    }

    static getCurrentTime() {
        return AudioController._ac.currentTime;
    }

    static async play() {
        if(AudioController._ac.paused) {
            await AudioController._ac.play();
        } else {
            AudioController._ac.pause();
        }
    }

    static getInstance() {
        if (AudioController._instance == null) {
            AudioController._instance = new AudioController(AudioCore._audio);
        }
        return AudioController._instance;
    }
}

export const AudioControllerInstance = AudioController.getInstance();