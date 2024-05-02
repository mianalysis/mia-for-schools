import { Show, For, createEffect, createSignal, on } from 'solid-js';
import { PNG } from 'pngjs';

interface Props {
  source: [ChannelJSON];
  loading?: boolean;
  showControls: boolean
}

function getChannelHex(channel: ChannelJSON) {
  var red = 0
  if (channel.reds[255] == -1)
    red = 220

  var green = 0
  if (channel.greens[255] == -1)
    green = 220

  var blue = 0
  if (channel.blues[255] == -1)
    blue = 220

  var hex = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)

  return hex;

}

export default function Im(props: Props) {
  var compiledIm = new Float32Array();
  var loadedIms = new Map();
  var lockIm = false;

  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(false);

  createEffect(
    on(
      () => props.source,
      () => {
        setLoading(false);
        loadedIms = loadImages(props);
        compiledIm = compileImage(loadedIms);
        console.log("here0");
        (document.getElementById('currim') as HTMLImageElement).src = "data:image/png;base64," + compiledImageToPNG(compiledIm);        

      }
    )
  );

  const hide = () => props.loading || loading();

  function loadImages(props: Props) {
    var loadedIms = new Map<number, any>();

    for (var channel = 0; channel < props.source.length; channel++) {
      var binary_string = Buffer.from(props.source[channel].pixels, 'base64');
      var png = PNG.sync.read(binary_string);

      loadedIms.set(channel, png);

    }

    return loadedIms;

  }

  function compileImage(loadedIms: Map<number, any>) {
    var w = loadedIms.get(0).width;
    var h = loadedIms.get(0).height;

    var compiledIm = new Float32Array(w * h * 4);

    for (let idx = 0; idx < w * h * 4; idx = idx + 4) {
      var val = 0;
      for (let c = 0; c < loadedIms.size; c++)
        val = val + loadedIms.get(c).data[idx] * props.source[c].strength;
      compiledIm[idx] = val;
    }
    for (let idx = 1; idx < w * h * 4; idx = idx + 4) {
      var val = 0;
      for (let c = 0; c < loadedIms.size; c++)
        val = val + loadedIms.get(c).data[idx] * props.source[c].strength;
      compiledIm[idx] = val;
    }
    for (let idx = 2; idx < w * h * 4; idx = idx + 4) {
      var val = 0;
      for (let c = 0; c < loadedIms.size; c++)
        val = val + loadedIms.get(c).data[idx] * props.source[c].strength;
      compiledIm[idx] = val;
    }
    for (let idx = 3; idx < w * h * 4; idx = idx + 4)
      compiledIm[idx] = 255;

    return compiledIm;

  }


  function compiledImageToPNG(compiledIm: Float32Array) {
    var w = 512;
    var h = 512;

    var png = new PNG({width: w, height: h});
    for (let idx = 0; idx < w * h * 4; idx++)
      png.data[idx] = compiledIm[idx]
    
    return PNG.sync.write(png.pack()).toString('base64');

  }

  function setBC(value: number, channel: number) {
    if (lockIm)
      return;

    lockIm = true;

    var w = loadedIms.get(0).width;
    var h = loadedIms.get(0).height;

    var prevStrength = props.source[channel].strength
    props.source[channel].strength = value;

    if (compiledIm == undefined)
      return;

    const currim = document.getElementById('currim') as HTMLImageElement;
    if (currim == null)
      return;

    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext('2d');
    context?.drawImage(currim, 0, 0);

    var Imagedata = context?.getImageData(0, 0, w, h);
    if (Imagedata == null)
      return;

    if ((props.source[channel].reds[255] == -1)) {
      for (let idx = 0; idx < w * h * 4; idx = idx + 4) {
        compiledIm[idx] = compiledIm[idx] + loadedIms.get(channel).data[idx] * (value - prevStrength)
        Imagedata.data[idx] = compiledIm[idx]
      }
    }

    if ((props.source[channel].greens[255] == -1)) {
      for (let idx = 1; idx < w * h * 4; idx = idx + 4) {
        compiledIm[idx] = compiledIm[idx] + loadedIms.get(channel).data[idx] * (value - prevStrength)
        Imagedata.data[idx] = compiledIm[idx]
      }
    }

    if ((props.source[channel].blues[255] == -1)) {
      for (let idx = 2; idx < w * h * 4; idx = idx + 4) {
        compiledIm[idx] = compiledIm[idx] + loadedIms.get(channel).data[idx] * (value - prevStrength)
        Imagedata.data[idx] = compiledIm[idx]
      }
    }

    context?.putImageData(Imagedata, 0, 0);
    (document.getElementById('currim') as HTMLImageElement).src = canvas.toDataURL();

  }

  return (
    <div>
      <Show when={!error()} fallback={<p class="text-red-600">Error loading image</p>}>
        <img
          id="currim"
          // src={compiledImageToPNG(compiledIm)}
          // src={"data:image/png;base64," + props.source[0].pixels}
          onLoad={() => { setLoading(false); lockIm = false; console.log("loading off")}}
          alt="image"
          classList={{ 'opacity-10': hide() }}
          class="transition-opacity"
          onError={() => setError(true)}
        />
      </Show>
      <Show when={props.showControls}>
        <For each={props.source}>{(channel) =>
          <input
            class="range h-8 w-32 m-2 rounded-full appearance-none"
            style={"background: " + getChannelHex(channel)}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={1}
            oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), channel.index)}
          />
        }
        </For>
      </Show>
    </div>
  );
}