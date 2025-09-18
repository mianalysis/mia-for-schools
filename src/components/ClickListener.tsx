import { debounce, sendParameter } from '../lib/util';


export class ClickListener {
  parameter: ParameterJSON;
  debouncedProcessClick: (position: number[]) => void;

  constructor(parameter: ParameterJSON) {
    this.parameter = parameter;
    this.debouncedProcessClick = debounce((position: number[]) => {
      const value = Math.round(position[0][0]) + ',' + Math.round(position[0][1]);
      sendParameter(
        this.parameter.moduleid,
        this.parameter.name,
        value,
        this.parameter.parentGroupName,
        this.parameter.groupCollectionNumber
      );
    }, 0);
  }

  onClick(position: number[]) {
    this.debouncedProcessClick(position);
  }
}
