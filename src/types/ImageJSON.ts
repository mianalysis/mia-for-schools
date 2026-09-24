type ImageJSON = {
  channels: [ChannelJSON];
  imagetype: 'composite' | 'simple';
  reds: Int8Array;
  greens: Int8Array;
  blues: Int8Array;
  name: string;
  hashcode: string;
  showchannelcontrols: boolean;
  showprobecontrol: boolean;
  showselectcontrol: boolean;
  showzoomcontrol: boolean;
  defaultcontrol: 'Move' | 'Probe' | 'Select';
};

type ChannelJSON = {
  pixels: string;
  strength: number;
  index: number;
  red: number;
  green: number;
  blue: number;
};
