type ImageJSON = {
  name: string;
  hashcode: string;
  showchannelcontrols: boolean;
  showprobecontrol: boolean;
  showselectcontrol: boolean;
  showzoomcontrol: boolean;
  defaultcontrol: 'Move' | 'Probe' | 'Select';
};
