import { JSX } from 'solid-js';

export class Overlay {
  overlay_canvas: HTMLCanvasElement;
  overlay_context: CanvasRenderingContext2D;
  panelWidth: number;

  constructor(panelWidth: number) {
    this.panelWidth = panelWidth;
  }

  initialise() {
    this.overlay_canvas = document.getElementById('overlay_canvas') as HTMLCanvasElement;

    this.overlay_canvas.style.width = `${this.panelWidth}px`;
    this.overlay_canvas.style.height = `${this.panelWidth}px`;

    if (this.overlay_context != undefined)
      this.overlay_context.clearRect(0, 0, this.overlay_canvas.width, this.overlay_canvas.height);

    this.overlay_canvas = document.getElementById('overlay_canvas') as HTMLCanvasElement;
    var image_panel = document.getElementById('image_panel') as HTMLElement;
    this.overlay_canvas.width = image_panel.clientWidth;
    this.overlay_canvas.height = image_panel.clientHeight;
    this.overlay_context = this.overlay_canvas.getContext('2d', { willReadFrequently: false })!;
    this.overlay_context.imageSmoothingEnabled = false;
  }

  drawRegionOverlay(region: OverlayRegionJSON, overlay_width: number, overlay_height: number) {
    switch (region.renderingmode) {
      case "Fill":
        this.overlay_context.fillStyle = region.fillcolour;
        this.overlay_context.strokeStyle = undefined;
        this.overlay_context.lineWidth = 0;
        break;
      case "Outline":
        this.overlay_context.fillStyle = undefined;
        this.overlay_context.strokeStyle = region.strokecolour;
        this.overlay_context.lineWidth = region.linewidth;
        break;
    }

    this.overlay_context.beginPath();
    for (let idx = 0; idx < region.n; idx++) {
      if (idx == 0) {
        this.overlay_context.moveTo(
          (region.x[idx] * overlay_width) / 512,
          (region.y[idx] * overlay_height) / 512
        );
        continue;
      }

      this.overlay_context.lineTo(
        (region.x[idx] * overlay_width) / 512,
        (region.y[idx] * overlay_height) / 512
      );
    }

    this.overlay_context.closePath();
    switch (region.renderingmode) {
      case "Fill":
        this.overlay_context.fill();
        break;
      case "Outline":
        this.overlay_context.stroke();
        break;
    }
  }

  drawTextOverlay(label: OverlayTextJSON, overlay_width: number, overlay_height: number) {
    this.overlay_context.fillStyle = label.fillcolour;

    this.overlay_context.font = label.labelsize.toString() + "px Arial";
    this.overlay_context.textBaseline = "middle";
    this.overlay_context.textAlign = "center";
    this.overlay_context.fillText(label.text, (label.x * overlay_width) / 512, (label.y * overlay_height) / 512);

  }

  drawOverlay(overlays: OverlayJSON[]) {
    if (overlays == undefined)
      return;

    if (this.overlay_context != undefined)
      this.overlay_context.clearRect(0, 0, this.overlay_canvas.width, this.overlay_canvas.height);

    var overlay_width = this.overlay_canvas.width;
    var overlay_height = this.overlay_canvas.height;

    overlays.forEach((overlay) => {
      if (overlay.regions !== undefined)
        overlay.regions.forEach((region: OverlayRegionJSON) => {
          this.drawRegionOverlay(region, overlay_width, overlay_height);
        });

      if (overlay.labels !== undefined)
        overlay.labels.forEach((label: OverlayTextJSON) => {
          this.drawTextOverlay(label, overlay_width, overlay_height);
        });
    });
  }

  render(): JSX.Element {
    return <canvas id="overlay_canvas" style="position:absolute; width:100%; height:100%" />;
  }
}
