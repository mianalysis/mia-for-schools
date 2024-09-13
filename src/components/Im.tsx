import { For, Show, createEffect, createSignal, on } from 'solid-js';
import CompositeImage from './CompositeImage';
import BrightnessStore from './BrightnessStore';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { rgbToHex } from '../lib/util';

interface Props {
  image: ImageJSON;
  loading?: boolean;
  graph: GraphJSON;
  setGraph: Function
}

enum ControlState {
  MOVE, PROBE
}

export default function Im(props: Props) {
  var compositeIm: CompositeImage
  var canvas: HTMLCanvasElement
  var context: CanvasRenderingContext2D
  var panzoom: PanzoomObject
  var currZoom = 1;
  var currPan = { x: 0, y: 0 };
  var controlState = ControlState.MOVE;
  var probeEnabled: boolean = false;

  const [zoomControls, setZoomControls] = createSignal<PanzoomObject>();
  const [probeVisible, setProbeVisible] = createSignal(false);

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

        panzoom = Panzoom(canvas!, { maxScale: 10, contain: "outside", roundPixels: false })
        panzoom.zoom(currZoom)
        panzoom.pan(currPan.x, currPan.y)
        canvas?.parentElement?.addEventListener('click', updatePan)
        setZoomControls(panzoom)
        setControlState(controlState)

        if (props.setGraph != undefined && props.graph != undefined) {
          if (props.graph.source === "Channel components")
            props.graph.data = getChannelComponentsDataJSON();
          else if (props.graph.source === "Image intensity histogram")
            props.graph.data = getImageIntensityHistogramDataJSON();

          // SolidJS seems to only update if object itself changes
          var newGraph: GraphJSON = { source: props.graph.source, data: props.graph.data, type: props.graph.type, showDataLabels: props.graph.showDataLabels };
          props.setGraph(newGraph);

        }
      }
    )
  );

  function getChannelComponentsDataJSON() {
    var dataJSON: DataJSON = { labels: [], datasets: [] };

    for (var cIdx = 0; cIdx < props.image.channels.length; cIdx++) {
      var channel = props.image.channels[cIdx];

      dataJSON.labels.push('Channel ' + (cIdx + 1))

      if (dataJSON.datasets.length == 0)
        dataJSON.datasets.push({ label: "Channels", data: [], backgroundColor: [], borderWidth: 1 });

      dataJSON.datasets[0].data.push(compositeIm.getChannelSum(cIdx));
      dataJSON.datasets[0].backgroundColor.push(rgbToHex(Math.round(3 * channel.red / 4), Math.round(3 * channel.green / 4), Math.round(3 * channel.blue / 4)));

    }

    return dataJSON;

  }

  function getImageIntensityHistogramDataJSON() {
    var numberOfBins = 12;
    var labels = [];
    for (let i = 0; i < numberOfBins; i++)
      labels.push(Math.floor(i * 256 / numberOfBins));

    var dataJSON: DataJSON = { labels: labels, datasets: [] };

    for (var cIdx = 0; cIdx < props.image.channels.length; cIdx++) {
      var channel = props.image.channels[cIdx];

      var histData = compositeIm.getHistogram(cIdx, numberOfBins);
      var backgroundColour = []
      var hex = rgbToHex(Math.round(3 * channel.red / 4), Math.round(3 * channel.green / 4), Math.round(3 * channel.blue / 4));
      for (let i = 0; i < numberOfBins; i++)
        backgroundColour.push(hex);

      var datasetJSON: DatasetJSON = { label: 'Channel ' + (cIdx + 1), data: histData, backgroundColor: backgroundColour, borderWidth: 1 };
      dataJSON.datasets.push(datasetJSON);

    }

    return dataJSON;

  }

  function updateBC(value: number, channel: number) {
    BrightnessStore.updateValue(props.image.name, channel, value)

    var imagedata = context?.getImageData(0, 0, compositeIm.getWidth(), compositeIm.getHeight())!;
    if (imagedata == null)
      return;

    compositeIm.setChannelBrightness(imagedata, channel, value)
    context?.putImageData(imagedata, 0, 0);

    if (props.setGraph != undefined && props.graph != undefined) {
      if (props.graph.source === "Channel components")
        props.graph.data = getChannelComponentsDataJSON();
      else if (props.graph.source === "Image intensity histogram")
        props.graph.data = getImageIntensityHistogramDataJSON();

      // SolidJS seems to only update if object itself changes
      var newGraph: GraphJSON = { source: props.graph.source, data: props.graph.data, type: props.graph.type, showDataLabels: props.graph.showDataLabels };
      props.setGraph(newGraph);

    }
  }

  function updateZoom(event: HTMLInputElement) {
    var val = parseFloat(event.value)
    zoomControls()?.zoom(val);
    currZoom = val
  }

  function updatePan() {
    currPan.x = zoomControls()?.getPan().x!
    currPan.y = zoomControls()?.getPan().y!
  }

  function updateProbe(event: PointerEvent) {
    if (!probeVisible())
      return;

    var probe = document.getElementById("probe");
    if (event.pointerType === "touch") {
        probe.style.left = (event.clientX - probe.clientWidth / 2).toString() + 'px';
        probe.style.top = (event.clientY - probe.clientHeight - 10).toString() + 'px';
    } else {
        probe.style.left = (event.clientX + 10).toString() + 'px';
        probe.style.top = (event.clientY + 10).toString() + 'px';
    }

    var zoom = zoomControls()?.getScale();
    var imagePanel = document.getElementById("image_panel");
    var w = canvas.width;
    var h = canvas.height;
    var scale = w / imagePanel.clientWidth; // Scale is the same in X and Y
    var imX = (event.pageX - imagePanel.offsetLeft) * scale;
    var imY = (event.pageY - imagePanel.offsetTop) * scale;
    var x = ((w - (w / zoom)) / 2) + (imX / zoom) - zoomControls()?.getPan().x;
    var y = ((h - (h / zoom)) / 2) + (imY / zoom) - zoomControls()?.getPan().y;
    var pixels = context.getImageData(x, y, 1, 1).data;
    var probeText = document.getElementById("probe_text");
    var r = props.image.channels[0].red
    var g = props.image.channels[0].green
    var b = props.image.channels[0].blue

    if (props.image.channels.length == 1 && r == g && r == b)
        probeText.innerText = "Value = " + pixels[0];
    else
        probeText.innerText = "Red = " + pixels[0] + ", green = " + pixels[1] + ", blue = " + pixels[2];
    
    var colourCell = document.getElementById("colour_cell");
    colourCell.style.background = "rgb(" + pixels[0] + "," + pixels[1] + "," + pixels[2] + ")";

}

  function setControlState(newControlState: ControlState) {
    controlState = newControlState;

    var probeRadio = document.getElementById("probe_radio") as HTMLButtonElement;
    var moveRadio = document.getElementById("move_radio") as HTMLButtonElement;

    switch (controlState) {
      case ControlState.MOVE:
        probeEnabled = false;
        zoomControls().setOptions({disablePan:false, cursor:'move'});
        if (!moveRadio.classList.contains("button-selected"))
          moveRadio.classList.toggle("button-selected");
        if (probeRadio.classList.contains("button-selected"))
          probeRadio.classList.toggle("button-selected");
        break;
      case ControlState.PROBE:
        probeEnabled = true;
        zoomControls().setOptions({disablePan:true, cursor:'crosshair'});
        if (!probeRadio.classList.contains("button-selected"))
          probeRadio.classList.toggle("button-selected");
        if (moveRadio.classList.contains("button-selected"))
          moveRadio.classList.toggle("button-selected");
        break;
    }
  }

  return (
    <div id="image_panel" class="flex flex-col">
      <Show when={probeVisible()}>
        <div id="probe" class="rounded-lg overflow-hidden shadow-lg bg-white p-2" style="position: absolute; z-index: 97">
          <div id="colour_cell" class="rounded-full w-6 h-6 mr-2 border-2 border-black animate-in fade-in" style="position: relative; z-index: 98; display: inline; float:left" />
          <div id="probe_text" style="display:inline; float:right" />
        </div>
      </Show>
      <div class="flex-none max-w-lg rounded-lg overflow-hidden shadow-lg bg-white" style="position:relative">
        <div style="position: absolute; left: 0; z-index: 99" class="group">
          <button id="probe_radio" class="rounded-lg overflow-hidden shadow-lg bg-white disabled:bg-red-500 opacity-40 group-hover:opacity-100 w-8 h-8 m-2 p-0 border-0 transition duration-150 ease-in-out hover:scale-110" onclick={() => setControlState(ControlState.PROBE)}>
            <img class="h-6 w-6 m-1" src="/images/target.svg" />
          </button>
          <button id="move_radio" class="button-selected rounded-lg overflow-hidden shadow-lg bg-white opacity-40 group-hover:opacity-100 w-8 h-8 m-2 ml-0 p-0 border-0 transition duration-150 ease-in-out hover:scale-110" onclick={() => setControlState(ControlState.MOVE)}>
            <img class="h-6 w-6 m-1" src="/images/move.svg" />
          </button>
        </div>
        <canvas id="image_canvas" class="cursor-default" width={512} height={512} onpointerenter={() => setProbeVisible(true && probeEnabled)} onpointerleave={() => setProbeVisible(false)} onpointermove={e => updateProbe(e)} />
      </div>
      <div class="flex-1 max-w-lg rounded-lg overflow-hidden shadow-lg bg-white mt-4 animate-in fade-in duration-500">
        <div>
          <Show when={props.image.showcontrols}>
            <For each={props.image.channels}>{(channel) =>
              <input
                id="channel-slider"
                class="range h-8 w-24 ml-4 mr-4 mt-4 rounded-full appearance-none"
                style={"background: rgb(" + 3 * channel.red / 4 + "," + 3 * channel.green / 4 + "," + 3 * channel.blue / 4 + "); -webkit-filter: grayscale(0);"}
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
              <img class="flex-none ml-4 mt-4 h-8" src="/images/zoom-svgrepo-com.svg" />
              <input
                class="flex-initial range h-8 m-4 w-full rounded-full bg-gray-400 appearance-none"
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
    </div>
  );
}