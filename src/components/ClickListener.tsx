import { sendParameter } from '../lib/util';


export class ClickListener {
    parameter: ParameterJSON;

    constructor(parameter: ParameterJSON) {
        this.parameter = parameter;
    }

    onClick(position: number[]) {
        var value = Math.round(position[0])+","+Math.round(position[1])
        sendParameter(this.parameter.moduleid, this.parameter.name, value, this.parameter.parentGroupName, this.parameter.groupCollectionNumber);
        
    }
}

