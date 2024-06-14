import { PNG } from 'pngjs';

export default class CompositeImage {
    source: [ChannelJSON]
    loadedIms: Map<number, any>
    compiledIm: Float32Array
    w: number
    h: number

    constructor(source: [ChannelJSON]) {
        this.source = source;

        this.loadedIms = new Map<number, any>();
        for (var channel = 0; channel < source.length; channel++) {
            var binary_string = Buffer.from(source[channel].pixels, 'base64');
            var png = PNG.sync.read(binary_string);

            this.loadedIms.set(channel, png);

        }

        this.w = this.loadedIms.get(0).width
        this.h = this.loadedIms.get(0).height

        this.compiledIm = this.compileImage(this.loadedIms, this.source)

    }

    compileImage(loadedIms: Map<number, any>, source: [ChannelJSON]) {
        var compiledIm = new Float32Array(this.w * this.h * 4);

        for (let idx = 0; idx < this.w * this.h * 4; idx = idx + 4) {
            var val = 0;
            for (let c = 0; c < loadedIms.size; c++)
                val = val + loadedIms.get(c).data[idx] * source[c].strength;
            compiledIm[idx] = val;
        }
        for (let idx = 1; idx < this.w * this.h * 4; idx = idx + 4) {
            var val = 0;
            for (let c = 0; c < loadedIms.size; c++)
                val = val + loadedIms.get(c).data[idx] * source[c].strength;
            compiledIm[idx] = val;
        }
        for (let idx = 2; idx < this.w * this.h * 4; idx = idx + 4) {
            var val = 0;
            for (let c = 0; c < loadedIms.size; c++)
                val = val + loadedIms.get(c).data[idx] * source[c].strength;
            compiledIm[idx] = val;
        }
        for (let idx = 3; idx < this.w * this.h * 4; idx = idx + 4)
            compiledIm[idx] = 255;

        return compiledIm

    }

    getAsPNG() {
        var png = new PNG({ width: this.w, height: this.h });
        for (let idx = 0; idx < this.w * this.h * 4; idx++)
            png.data[idx] = this.compiledIm[idx]

        return PNG.sync.write(png.pack()).toString('base64');

    }

    setChannelBrightness(imagedata: ImageData, channel: number, value: number) {
        var prevStrength = this.source[channel].strength
        var diffStrength = value - prevStrength
        this.source[channel].strength = value;

        if (this.source[channel].red > 0)
            for (let idx = 0; idx < this.w * this.h * 4; idx = idx + 4)
                imagedata.data[idx] = imagedata.data[idx] + this.loadedIms.get(channel).data[idx] * diffStrength

        if (this.source[channel].green > 0)
            for (let idx = 1; idx < this.w * this.h * 4; idx = idx + 4)
                imagedata.data[idx] = imagedata.data[idx] + this.loadedIms.get(channel).data[idx] * diffStrength

        if (this.source[channel].blue > 0)
            for (let idx = 2; idx < this.w * this.h * 4; idx = idx + 4)
                imagedata.data[idx] = imagedata.data[idx] + this.loadedIms.get(channel).data[idx] * diffStrength

    }

    getPixelArray() {
        return this.compiledIm
    }

    getWidth() {
        return this.w
    }

    getHeight() {
        return this.h
    }
}