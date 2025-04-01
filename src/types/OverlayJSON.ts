type OverlayJSON = {
  regions: [OverlayRegionJSON];
  text: [OverlayTextJSON];
};

type OverlayRegionJSON = {
  fillcolour: string;
  strokecolour: string;
  x: number[];
  y: number[];
  n: number;
};

type OverlayTextJSON = {
  fillcolour: string;
  strokecolour: string;
  x: number;
  y: number;
  text: string;
};
