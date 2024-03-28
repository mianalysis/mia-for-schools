import { Show, createEffect, createSignal, on } from 'solid-js';

interface Props {
  source: string;
  loading?: boolean;
  showControls: boolean
}

function stringToHash(string: String) {
  return string.split('').reduce((hash, char) => {
      return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0);
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

  var existingSourceHash = stringToHash(props.source);
  var rawImagedata: ImageData | null | undefined = undefined;
  var rawIm = new Image();
  rawIm.src = props.source;

  var lockIm = false;

  function setBC(value: number, channel: number) {
    if (lockIm)
      return;

    lockIm = true;

    var currentSourceHash = stringToHash(props.source);
    if (currentSourceHash != existingSourceHash) {
      rawIm.src = props.source;
      var rawCanvas = document.createElement('canvas');
      rawCanvas.width = rawIm.width;
      rawCanvas.height = rawIm.height;
      var rawContext = rawCanvas.getContext('2d');
      rawContext?.drawImage(rawIm, 0, 0);  
      rawImagedata = rawContext?.getImageData(0, 0, rawIm.width, rawIm.height);
      existingSourceHash = currentSourceHash;
    }

    const currim = document.getElementById('currim') as HTMLImageElement;
    if (currim == null)
      return;

    var canvas = document.createElement('canvas');
    canvas.width = rawIm.width;
    canvas.height = rawIm.height;

    const context = canvas.getContext('2d');
    context?.drawImage(currim, 0, 0);

    var Imagedata = context?.getImageData(0, 0, rawIm.width, rawIm.height);
    if (Imagedata == null)
      return;

    if (rawImagedata == null)
      return;

    for (let idx = channel; idx < rawIm.width * rawIm.height * 4; idx = idx + 4)
      Imagedata.data[idx] = rawImagedata?.data[idx] * value;

    context?.putImageData(Imagedata, 0, 0);
    (document.getElementById('currim') as HTMLImageElement).src = canvas.toDataURL();

  }

  return (
    <div>
      <Show when={!error()} fallback={<p class="text-red-600">Error loading image</p>}>
        <img
          id="currim"
          src={props.source}
          onLoad={() => { setLoading(false); lockIm = false; }}
          alt="image"
          classList={{ 'opacity-10': hide() }}
          class="transition-opacity"
          onError={() => setError(true)}
        />
      </Show>
      <Show when={props.showControls}>
        <input
          class="range h-8 w-32 m-2 rounded-full bg-red-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), 0)}
        />
        <input
          class="range h-8 w-32 mt-2 mr-2 rounded-full bg-green-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), 1)}
        />
        <input
          class="range h-8 w-32 mr-2 rounded-full bg-blue-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1.0}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), 2)}
        />
      </Show>
    </div>
  );
}