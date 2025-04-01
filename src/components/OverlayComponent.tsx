import { onMount } from 'solid-js';
import { Overlay } from './Overlay';

interface Props {
  overlay: Overlay;
  overlays: OverlayJSON[];
}

export default function OverlayComponent(props: Props) {
  onMount(() => {
    props.overlay.initialise();
    props.overlay.drawOverlay(props.overlays);
  });

  return props.overlay.render();
}
