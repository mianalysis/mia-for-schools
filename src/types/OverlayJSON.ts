type OverlayJSON = {
  regions: [OverlayRegionJSON];
  labels: [OverlayTextJSON];
};

type OverlayRegionJSON = {
  fillcolour: string;
  strokecolour: string;
  renderingmode: "Fill"|"Outline";
  linewidth: number;
  x: number[];
  y: number[];
  n: number;
};

type OverlayTextJSON = {
  fillcolour: string;
  labelsize: number;
  strokecolour: string;
  x: number;
  y: number;
  text: string;
};
