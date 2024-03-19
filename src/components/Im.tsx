import { Show, createEffect, createSignal, on } from 'solid-js';

interface Props {
  source: string;
  loading?: boolean;
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
  rawIm.src = props.source;
  var rawCanvas = document.createElement('canvas');
  rawCanvas.width = rawIm.width;
  rawCanvas.height = rawIm.height;
  var rawContext = rawCanvas.getContext('2d');
  rawContext?.drawImage(rawIm, 0, 0);
  var rawImagedata = rawContext?.getImageData(0,0,rawCanvas.width,rawCanvas.height);

  var lockBC = false;

  function setBC(value: number, channel: number) {
    if (lockBC)
      return;
    
    lockBC = true;
    const currim = document.getElementById('currim') as HTMLImageElement;
    if (currim == null) 
      return;

    var canvas = document.createElement('canvas');
    canvas.width = currim.width;
    canvas.height = currim.height;

    const context = canvas.getContext('2d');
    context?.drawImage(currim, 0, 0);

    var Imagedata = context?.getImageData(0,0,canvas.width,canvas.height);  
    if (Imagedata == null)
      return;

    if (rawImagedata ==null)
      return;

    for (let idx=channel;idx<Imagedata.width*Imagedata.height*4;idx=idx+4)
      Imagedata.data[idx] = rawImagedata?.data[idx]*value;
    
    context?.putImageData(Imagedata,0,0);
    (document.getElementById('currim') as HTMLImageElement).src = canvas.toDataURL();

  }
  
  return (
    <Show when={!error()} fallback={<p class="text-red-600">Error loading image</p>}>
      <div>
        <img
          id="currim"
          src={props.source}
          onLoad={() => {setLoading(false); lockBC = false;}}
          alt="image"
          classList={{ 'opacity-10': hide() }}
          class="transition-opacity"
          onError={() => setError(true)}
        />
        <input
          class="range h-8 w-32 m-2 rounded-full bg-red-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value),0)} 
        />
        <input
          class="range h-8 w-32 mt-2 mr-2 rounded-full bg-green-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value),1)} 
        />
        <input
          class="range h-8 w-32 mr-2 rounded-full bg-blue-400 appearance-none"
          style="display:inline"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={1}
          oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value),2)} 
        />
      </div>
    </Show>
  );
}

// function setBC() {
  // var im = new Image();
  // im.src = `data:${response.headers['Content-Type']};base64,${resultJSON.image}`;
  // var canvas = document.getElementById('canvas');
  // var canvas = document.createElement('canvas');
  // canvas.width = 32;
  // canvas.height = 32;
  
  // var context = canvas.getContext('2d');
  // context?.drawImage(im, 0, 0);

  // var Imagedata = context?.getImageData(0,0,32,32);

  // console.log(canvas.toDataURL());
  // if (Imagedata != null) {
  //   Imagedata.data[1] = 255;
  //   context?.putImageData(Imagedata,0,0);
  // }

  // console.log(canvas.toDataURL());

  // setImageSource(canvas.toDataURL());
// }        