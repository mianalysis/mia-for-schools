import { sendParameter } from '../lib/util';

interface Props {
    module: ModuleJSON;
    parameter: ParameterJSON;
}

export default function Toggle(props: Props) {
    function sendBooleanParameter(moduleID: String, parameterName: String, e: Event) {
        const parameterValue = ((Boolean)((e.target as HTMLInputElement).checked)).toString();
        sendParameter(moduleID, parameterName, parameterValue);
    }

    return (<input
        class="h-8 w-8 rounded-full bg-emerald-300"
        type="checkbox"
        name="fname"
        checked={props.parameter.value === "true"}
        onClick={(e) => sendBooleanParameter(props.module.id, props.parameter.name, e)} />);

}
