type ImageJSON = {
  channels: [ChannelJSON];
  name: string;
  hashcode: string;
  showchannelcontrols: boolean;
  showprobecontrol: boolean;
  showselectcontrol: boolean;
  showzoomcontrol: boolean;
  defaultcontrol: "Move" | "Probe" | "Select";
};

type ChannelJSON = {
  pixels: string;
  strength: number;
  index: number;
  red: number;
  green: number;
  blue: number;
};
