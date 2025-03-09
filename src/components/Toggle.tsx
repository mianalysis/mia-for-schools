import { sendParameter } from '../lib/util';

interface Props {
    parameter: ParameterJSON;
}

export default function Toggle(props: Props) {
    
    function sendBooleanParameter(moduleID: String, parameterName: String, e: Event) {
        const parameterValue = ((Boolean)((e.target as HTMLInputElement).checked)).toString();
        sendParameter(moduleID, parameterName, parameterValue, undefined, undefined);
    }

    return (<input
        class="h-10 w-10 rounded-full bg-emerald-300 transition duration-150 ease-in-out hover:scale-110"
        type="checkbox"
        name="fname"
        checked={props.parameter.value === "true"}
        onClick={(e) => sendBooleanParameter(props.parameter.moduleid, props.parameter.name, e)} />);

}
