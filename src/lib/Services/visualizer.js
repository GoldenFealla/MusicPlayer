import { AudioCore } from "./core.js";

export class AudioVisualizer {
    static _instance = null;

    /**
     * @type {HTMLCanvasElement}
     * @private
     * @static
     */
    static _canvas = null;

    /**
     * @type {CanvasRenderingContext2D}
     * @private
     * @static
     */
    static _ctx = null;

    /**
     * @type {Object}
     * @private
     * @static
     * @property {number} height - The height of the canvas
     * @property {number} width - The width of the canvas
     * @property {number} divisor - The divisor of the canvas size
     * @property {number} barWidth - The width of the bars
     * @property {0 | 1} mode - The mode of the canvas, 0 for bars, 1 for wave
     */
    static _options = {
        height: 1280,
        width: 720,
        divisor: 32,
        barWidth: 0.5,
        mode: 0
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * 
     */
    constructor(canvas) {
        if (AudioVisualizer._instance) {
            throw new Error("AudioVisualizer is a singleton class");
        }

        AudioVisualizer._canvas = canvas;
        AudioVisualizer._ctx = AudioVisualizer._canvas.getContext('2d');
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} [options] 
     * @param {number} [options.height = canvas.height] - The height of the canvas
     * @param {number} [options.width = canvas.width] - The width of the canvas
     * @param {number} [options.divisor = 32] - The divisor of the canvas size
     * @param {number} [options.barWidth = 0.5] - The width of the bars
     * @param {0 | 1} [options.mode = 0] - The mode of the canvas, 0 for bars, 1 for wave
     */
    static createAudioVisualizer(canvas, options) {
        AudioVisualizer._instance = new AudioVisualizer(canvas);

        if (options) {
            Object.assign(AudioVisualizer._options, options);
        }

        return AudioVisualizer._instance;
    }

    /**
     * @param {0 | 1} mode 
     */
    static setMode(mode) {
        AudioVisualizer._options.mode = mode;
    }

    /**
     * @param {number} height 
     */
    static setHeight(height) {
        AudioVisualizer._options.height = height;
    }

    /**
     * 
     * @param {number} width 
     */
    static setWidth(width) {
        AudioVisualizer._options.width = width;
    }

    /**
     * @param {number} barWidth 
     */
    static setBarWidth(barWidth) {
        AudioVisualizer._options.barWidth = barWidth;
    }

    /**
     * @param {number} divisor 
     */
    static setDivisor(divisor) {
        AudioVisualizer._options.divisor = divisor;
    }


    static animate() {
        const analyser = AudioCore.audioAnalyser;

        AudioVisualizer._ctx.translate(AudioVisualizer._canvas.width / 2, AudioVisualizer._canvas.height / 2);
        AudioVisualizer._ctx.clearRect(-AudioVisualizer._canvas.width / 2, -AudioVisualizer._canvas.height / 2, AudioVisualizer._canvas.width, AudioVisualizer._canvas.height);

        if(analyser) {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let barWidth = AudioVisualizer._options.barWidth;

            if (AudioVisualizer._options.mode === 0) {
                AudioCore.audioAnalyser.getByteFrequencyData(dataArray);
                AudioVisualizer.#animateBars(bufferLength, dataArray, barWidth);
            } else {
                AudioCore.audioAnalyser.getByteTimeDomainData(dataArray);
                AudioVisualizer.#animateWave(bufferLength, dataArray);
            }

            let buffer = AudioVisualizer.#createBuffer();

            AudioVisualizer._canvas.width = AudioVisualizer._options.width;
            AudioVisualizer._canvas.height = AudioVisualizer._options.height;

            AudioVisualizer._ctx.drawImage(buffer.buffer, 0, 0, AudioVisualizer._canvas.width, AudioVisualizer._canvas.height);
        }

        requestAnimationFrame(AudioVisualizer.animate);
    }

    /**
     * @param {number} bufferLength
     * @param {Uint8Array} dataArray
     * @param {number} barWidth
     */
    static #animateBars(bufferLength, dataArray, barWidth) {
        let x = 0;

        for (let i = 0; i < bufferLength / AudioVisualizer._options.divisor; i++) {
            let barHeight = (dataArray[i] / 2) * AudioVisualizer._canvas.height / 255 + 1;
            AudioVisualizer._ctx.fillStyle = "white";
            AudioVisualizer._ctx.fillRect(-AudioVisualizer._canvas.width / 2 + x, - barHeight - 1, barWidth, barHeight + 1);
            x += barWidth;
        }
    }

    /**
     * @param {number} bufferLength
     * @param {Uint8Array} dataArray
     */
    static #animateWave(bufferLength, dataArray) {
        let x = 0;

        AudioVisualizer._ctx.beginPath();

        let step = AudioVisualizer._canvas.width / bufferLength;
        x = -AudioVisualizer._canvas.width / 2;


        for (let i = 0; i < bufferLength; i++) {
            let waveHeight = (dataArray[i] - 128) * AudioVisualizer._canvas.height / 255;
            AudioVisualizer._ctx.strokeStyle = "white";
            AudioVisualizer._ctx.lineTo(x, waveHeight);
            x += step;
        }

        AudioVisualizer._ctx.stroke();
    }

    static stop() {

    }

    static #createBuffer() {
        let buffer = document.createElement('canvas');
        let bufferCtx = buffer.getContext('2d');

        buffer.width = AudioVisualizer._canvas.width;
        buffer.height = AudioVisualizer._canvas.height;
        buffer.style.display = "none";

        bufferCtx.drawImage(AudioVisualizer._canvas, 0, 0);

        return { buffer, bufferCtx };
    }
}
