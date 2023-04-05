import { AudioReaction } from "./core";

export class DisplayAudio {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _divisor: number = 32;
    private _binCount: number;
    private _barWidth: number;
    private _mode: boolean = false;

    private _width: number;
    private _height: number;

    constructor(analyser: AnalyserNode, width: number, height: number) {
        this._width = width;
        this._height = height;

        this._binCount = analyser.frequencyBinCount;
        this._barWidth = this._width / (this._binCount / this._divisor);
    }

    get canvas() {
        return this._canvas;
    }

    get ctx() {
        return this._ctx;
    }

    set canvas(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    set ctx(ctx: CanvasRenderingContext2D) {
        this._ctx = ctx;
    }

    set width(width: number) {
        this._width = width;
        this.calculateBarWidth();
    }

    set height(height: number) {
        this._height = height;
    }

    set divisor(divisor: number) {
        this._divisor = divisor;
        this.calculateBarWidth();
    }

    set mode(mode: boolean) {
        this._mode = mode;
    }

    calculateBarWidth() {
        this._barWidth = this._width / (this._binCount / this._divisor);
    }

    animate(audioReaction: AudioReaction) {
        let x = 0;

        let { analyser } = audioReaction.audioCore;
        let { bufferLength, dataArray } = audioReaction.data;
        let barWidth = this._barWidth;

        this._ctx.translate(this._canvas.width / 2, this._canvas.height / 2);
        this._ctx.clearRect(-this._canvas.width / 2, -this._canvas.height / 2, this._canvas.width, this._canvas.height);

        if (this._mode) {
            analyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < bufferLength / this._divisor; i++) {
                let barHeight = (dataArray[i] / 2) * this._canvas.height / 255;
                this._ctx.fillStyle = "white";
                this._ctx.fillRect(-this._canvas.width / 2 + x, - barHeight - 1, barWidth, barHeight + 1);
                x += barWidth;
            }
        } else {
            analyser.getByteTimeDomainData(dataArray);

            this._ctx.beginPath();

            let step = this._canvas.width / bufferLength;
            x = -this._canvas.width / 2;


            for (let i = 0; i < bufferLength; i++) {
                let waveHeight = (dataArray[i] - 128) * this._canvas.height / 255;
                this._ctx.strokeStyle = "white";

                this._ctx.lineTo(x, waveHeight);
                x += step;
            }

            this._ctx.stroke();
        }


        let buffer = this.createBuffer(this._canvas);

        this._canvas.width = this._width;
        this._canvas.height = this._height;

        this._ctx.drawImage(buffer.buffer, 0, 0, this._canvas.width, this._canvas.height);

        requestAnimationFrame(this.animate.bind(this, audioReaction));
    }

    createBuffer(canvas: HTMLCanvasElement) {
        let buffer = document.createElement('canvas');
        let bufferCtx = buffer.getContext('2d');

        buffer.width = canvas.width;
        buffer.height = canvas.height;
        buffer.style.display = "none";

        bufferCtx.drawImage(canvas, 0, 0);

        return { buffer, bufferCtx };
    }

}