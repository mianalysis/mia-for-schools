import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { Show, createEffect, createSignal, on, onCleanup } from 'solid-js';
import { Overlay } from './Overlay';
import OverlayComponent from './OverlayComponent';
import ZoomSlider from './ZoomSlider';
import ImageControlButton from './ImageControlButton';

interface Props {
  image: any;
  overlays: Function;
  overlaysJSON: OverlayJSON[];
  clickListener: Function | undefined;
}

export enum ControlState {
  MOVE,
  PROBE,
  SELECT,
}

export default function Image(props: Props) {
  var image_context: CanvasRenderingContext2D;
  var panzoom: PanzoomObject;
  var currZoom = 1;
  var currPan = { x: 0, y: 0 };
  var probeEnabled: boolean = false;
  let image_canvas: HTMLCanvasElement;
  let image_region: HTMLDivElement;

  const [showProbeControl, setShowProbeControl] = createSignal(false);
  const [showSelectControl, setShowSelectControl] = createSignal(false);
  const [showZoomControl, setShowZoomControl] = createSignal(false);
  const [controlState, setControlState] = createSignal<ControlState>(ControlState.PROBE);
  const [zoomControl, setZoomControl] = createSignal<PanzoomObject>();
  const [probeVisible, setProbeVisible] = createSignal(false);
  const [overlay, setOverlay] = createSignal<Overlay>();

  createEffect(
    on(
      () => props.image,
      () => {
        (async () => {
          const imageJSON: ImageJSON = JSON.parse(await (await props.image.getImage()).toString());

          setShowProbeControl(imageJSON.showprobecontrol);
          setShowSelectControl(imageJSON.showselectcontrol);
          setShowZoomControl(imageJSON.showzoomcontrol);
          
        })();

        image_canvas.width = 512;
        image_canvas.height = 512;
        image_context = image_canvas.getContext('2d', { willReadFrequently: false })!;
        image_context.imageSmoothingEnabled = false;

        if (image_context == undefined) return;

        image_context.clearRect(0, 0, image_canvas.width, image_canvas.height);

        const imageData = image_context.createImageData(image_canvas.width, image_canvas.height);
        const rgba = imageData.data;

        for (let i = 0; i < props.image.reds.length; i++) {
          const j = i * 4;
          rgba[j] = props.image.reds[i] & 0xff;
          rgba[j + 1] = props.image.greens[i] & 0xff;
          rgba[j + 2] = props.image.blues[i] & 0xff;
          rgba[j + 3] = 255;
        }

        image_context.putImageData(imageData, 0, 0);

        var image_panel = document.getElementById('image_panel') as HTMLElement;
        var panelWidth = image_panel.clientWidth;
        image_region.style.width = `${panelWidth}px`;
        image_region.style.height = `${panelWidth}px`;
        image_canvas.style.width = `${panelWidth}px`;
        image_canvas.style.height = `${panelWidth}px`;

        panzoom = Panzoom(image_region!, {
          maxScale: 10,
          contain: 'outside',
          roundPixels: false,
        });
        panzoom.zoom(currZoom);
        panzoom.pan(currPan.x, currPan.y);
        image_region?.parentElement?.addEventListener('click', updatePan);
        setZoomControl(panzoom);

        setControlStateByName(props.image.defaultcontrol);

        if (props.overlaysJSON != undefined) {
          if (overlay() == undefined) setOverlay(new Overlay(panelWidth));
          else overlay().drawOverlay(props.overlaysJSON);
        } else {
          setOverlay(undefined);
        }
      }
    )
  );

  createEffect(() => {
    const listener = props.clickListener();

    if (listener)
      image_region.addEventListener('pointerup', (e) => {
        if (controlState() === ControlState.SELECT) props.clickListener().onClick(getPosition(e));
      });

    onCleanup(() =>
      image_region?.removeEventListener('pointerup', (e) => {
        if (controlState() === ControlState.SELECT) props.clickListener().onClick(getPosition(e));
      })
    );
  });

  createEffect(() => {
    switch (controlState()) {
      case ControlState.MOVE:
        probeEnabled = false;
        zoomControl().setOptions({ disablePan: false, cursor: 'move' });
        break;
      case ControlState.PROBE:
        probeEnabled = true;
        zoomControl().setOptions({ disablePan: true, cursor: 'crosshair' });
        break;
      case ControlState.SELECT:
        probeEnabled = false;
        zoomControl().setOptions({ disablePan: true, cursor: 'crosshair' });
        break;
    }
  });

  createEffect(() => {
    if (props.overlays()) {
      if (props.overlaysJSON != undefined) {
        if (overlay() == undefined) {
          var image_panel = document.getElementById('image_panel') as HTMLElement;
          var panelWidth = image_panel.clientWidth;
          setOverlay(new Overlay(panelWidth));
        } else if (overlay().overlay_canvas != undefined) overlay().drawOverlay(props.overlaysJSON);
      }
    }
  });

  function setControlStateByName(newControlState: string) {
    switch (newControlState) {
      case 'Move':
        setControlState(ControlState.MOVE);
        break;
      case 'Probe':
        setControlState(ControlState.PROBE);
        break;
      case 'Select':
        setControlState(ControlState.SELECT);
        break;
    }
  }

  function updateZoom(zoomFactor: number) {
    // var val = parseFloat(event.value)
    zoomControl()?.zoom(zoomFactor);
    currZoom = zoomFactor;
  }

  function updatePan() {
    currPan.x = zoomControl()?.getPan().x!;
    currPan.y = zoomControl()?.getPan().y!;
  }

  function updateProbe(event: PointerEvent) {
    if (!probeVisible()) return;
    var probe = document.getElementById('probe');
    if (event.pointerType === 'touch') {
      probe.style.left = (event.clientX - probe.clientWidth / 2).toString() + 'px';
      probe.style.top = (event.clientY - probe.clientHeight - 10).toString() + 'px';
    } else {
      probe.style.left = (event.clientX + 10).toString() + 'px';
      probe.style.top = (event.clientY + 10).toString() + 'px';
    }
    var [x, y] = getPosition(event);
    var pixels = image_context.getImageData(x, y, 1, 1).data;
    var probeText = document.getElementById('probe_text');
    probeText.innerHTML =
      '<div class=text-xl>' +
      '<b><span class="text-red-500">Red: ' +
      Math.round(pixels[0]/2.55) +
      '</span><br><span class="text-green-500">Green: ' +
      Math.round(pixels[1]/2.55) +
      '</span><br><span class="text-blue-500">Blue: ' +
      Math.round(pixels[2]/2.55) +
      '</span></b></div>';
    var colourCell = document.getElementById('colour_cell');
    colourCell.style.background = 'rgb(' + pixels[0] + ',' + pixels[1] + ',' + pixels[2] + ')';
  }

  function getPosition(event: PointerEvent) {
    var zoom = zoomControl()?.getScale();
    var imagePanel = document.getElementById('image_panel');
    var w = image_canvas.width;
    var h = image_canvas.height;
    var scale = w / imagePanel.clientWidth; // Scale is the same in X and Y
    var imX = (event.pageX - imagePanel.offsetLeft) * scale;
    var imY = (event.pageY - imagePanel.offsetTop) * scale;
    var x = (w - w / zoom) / 2 + imX / zoom - zoomControl()?.getPan().x;
    var y = (h - h / zoom) / 2 + imY / zoom - zoomControl()?.getPan().y;

    return [x, y];

  }

  return (
    <div id="image_panel" class="flex flex-col ">
      <Show when={probeVisible()}>
        <div
          id="probe"
          class="absolute flex items-center rounded-2xl overflow-visible shadow-lg bg-white p-2 z-20"
        >
          <div
            id="colour_cell"
            class="relative inline float-left rounded-xl w-6 h-20 mr-2 border-2 border-black animate-in fade-in z-10"
          />
          <div id="probe_text" class="inline text-left" />
        </div>
      </Show>

      <div
        class="relative flex-none rounded-2xl overflow-visible shadow-lg animate-in fade-in duration-1000 ease-in-out"
      >
        <div class="absolute left-0 group flex w-full ml-2 pr-2 z-10">
          <Show when={showProbeControl()}>
            <ImageControlButton
              thisControlState={ControlState.PROBE}
              iconPath="./images/target.svg"
              controlState={controlState}
              setControlState={setControlState}
            />
          </Show>
          <Show when={showSelectControl()}>
            <ImageControlButton
              thisControlState={ControlState.SELECT}
              iconPath="./images/select.svg"
              controlState={controlState}
              setControlState={setControlState}
            />
          </Show>
          <Show when={showZoomControl()}>
            <ImageControlButton
              thisControlState={ControlState.MOVE}
              iconPath="./images/move.svg"
              controlState={controlState}
              setControlState={setControlState}
            />
            <ZoomSlider updateZoom={updateZoom}></ZoomSlider>
          </Show>
        </div>

        <div
          class="absolute left-0 group flex w-full ml-2 pr-2 z-20"
        ></div>

        <div
          ref={image_region}
          class="relative w-full h-auto animate-in"
          onpointerenter={() => setProbeVisible(true && probeEnabled)}
          onpointerleave={() => setProbeVisible(false)}
          onpointermove={(e) => updateProbe(e)}
        >
          <canvas ref={image_canvas} class="absolute cursor-default"/>
          <Show when={overlay()}>
            <OverlayComponent overlay={overlay()} overlays={props.overlaysJSON}></OverlayComponent>
          </Show>
        </div>
      </div>
      <div class="flex ml-4 mr-4"></div>
    </div>
  );
}
