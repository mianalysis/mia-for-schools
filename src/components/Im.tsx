import { For, Show, createEffect, createSignal, on } from 'solid-js';
import CompositeImage from './CompositeImage';
import BrightnessStore from './BrightnessStore';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';

interface Props {
  image: ImageJSON;
  loading?: boolean;
  callback: Function
}

export default function Im(props: Props) {
  var compositeIm: CompositeImage
  var canvas: HTMLCanvasElement
  var context: CanvasRenderingContext2D
  var currZoom = 1;
  var currPan = { x: 0, y: 0 };

  const [zoomControls, setZoomControls] = createSignal<PanzoomObject>();

  createEffect(
    on(
      () => props.image,
      () => {
        // Checking if this has already got assigned brightness values
        if (BrightnessStore.values.has(props.image.name))
          BrightnessStore.updateChannelsJSON(props.image.name, props.image.channels)
        else
          BrightnessStore.addNewValues(props.image.name, props.image.channels)

        canvas = (document.getElementById('image_canvas') as HTMLCanvasElement);
        canvas.width = 512;
        canvas.height = 512;
        context = canvas.getContext("2d", { willReadFrequently: false })!;
        context.imageSmoothingEnabled = false;

        if (context == undefined)
          return;

        context.clearRect(0, 0, canvas.width, canvas.height)

        var new_im = new Image()
        compositeIm = new CompositeImage(props.image.channels);
        new_im.src = 'data:image/png;base64,' + compositeIm.getAsPNG()
        new_im.onload = function () { context.drawImage(new_im, 0, 0) }

        const panzoom = Panzoom(canvas!, { maxScale: 10, contain: "outside", roundPixels: false })
        panzoom.zoom(currZoom)
        panzoom.pan(currPan.x, currPan.y)
        canvas?.parentElement?.addEventListener('click', updatePan)
        setZoomControls(panzoom)

      }
    )
  );

  // const hide = () => props.loading || loading();

  function updateBC(value: number, channel: number) {
    BrightnessStore.updateValue(props.image.name, channel, value)

    var imagedata = context?.getImageData(0, 0, compositeIm.getWidth(), compositeIm.getHeight())!;
    if (imagedata == null)
      return;

    compositeIm.setChannelBrightness(imagedata, channel, value)
    context?.putImageData(imagedata, 0, 0);

    props.callback({ labels: ['Red', 'Green', 'Blue'], datasets: [{ label: 'Channels', data: [compositeIm.getChannelSum(0), compositeIm.getChannelSum(1), compositeIm.getChannelSum(2)], borderWidth: 1 }] });

  }

  function updateZoom(event: HTMLInputElement) {
    // Setting zoom value
    var val = parseFloat(event.value)
    zoomControls()?.zoom(val);
    currZoom = val
  }

  function updatePan() {
    console.log(zoomControls()?.getPan().x!)
    currPan.x = zoomControls()?.getPan().x!
    currPan.y = zoomControls()?.getPan().y!
  }

  return (
    <div>
      <div>
        <canvas id="image_canvas" width={512} height={512}></canvas>
      </div>
      <div>
        <Show when={props.image.showcontrols}>
          <For each={props.image.channels}>{(channel) =>
            <input
              id="channel-slider"
              class="range h-8 w-24 m-2 rounded-full appearance-none"
              style={"background: rgb(" + channel.red / 2 + "," + channel.green / 2 + "," + channel.blue / 2 + "); -webkit-filter: grayscale(0);"}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={BrightnessStore.hasValue(props.image.name, channel.index) ? BrightnessStore.getValue(props.image.name, channel.index) : channel.strength}
              oninput={(e) => updateBC(parseFloat((e.target as HTMLInputElement).value), channel.index)}
            />
          }
          </For>
        </Show>
      </div>
      <div>
        <Show when={zoomControls()}>
          <div class="container m-auto flex ">
            <img class="flex-none ml-4 mt-2 h-8" src="/images/zoom-svgrepo-com.svg" />
            <input
              class="flex-initial range h-8 m-2 w-full rounded-full bg-gray-400 appearance-none"
              type="range"
              min="1"
              max="10"
              step="0.1"
              value="1"
              oninput={(e) => updateZoom(e.target as HTMLInputElement)}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}