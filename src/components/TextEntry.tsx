import { sendParameter } from '../lib/util';

interface Props {
    module: ModuleJSON;
    parameter: ParameterJSON;
}

export default function TextEntry(props: Props) {
    function sendTextParameter(moduleID: String, parameterName: String, e: Event) {
        const parameterValue = (e.target as HTMLInputElement).value;
        sendParameter(moduleID, parameterName, parameterValue, undefined, undefined);
    }

    return (<input
        class="h-8 w-32 rounded-full bg-rose-500 text-white hover:shadow-md transition duration-150 ease-in-out hover:scale-110"
        type="text"
        name="fname"
        value={props.parameter.value}
        onFocusOut={(e) => sendTextParameter(props.module.id, props.parameter.name, e)}
        style="text-align:center" />);

}
