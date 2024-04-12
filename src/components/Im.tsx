import { Show, createEffect, createSignal, on } from 'solid-js';

interface Props {
  source: [ChannelJSON];
  loading?: boolean;
  showControls: boolean
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

  var rawIm = new Image();
  rawIm.width = 5;
  rawIm.height = 5;

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
      for (let idx = 0; idx < rawIm.width * rawIm.height * 4; idx = idx + 4)
          Imagedata.data[idx] = idx;

        context?.putImageData(Imagedata, 0, 0);
    (document.getElementById('currim') as HTMLImageElement).src = canvas.toDataURL();


  // rawIm.src = props.source[0].pixels;

  // Loading images
  // var loadedIms = new Map();
  // for (var channel = 0; channel < props.source.length; channel++) {
  //   var channelIm = new Image();
  //   // channelIm.src = props.source[channel].pixels;
  //   var channelCanvas = document.createElement('canvas');
  //   channelCanvas.width = rawIm.width;
  //   channelCanvas.height = rawIm.height;
  //   var channelContext = channelCanvas.getContext('2d', { willReadFrequently: false });
  //   channelContext?.drawImage(channelIm, 0, 0);
  //   var channelImagedata = channelContext?.getImageData(0, 0, rawIm.width, rawIm.height);
  //   loadedIms.set(channel,channelImagedata);
  //   console.log(channelIm.src);

  // }

  var lockIm = false;

  // function stringToHash(string: String) {
  //   return string.split('').reduce((hash, char) => {
  //     return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  //   }, 0);
  // }

  // function redrawImage() {
  //   if (lockIm)
  //     return;

  //   lockIm = true;

  //   // Getting current image as a canvas
  //   const currim = document.getElementById('currim') as HTMLImageElement;
  //   if (currim == null)
  //     return;

  //   var canvas = document.createElement('canvas');
  //   canvas.width = rawIm.width;
  //   canvas.height = rawIm.height;
  //   const context = canvas.getContext('2d');
  //   context?.drawImage(currim, 0, 0);

  //   var Imagedata = context?.getImageData(0, 0, rawIm.width, rawIm.height);
  //   if (Imagedata == null)
  //     return;

  //   for (let idx = 0; idx < rawIm.width * rawIm.height * 4; idx = idx + 4)
  //     Imagedata.data[idx] = 0;
  //   for (let idx = 1; idx < rawIm.width * rawIm.height * 4; idx = idx + 4)
  //     Imagedata.data[idx] = 0;
  //   for (let idx = 2; idx < rawIm.width * rawIm.height * 4; idx = idx + 4)
  //     Imagedata.data[idx] = 0;

  //   // Iterating over each channel, updating the pixel contributions
  //   for (var channel = 0; channel < props.source.length; channel++) {
  //     var value = props.source[channel].strength;

  //     // rawIm.src = props.source[channel].pixels;

  //     var rawImagedata = loadedIms.get(channel);
  //     console.log(rawImagedata);
  //     if (rawImagedata == null)
  //       return;

  //     // Red contribution
  //     var redFraction = props.source[channel].reds[255];
  //     if (redFraction < 0)
  //       redFraction = redFraction + 256;
  //     redFraction = value * redFraction / 255;
  //     for (let idx = 0; idx < rawIm.width * rawIm.height * 4; idx = idx + 4) 
  //       Imagedata.data[idx] = Imagedata.data[idx] + rawImagedata?.data[idx] * redFraction;

  //     var greenFraction = props.source[channel].greens[255];
  //     if (greenFraction < 0)
  //       greenFraction = greenFraction + 256;
  //     greenFraction = value*greenFraction / 255;
  //     for (let idx = 1; idx < rawIm.width * rawIm.height * 4; idx = idx + 4)
  //       Imagedata.data[idx] = Imagedata.data[idx] + rawImagedata?.data[idx] * greenFraction;

  //     var blueFraction = props.source[channel].blues[255];
  //     if (blueFraction < 0)
  //       blueFraction = blueFraction + 256;
  //     blueFraction = value*blueFraction / 255;
  //     for (let idx = 2; idx < rawIm.width * rawIm.height * 4; idx = idx + 4)
  //       Imagedata.data[idx] = Imagedata.data[idx] + rawImagedata?.data[idx] * blueFraction;

  //     // console.log("Ch " + channel + " R" + redFraction + " G" + greenFraction + " B" + blueFraction);

  //   }

  //   context?.putImageData(Imagedata, 0, 0);
  //   (document.getElementById('currim') as HTMLImageElement).src = canvas.toDataURL();

  // }

  // function setBC(value: number, channel: number) {
  //   props.source[channel].strength = value;
  //   redrawImage();

  // }

  return (
    <div>
      <Show when={!error()} fallback={<p class="text-red-600">Error loading image</p>}>
        <img
          id="currim"
          src={props.source[0].pixels}
          onLoad={() => { setLoading(false); lockIm = false; }}
          alt="image"
          classList={{ 'opacity-10': hide() }}
          class="transition-opacity"
          onError={() => setError(true)}
        />
      </Show>
      {/* <Show when={props.showControls}>
        <input
          class="colour-range range h-8 w-32 m-2 rounded-full bg-red-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), 0)}
        />
        <input
          class="colour-range range h-8 w-32 mt-2 mr-2 rounded-full bg-green-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), 1)}
        />
        <input
          class="colour-range range h-8 w-32 mr-2 rounded-full bg-blue-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1.0}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), 2)}
        />
      </Show> */}
    </div>
  );
}