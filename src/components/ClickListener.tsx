import { sendParameter } from '../lib/util';


export class ClickListener {
    parameter: ParameterJSON;

    constructor(parameter: ParameterJSON) {
        this.parameter = parameter;
    }

    onClick(position: number[]) {
        var value = position[0]+","+position[1]
                
        sendParameter(this.parameter.moduleid, this.parameter.name, value, undefined, undefined);
        
    }
}

