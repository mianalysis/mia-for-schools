import { sendParameter } from '../lib/util';

import { Select } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";

interface Props {
    module: ModuleJSON;
    parameter: ParameterJSON;
}

var currVal : String

export default function Choice(props: Props) {
    return (<Select 
        class="h-8 w-32 rounded-full bg-rose-500 text-white hover:shadow-md" 
        options={props.parameter.choices} 
        initialValue={props.parameter.value}
        onChange={(value: String) => {if (currVal != value) {
            sendParameter(props.module.id, props.parameter.name, value)
            currVal = value
        }}} 
        />);

}
