import { sendParameter } from '../lib/util';

interface Props {
    module: ModuleJSON;
    parameter: ParameterJSON;
}

export default function Slider(props: Props) {
    function sendTextParameter(moduleID: String, parameterName: String, e: Event) {
        const parameterValue = (e.target as HTMLInputElement).value;
        sendParameter(moduleID, parameterName, parameterValue, undefined, undefined);
    }

    const matchArray = props.parameter.nickname.match(/(.+)S{(.+)}/);
    if (matchArray == null)
        return

    const groups = matchArray[2].match(/([0-9]+)\|([0-9]+)\|([0-9]+)/);
    if (groups == null)
        return

    return (<input
        class="range h-10 w-32 rounded-full bg-lime-400 appearance-none transition duration-150 ease-in-out hover:scale-110"
        style="display:inline"
        type="range"
        min={groups[1]}
        max={groups[2]}
        step={groups[3]}
        value={props.parameter.value}
        onchange={(e) => sendTextParameter(props.module.id, props.parameter.name, e)} />);

}
