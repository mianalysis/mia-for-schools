import { Show, For, createEffect, createSignal, on } from 'solid-js';
import { PNG } from 'pngjs';

interface Props {
  source: [ChannelJSON];
  loading?: boolean;
  showControls: boolean
}

function stringToHash(string: String) {
  return string.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0);
}

function getChannelClass(channel: ChannelJSON) {
  console.log(channel)
  console.log(channel.reds[255])
  console.log(channel.greens[255])
  console.log(channel.blues[255])

  var red = 0
  if (channel.reds[255] == -1)
    red = 255

  var green = 0
  if (channel.greens[255] == -1)
    green = 255

  var blue = 0
  if (channel.blues[255] == -1)
    blue = 255

  var hex = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)

  var class_str = "range h-8 w-32 m-2 rounded-full bg-[" + hex + "] appearance-none"

  return class_str

}

export default function Im(props: Props) {
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(false);

  createEffect(
    on(
      () => props.source,
      () => {
        setLoading(true);
      }
    )
  );

  const hide = () => props.loading || loading();

  // var existingSourceHash = stringToHash(props.source[0].pixels);

  // Loading images
  var w = 0;
  var h = 0;
  var loadedIms = new Map();

  for (var channel = 0; channel < props.source.length; channel++) {
    var binary_string = Buffer.from(props.source[channel].pixels, 'base64');
    var png = PNG.sync.read(binary_string);

    loadedIms.set(channel, png);

    w = png.width;
    h = png.height;

  }

  var lockIm = false;

  function setBC(value: number, channel: number) {
    if (lockIm)
      return;

    var t1 = Date.now();

    lockIm = true;

    props.source[channel].strength = value;

    // var currentSourceHash = stringToHash(props.source[0].pixels);
    // if (currentSourceHash != existingSourceHash) {
    //   // Todo = Reload image

    //   existingSourceHash = currentSourceHash;

    // }

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

    for (let idx = 0; idx < w * h * 4; idx = idx + 4) {
      var val = 0;
      for (let c = 0; c < loadedIms.size; c++)
        val = val + loadedIms.get(c).data[idx] * props.source[c].strength;
      Imagedata.data[idx] = val;
    }
    for (let idx = 1; idx < w * h * 4; idx = idx + 4) {
      var val = 0;
      for (let c = 0; c < loadedIms.size; c++)
        val = val + loadedIms.get(c).data[idx] * props.source[c].strength;
      Imagedata.data[idx] = val;
    }
    for (let idx = 2; idx < w * h * 4; idx = idx + 4) {
      var val = 0;
      for (let c = 0; c < loadedIms.size; c++)
        val = val + loadedIms.get(c).data[idx] * props.source[c].strength;
      Imagedata.data[idx] = val;
    }

    context?.putImageData(Imagedata, 0, 0);
    (document.getElementById('currim') as HTMLImageElement).src = canvas.toDataURL();

    var t2 = Date.now();

    console.log((t2-t1).toString());
  }

  return (
    <div>
      <Show when={!error()} fallback={<p class="text-red-600">Error loading image</p>}>
        <img
          id="currim"
          src={"data:image/png;base64," + props.source[0].pixels}
          onLoad={() => { setLoading(false); lockIm = false; }}
          alt="image"
          classList={{ 'opacity-10': hide() }}
          class="transition-opacity"
          onError={() => setError(true)}
        />
      </Show>
      <Show when={props.showControls}>
        <For each={props.source}>{(channel) =>
          <input
            class={getChannelClass(channel)}
            style="display:inline"
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