export interface AudioReactionConfig {
    minDecibels: number,
    maxDecibels: number,
    fftSize: number,
}

export interface AudioReactionData {
    bufferLength: number;
    dataArray: Uint8Array;
}

export interface AudioCore {
    context: AudioContext;
    analyser: AnalyserNode;
    source: AudioNode;
}

export class AudioReactionCore {
    protected _config: AudioReactionConfig = {} as AudioReactionConfig;
    protected _audioCore: AudioCore = {} as AudioCore;

    constructor(audio: HTMLAudioElement) {
        this._config = {
            minDecibels: -60,
            maxDecibels: -20,
            fftSize: 2 ** 14,
        };

        let context, analyser, source: any;

        context = new AudioContext();
        analyser = context.createAnalyser();
        source = context.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(context.destination);

        Object.assign(this._audioCore, { context, analyser, source });
        Object.assign(analyser, this._config);
    }
}

export class AudioReaction extends AudioReactionCore {
    constructor(audio: HTMLAudioElement) {
        super(audio);

        let frequencyBinCount = this._audioCore.analyser.frequencyBinCount;

        this.data = {
            bufferLength: frequencyBinCount,
            dataArray: new Uint8Array(frequencyBinCount),
        }
    }

    data: AudioReactionData;

    //Function to interact with the config
    get config() {
        return this._config;
    }

    set config(config: AudioReactionConfig) {
        this._config = config;
        Object.assign(this._audioCore.analyser, this._config);
    }

    //Function to interact with the audio core
    get audioCore() {
        return this._audioCore;
    }
}

export class AudioController {
    private _audio: HTMLAudioElement;
    private _audioReaction: AudioReaction;

    constructor(audio: HTMLAudioElement) {
        this._audio = audio;
        this._audioReaction = new AudioReaction(audio);
    }

    get audio() {
        return this._audio;
    }

    get audioReaction() {
        return this._audioReaction;
    }
}