import { For, Show, createEffect, createSignal, on } from 'solid-js';
import CompositeImage from './CompositeImage';
import BrightnessStore from './BrightnessStore';

interface Props {
  image: ImageJSON;
  loading?: boolean;
}


export default function Im(props: Props) {
  var compositeIm: CompositeImage
  var lockIm = false;

  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(false);

  createEffect(
    on(
      () => props.image,
      () => {
        // Checking if this has already got assigned brightness values
        if (BrightnessStore.values.has(props.image.name))
          BrightnessStore.updateChannelsJSON(props.image.name, props.image.channels)          
        else
          BrightnessStore.addNewValues(props.image.name, props.image.channels)

        setLoading(false);
        compositeIm = new CompositeImage(props.image.channels);
        (document.getElementById('currim') as HTMLImageElement).src = "data:image/png;base64," + compositeIm.getAsPNG();

      }
    )
  );

  const hide = () => props.loading || loading();

  function setBC(value: number, channel: number) {
    if (lockIm)
      return;

    lockIm = true;

    BrightnessStore.updateValue(props.image.name, channel, value)

    const currim = document.getElementById('currim') as HTMLImageElement;
    if (currim == null)
      return;

    var canvas = document.createElement('canvas');
    canvas.width = compositeIm.getWidth();
    canvas.height = compositeIm.getHeight();

    const context = canvas.getContext('2d');
    context?.drawImage(currim, 0, 0);

    var imagedata = context?.getImageData(0, 0, compositeIm.getWidth(), compositeIm.getHeight());
    if (imagedata == null)
      return;

    compositeIm.setChannelBrightness(channel, value)
    compositeIm.updateImagedata(imagedata, channel)

    context?.putImageData(imagedata, 0, 0);
    (document.getElementById('currim') as HTMLImageElement).src = canvas.toDataURL();

  }

  return (
    <div>
      <Show when={!error()} fallback={<p class="text-red-600">Error loading image</p>}>
        <img
          id="currim"
          onLoad={() => { setLoading(false); lockIm = false; }}
          alt="image"
          classList={{ 'opacity-10': hide() }}
          class="transition-opacity"
          onError={() => setError(true)}
        />
      </Show>
      <Show when={props.image.showcontrols}>
        <For each={props.image.channels}>{(channel) =>
          <input
            class="range h-8 w-32 m-2 rounded-full appearance-none"
            style={"background: rgb(" + channel.red + "," + channel.green + "," + channel.blue + "); -webkit-filter: grayscale(0.2);"}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={BrightnessStore.hasValue(props.image.name, channel.index) ? BrightnessStore.getValue(props.image.name, channel.index) : channel.strength}
            oninput={(e) => setBC(parseFloat((e.target as HTMLInputElement).value), channel.index)}
          />
        }
        </For>
      </Show>
    </div>
  );
}