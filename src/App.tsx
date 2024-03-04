import { Show, For, createSignal, Switch, Match } from 'solid-js';
import Image from './components/Image';

import { Select } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";

import { debounce } from './lib/util';
import { socketClient } from './lib/client';

function App() {
    socketClient.onConnect = () => {
        socketClient.subscribe('/user/queue/result', (data) => {
            const response = JSON.parse(data.body);

            // Set the source of the image to the Base64-encoded image data
            setSource(`data:${response.headers['Content-Type']};base64,${response.body}`);
            setLoading(false);
        });

        socketClient.subscribe('/user/queue/parameters', (data) => {
            const response = JSON.parse(data.body);
            const paramJson = JSON.parse(response.body);

            setParams(paramJson.modules);

            // Specifically for the schools project, once we've got the parameters back, run the workflow with the current parameters
            debouncedProcess();

        });

        debouncedRequestParameters();

    };

    const [loading, setLoading] = createSignal(true);
    const [source, setSource] = createSignal<string>();
    const [params, setParams] = createSignal([{
        "id": "",
        "name": "",
        "nickname": "",
        "canBeDisabled": "",
        "enabled": "",
        "visibleTitle": "",
        "parameters":
            [{
                "name": "",
                "nickname": "",
                "value": "",
                "type": "",
                "choices": []
            }]
    }]);

    function process() {
        setLoading(true);

        socketClient.publish({
            destination: '/app/process',
            body: JSON.stringify({}),
        });
    }

    const debouncedProcess = debounce(process, 100);

    function requestParameters() {
        socketClient.publish({
            destination: '/app/getparameters',
            body: JSON.stringify({})
        });
    }

    const debouncedRequestParameters = debounce(requestParameters, 100);

    function sendBooleanParameter(moduleID: String, parameterName: String, e: Event) {
        const stringParameterValue = ((Boolean)((e.target as HTMLInputElement).checked)).toString();
        sendParameter(moduleID, parameterName, stringParameterValue);
    }

    function sendChoiceParameter(moduleID: String, parameterName: String, value: String) {
        sendParameter(moduleID, parameterName, value);
    }

    function sendTextParameter(moduleID: String, parameterName: String, e: Event) {
        const stringParameterValue = (e.target as HTMLInputElement).value;
        sendParameter(moduleID, parameterName, stringParameterValue);
    }

    function sendParameter(moduleID: String, parameterName: String, parameterValue: String) {
        socketClient.publish({
            destination: '/app/setparameter',
            body: JSON.stringify({ moduleID: moduleID, parameterName: parameterName, parameterValue: parameterValue })
        });
    }

    return (
        <main class="space-y-8">
            <Show when={source()}>
                <Image source={source()!} loading={loading()} />
            </Show>

            <table style="width:100%">
                <For each={params()}>{(module) =>
                    <For each={module.parameters}>{(param) =>
                        <tr>
                            <td>
                                {param.nickname}
                            </td>
                            <td>
                                <Switch>
                                    <Match when={param.type === "BooleanP"}>
                                        <input type="checkbox" id="fname" name="fname" checked={param.value === "true"} onInput={(e) => sendBooleanParameter(module.id, param.name, e)} />
                                    </Match>
                                    <Match when={param.type === "ChoiceP"}>
                                        {/* Only process if value is different */}
                                        <Select options={param.choices} initialValue={param.value} onChange={(value: String) => value !== param.value ? sendChoiceParameter(module.id, param.name, value) : null} />
                                    </Match>
                                    {/* <Match when={param.type === "FileFolderPathP"}>
                                    
                                </Match> */}
                                    <Match when={param.type === "DoubleP" || param.type == "IntegerP" || param.type == "StringP"}>
                                        {/* <br/>{param.name}<input type="range" min="0" max="5" step="0.1" value={param.value} onChange={(e) => sendTextParameter(module.id,param.name,e)}/> {param.value} */}
                                        <input type="text" id="fname" name="fname" value={param.value} onFocusOut={(e) => sendTextParameter(module.id, param.name, e)} style="text-align:center"/>
                                    </Match>
                                </Switch>
                            </td>
                        </tr>
                    }
                    </For>
                }
                </For>
            </table>

        </main>

    );
}

export default App;
