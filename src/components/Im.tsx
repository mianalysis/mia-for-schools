import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { For, Show, createEffect, createSignal, on, onCleanup } from 'solid-js';
import { store } from '../lib/store';
import { rgbToHex } from '../lib/util';
import BrightnessStore from './BrightnessStore';
import CompositeImage from './CompositeImage';
import { Overlay } from './Overlay';
import OverlayComponent from './OverlayComponent';

interface Props {
  image: ImageJSON;
  channelControls: boolean;
  graphJSON: GraphJSON;
  graph: Function;
  setGraph: Function;
  overlays: OverlayJSON[];
  clickListener: Function | undefined;
}

enum ControlState {
  MOVE, PROBE, SELECT
}

export default function Im(props: Props) {
  var compositeIm: CompositeImage
  var image_context: CanvasRenderingContext2D
  var panzoom: PanzoomObject
  var currZoom = 1
  var currPan = { x: 0, y: 0 }
  var controlState = ControlState.MOVE
  var probeEnabled: boolean = false
  let image_canvas: HTMLCanvasElement
  let image_region: HTMLDivElement

  const [zoomControls, setZoomControls] = createSignal<PanzoomObject>();
  const [probeVisible, setProbeVisible] = createSignal(false);
  const [overlay, setOverlay] = createSignal<Overlay>();

  createEffect(
    on(
      () => props.image,
      () => {
        if (props.image.channels.length) {
          // Checking if this has already got assigned brightness values
          if (BrightnessStore.values.has(props.image.name))
            BrightnessStore.updateChannelsJSON(props.image.name, props.image.channels)
          else
            BrightnessStore.addNewValues(props.image.name, props.image.channels)

          image_canvas.width = 512;
          image_canvas.height = 512;
          image_context = image_canvas.getContext("2d", { willReadFrequently: false })!;
          image_context.imageSmoothingEnabled = false;

          if (image_context == undefined)
            return;

          image_context.clearRect(0, 0, image_canvas.width, image_canvas.height)

          var new_im = new Image()
          compositeIm = new CompositeImage(props.image.channels);
          new_im.src = 'data:image/png;base64,' + compositeIm.getAsPNG()
          new_im.onload = function () { image_context.drawImage(new_im, 0, 0) }

          var image_panel = (document.getElementById('image_panel') as HTMLElement);
          var panelWidth = image_panel.clientWidth;
          image_region.style.width = `${panelWidth}px`;
          image_region.style.height = `${panelWidth}px`;
          image_canvas.style.width = `${panelWidth}px`;
          image_canvas.style.height = `${panelWidth}px`;

          panzoom = Panzoom(image_region!, { maxScale: 10, contain: "outside", roundPixels: false })
          panzoom.zoom(currZoom)
          panzoom.pan(currPan.x, currPan.y)
          image_region?.parentElement?.addEventListener('click', updatePan)
          setZoomControls(panzoom)
          setControlState(controlState)
        }

        if (props.overlays != undefined) {
          if (overlay() == undefined)
            setOverlay(new Overlay(panelWidth))
          else
            overlay().drawOverlay(props.overlays)
        } else {
          setOverlay(undefined)
        }

        if (props.setGraph != undefined && props.graphJSON != undefined) {
          updateGraphJSON()
          updateGraph()
          
        }
      }
    )
  );

  createEffect(
    () => {
      const listener = props.clickListener();

      if (listener)
        image_region.addEventListener("pointerup", (e) => { if (controlState === ControlState.SELECT) props.clickListener().onClick(getPosition(e)) })

      onCleanup(() => image_region?.removeEventListener("pointerup", (e) => { if (controlState === ControlState.SELECT) props.clickListener().onClick(getPosition(e)) }))

    }
  )

  createEffect(
    () => {
      if (props.graph()) {
        if (props.setGraph != undefined && props.graphJSON != undefined) {
          if (props.graphJSON.source === "Channel components")
            props.graphJSON.data = getChannelComponentsDataJSON();
          else if (props.graphJSON.source === "Image intensity histogram")
            props.graphJSON.data = getImageIntensityHistogramDataJSON();
        }
      }
    }
  )

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

    var imagedata = image_context?.getImageData(0, 0, compositeIm.getWidth(), compositeIm.getHeight())!;
    if (imagedata == null)
      return;

    compositeIm.setChannelBrightness(imagedata, channel, value)
    image_context?.putImageData(imagedata, 0, 0);

    if (props.setGraph != undefined && props.graphJSON != undefined) {
      updateGraphJSON()
      updateGraph()
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

    var [x, y] = getPosition(event);
    var pixels = image_context.getImageData(x, y, 1, 1).data;
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

  function getPosition(event: PointerEvent) {
    var zoom = zoomControls()?.getScale();
    var imagePanel = document.getElementById("image_panel");
    var w = image_canvas.width;
    var h = image_canvas.height;
    var scale = w / imagePanel.clientWidth; // Scale is the same in X and Y
    var imX = (event.pageX - imagePanel.offsetLeft) * scale;
    var imY = (event.pageY - imagePanel.offsetTop) * scale;
    var x = ((w - (w / zoom)) / 2) + (imX / zoom) - zoomControls()?.getPan().x;
    var y = ((h - (h / zoom)) / 2) + (imY / zoom) - zoomControls()?.getPan().y;

    return [x, y];

  }

  function setControlState(newControlState: ControlState) {
    controlState = newControlState;

    var probeRadio = document.getElementById("probe_radio") as HTMLButtonElement;
    var moveRadio = document.getElementById("move_radio") as HTMLButtonElement;
    var selectRadio = document.getElementById("select_radio") as HTMLButtonElement;

    switch (controlState) {
      case ControlState.MOVE:
        probeEnabled = false;
        zoomControls().setOptions({ disablePan: false, cursor: 'move' });
        if (!moveRadio.classList.contains("button-selected"))
          moveRadio.classList.toggle("button-selected");
        if (probeRadio.classList.contains("button-selected"))
          probeRadio.classList.toggle("button-selected");
        if (selectRadio.classList.contains("button-selected"))
          selectRadio.classList.toggle("button-selected");
        break;
      case ControlState.PROBE:
        probeEnabled = true;
        zoomControls().setOptions({ disablePan: true, cursor: 'crosshair' });
        if (moveRadio.classList.contains("button-selected"))
          moveRadio.classList.toggle("button-selected");
        if (!probeRadio.classList.contains("button-selected"))
          probeRadio.classList.toggle("button-selected");
        if (selectRadio.classList.contains("button-selected"))
          selectRadio.classList.toggle("button-selected");
        break;
      case ControlState.SELECT:
        probeEnabled = false;
        zoomControls().setOptions({ disablePan: true, cursor: 'crosshair' });
        if (probeRadio.classList.contains("button-selected"))
          probeRadio.classList.toggle("button-selected");
        if (moveRadio.classList.contains("button-selected"))
          moveRadio.classList.toggle("button-selected");
        if (!selectRadio.classList.contains("button-selected"))
          selectRadio.classList.toggle("button-selected");
        break;
    }
  }

  function updateGraphJSON() {
    if (props.graphJSON.source === "Channel components")
      props.graphJSON.data = getChannelComponentsDataJSON();
    else if (props.graphJSON.source === "Image intensity histogram")
      props.graphJSON.data = getImageIntensityHistogramDataJSON();

  }

  function updateGraph() {
    // SolidJS seems to only update if object itself changes
    var newGraph: GraphJSON = { source: props.graphJSON.source, data: props.graphJSON.data, type: props.graphJSON.type, showDataLabels: props.graphJSON.showDataLabels, xlabel: props.graphJSON.xlabel, ylabel: props.graphJSON.ylabel };
    props.setGraph(newGraph);

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
          <button id="select_radio" class="button rounded-lg overflow-hidden shadow-lg bg-white opacity-40 group-hover:opacity-100 w-8 h-8 m-2 ml-0 p-0 border-0 transition duration-150 ease-in-out hover:scale-110" onclick={() => setControlState(ControlState.SELECT)}>
            <img class="h-6 w-6 m-1" src="/images/select.svg" />
          </button>
        </div>

        <div ref={image_region} style="position:relative; width:512px; height:512px" onpointerenter={() => setProbeVisible(true && probeEnabled)} onpointerleave={() => setProbeVisible(false)} onpointermove={e => updateProbe(e)} >
          <canvas ref={image_canvas} class="cursor-default" style="position:absolute; width:100%; height:100%" />
          <Show when={overlay()}>
            <OverlayComponent overlay={overlay()} overlays={props.overlays}></OverlayComponent>
          </Show>
        </div>
      </div>
      <div class="flex-1 max-w-lg rounded-lg overflow-hidden shadow-lg bg-white mt-4 animate-in fade-in duration-500">
        <div>
          <Show when={props.channelControls}>
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
    </div >
  );
}