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
            png.data[idx] = Math.min(255, this.compiledIm[idx]);

        return PNG.sync.write(png.pack()).toString('base64');

    }

    setChannelBrightness(imagedata: ImageData, channel: number, value: number) {
        var prevStrength = this.source[channel].strength;
        var diffStrength = value - prevStrength;
        this.source[channel].strength = value;

        if (this.source[channel].red > 0)
            for (let idx = 0; idx < this.w * this.h * 4; idx = idx + 4) {
                this.compiledIm[idx] = this.compiledIm[idx] + this.loadedIms.get(channel).data[idx] * diffStrength
                imagedata.data[idx] = Math.min(255, this.compiledIm[idx]);
            }

        if (this.source[channel].green > 0)
            for (let idx = 1; idx < this.w * this.h * 4; idx = idx + 4) {
                this.compiledIm[idx] = this.compiledIm[idx] + this.loadedIms.get(channel).data[idx] * diffStrength
                imagedata.data[idx] = Math.min(255, this.compiledIm[idx]);
            }

        if (this.source[channel].blue > 0)
            for (let idx = 2; idx < this.w * this.h * 4; idx = idx + 4) {
                this.compiledIm[idx] = this.compiledIm[idx] + this.loadedIms.get(channel).data[idx] * diffStrength
                imagedata.data[idx] = Math.min(255, this.compiledIm[idx]);
            }
    }

    getChannelSum(channel: number) {
        var sum = 0;
        for (let idx = 0; idx < this.w * this.h * 4; idx = idx + 4)
            sum = sum + this.loadedIms.get(channel).data[idx];
        for (let idx = 1; idx < this.w * this.h * 4; idx = idx + 4)
            sum = sum + this.loadedIms.get(channel).data[idx];
        for (let idx = 2; idx < this.w * this.h * 4; idx = idx + 4)
            sum = sum + this.loadedIms.get(channel).data[idx];

        return sum*this.source[channel].strength;

    }

    getHistogram(channel: number, numberOfBins: number) {
        var vals = new Array(numberOfBins).fill(0)

        for (let idx = 0; idx < this.w * this.h * 4; idx = idx + 4) {
            var val = Math.floor(numberOfBins*this.loadedIms.get(channel).data[idx]*this.source[channel].strength/256);
            vals[val] = vals[val] + 1;
        }

        for (let idx = 1; idx < this.w * this.h * 4; idx = idx + 4) {
            var val = Math.floor(numberOfBins*this.loadedIms.get(channel).data[idx]*this.source[channel].strength/256);
            vals[val] = vals[val] + 1;
        }
        
        for (let idx = 2; idx < this.w * this.h * 4; idx = idx + 4) {
            var val = Math.floor(numberOfBins*this.loadedIms.get(channel).data[idx]*this.source[channel].strength/256);
            vals[val] = vals[val] + 1;
        }
            
        return vals;

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