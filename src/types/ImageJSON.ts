type ImageJSON = {
  channels: [ChannelJSON];
  name: string;
  showchannelcontrols: boolean;
  showzoomcontrol: boolean;
  hashcode: string;
};

type ChannelJSON = {
  pixels: string;
  strength: number;
  index: number;
  red: number;
  green: number;
  blue: number;
};
