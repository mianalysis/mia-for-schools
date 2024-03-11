import { For, Match, Show, Switch, createSignal } from 'solid-js';
import Image from './components/Image';

// import { Select } from "@thisbeyond/solid-select";
// import "@thisbeyond/solid-select/style.css";

import { socketClient } from './lib/client';
import { debounce } from './lib/util';

import './App.css';

function App() {
  type ModuleJSON = {
    "id": string,
    "name": string,
    "nickname": string,
    "canBeDisabled": boolean,
    "enabled": boolean,
    "visibleTitle": boolean,
    "parameters": [ParameterJSON]
  };

  type ParameterJSON = {
    "name": string,
    "nickname": string,
    "value": string,
    "type": string,
    "visible": boolean,
    "choices": [string],
    "collections": [ParameterJSON]
  }

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
      // debouncedProcess();
      debouncedProcessGroup();

    });

    // debouncedRequestParameters();
    requestEnableModuleGroups();

  };

  const [loading, setLoading] = createSignal(true);
  const [source, setSource] = createSignal<string>();
  const [params, setParams] = createSignal<ModuleJSON[]>();

  // function process() {
  //     setLoading(true);

  //     socketClient.publish({
  //         destination: '/app/process',
  //         body: JSON.stringify({}),
  //     });
  // }

  function processGroup() {
    setLoading(true);

    socketClient.publish({
      destination: '/app/processgroup',
      body: JSON.stringify({}),
    });
  }

  // const debouncedProcess = debounce(process, 100);
  const debouncedProcessGroup = debounce(processGroup, 100);
  // const debouncedRequestParameters = debounce(requestParameters, 100);
  const debouncedRequestPreviousGroup = debounce(requestPreviousGroup, 100);
  const debouncedRequestNextGroup = debounce(requestNextGroup, 100);

  // function requestParameters() {
  //     socketClient.publish({
  //         destination: '/app/getparameters',
  //         body: JSON.stringify({})
  //     });
  // }

  function requestEnableModuleGroups() {
    socketClient.publish({
      destination: '/app/enablemodulegroups',
      body: JSON.stringify({})
    });
  }

  function requestPreviousGroup() {
    socketClient.publish({
      destination: '/app/previousgroup',
      body: JSON.stringify({})
    });
  }

  function requestNextGroup() {
    socketClient.publish({
      destination: '/app/nextgroup',
      body: JSON.stringify({})
    });
  }

  function sendBooleanParameter(moduleID: String, parameterName: String, e: Event) {
    const stringParameterValue = ((Boolean)((e.target as HTMLInputElement).checked)).toString();
    sendParameter(moduleID, parameterName, stringParameterValue);
  }

  // function sendChoiceParameter(moduleID: String, parameterName: String, value: String) {
  //     sendParameter(moduleID, parameterName, value);
  // }

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

  function createParameterName(parameterName: String) {
    const nameGroups = parameterName.match(/(.+)[[A-Z]{1}\{.+\}]?/);
    if (nameGroups != null)
      return nameGroups[1].toString();
    else
      return parameterName.toString();
  }

  function createControls(module: ModuleJSON, parameters: [ParameterJSON]) {
    return [
      <For each={parameters}>{(parameter) =>
        createControl(module, parameter)
      }
      </For>
    ]
  }

  function createTextOrSliderInput(module: ModuleJSON, parameter: ParameterJSON) {
    const sliderDefinition = parameter.nickname.match(/(.+)S{(.+)}/);

    if (sliderDefinition == null) {
      return [<input class="h-8 w-32 rounded-full bg-rose-500 text-white hover:shadow-md" type="text" name="fname" value={parameter.value} onFocusOut={(e) => sendTextParameter(module.id, parameter.name, e)} style="text-align:center" />]
    } else {
      const sliderGroups = sliderDefinition[2].match(/([0-9]+)\|([0-9]+)\|([0-9]+)/);
      if (sliderGroups != null) {
        // const [sliderValue, setSliderValue] = createSignal(parameter.value);
        return [
          <div>
            {/* <input class="range h-8 rounded-full bg-lime-400 appearance-none" style="display:inline" type="range" min={sliderGroups[1]} max={sliderGroups[2]} step={sliderGroups[3]} value={parameter.value} onInput={(e) => setSliderValue((e.target as HTMLInputElement).value)} onClick={(e) => sendTextParameter(module.id, parameter.name, e)} />
            {sliderValue()} */}
            <input class="range h-8 w-32 rounded-full bg-lime-400 appearance-none" style="display:inline" type="range" min={sliderGroups[1]} max={sliderGroups[2]} step={sliderGroups[3]} value={parameter.value} onClick={(e) => sendTextParameter(module.id, parameter.name, e)} />
          </div>
        ]
      }
    }
  }

  function createBooleanInput(module: ModuleJSON, parameter: ParameterJSON) {
    return [<input class="h-8 w-8 rounded-full bg-emerald-300" type="checkbox" name="fname" checked={parameter.value === "true"} onClick={(e) => sendBooleanParameter(module.id, parameter.name, e)} />]
  }

  // function createChoiceInput(module: ModuleJSON, parameter: ParameterJSON) {
  //   /* Only process if value is different */
  //   return [<Select class="rounded-full" options={parameter.choices} initialValue={parameter.value} onChange={(value: String) => value !== parameter.value ? sendChoiceParameter(module.id, parameter.name, value) : null} />]
  //   // return <p>Choice box</p>
  // }

  function createControl(module: ModuleJSON, parameter: ParameterJSON) {
    return [
      <tr>
        <td class="p-2">
          <Show when={parameter.visible}>
            <div class="font-semibold">
            {createParameterName(parameter.nickname)}
            </div>
          </Show>
        </td>
        <td>
          <Switch>
            <Match when={parameter.type === "BooleanP"}>
              {createBooleanInput(module, parameter)}
            </Match>
            <Match when={parameter.type === "ChoiceP"}>
              {/* {createChoiceInput(module, parameter)} */}
              <p>Choice type</p>
            </Match>
            {/* <Match when={param.type === "FileFolderPathP"}>
            </Match> */}
            <Match when={parameter.type === "DoubleP" || parameter.type == "IntegerP" || parameter.type == "StringP"}>
              {createTextOrSliderInput(module, parameter)}
            </Match>
            <Match when={parameter.type === "ParameterGroup"}>
              {createControls(module, parameter.collections)}
            </Match>
          </Switch>
        </td>
      </tr>]
  }

  return (
    <main class="space-y-8">
      <Show when={source()}>
      <div class="rounded-lg overflow-hidden shadow-lg bg-white" style="width:100%">
        <Image source={source()!} loading={loading()} />
        </div>

        <div class="rounded-lg overflow-hidden shadow-lg bg-white p-4" style="width:100%">
          <table style="width:100%">
            <For each={params()}>{(module) =>
              createControls(module, module.parameters)
            }
            </For>
          </table>

          <br />
          <table style="width:100%">
            <tbody>
              <tr>
                <td>
                  <button class="font-semibold w-32 rounded-full bg-violet-500 text-white border-none hover:bg-orange-500" textContent='Previous' onClick={() => debouncedRequestPreviousGroup()} />
                </td>
                <td>
                  <button class="font-semibold w-32 rounded-full bg-violet-500 text-white border-none hover:bg-orange-500" textContent='Next' onClick={() => debouncedRequestNextGroup()} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Show>
    </main>

  );
}

export default App;
