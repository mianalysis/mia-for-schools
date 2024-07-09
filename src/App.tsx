import { For, Match, Show, Switch, createSignal } from 'solid-js';

import Choice from './components/Choice';
import Im from './components/Im';
import Slider from './components/Slider';
import TextEntry from './components/TextEntry';
import Toggle from './components/Toggle';

import { socketClient } from './lib/client';
import { debounce } from './lib/util';

import WorkflowNav from './components/WorkflowNav';


function App() {
  socketClient.onConnect = () => {
    socketClient.subscribe('/user/queue/result', (data) => {
      const response = JSON.parse(data.body);
      const resultJSON = JSON.parse(response.body);

      if (resultJSON.image != undefined) {
        setImageSource(resultJSON.image);
        setImageLoading(false);
        // setShowImageControls(resultJSON.showimagecontrols);
      }

      // If no message is included, this box will disappear
      setMessage(resultJSON.message);

    });

    socketClient.subscribe('/user/queue/parameters', (data) => {
      const response = JSON.parse(data.body);
      const paramJson = JSON.parse(response.body);

      setParams(paramJson.modules);

      // Specifically for the schools project, once we've got the parameters back, run the workflow with the current parameters
      debouncedProcessGroup();

    });

    requestEnableModuleGroups();

  };

  const [imageLoading, setImageLoading] = createSignal(true);
  const [imageSource, setImageSource] = createSignal<ImageJSON>();
  // const [showImageControls, setShowImageControls] = createSignal(true);
  const [message, setMessage] = createSignal<string>();
  const [params, setParams] = createSignal<ModuleJSON[]>();

  function processGroup() {
    setImageLoading(true);

    socketClient.publish({
      destination: '/app/processgroup',
      body: JSON.stringify({}),
    });
  }

  const debouncedProcessGroup = debounce(processGroup, 20);
  // const debouncedRequestParameters = debounce(requestParameters, 100);

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

  function getParameterName(parameterName: String) {
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
    if (parameter.nickname.match(/(.+)S{(.+)}/) == null)
      return <TextEntry module={module} parameter={parameter} />
    else
      return <Slider module={module} parameter={parameter} />
  }

  function createControl(module: ModuleJSON, parameter: ParameterJSON) {
    return [
      <tr>
        <td class="p-2">
          <Show when={parameter.visible}>
            <div class="font-semibold">
              {getParameterName(parameter.nickname)}
            </div>
          </Show>
        </td>
        <td>
          <Switch>
            <Match when={parameter.type === "BooleanP"}>
              <Toggle module={module} parameter={parameter} />
            </Match>
            <Match when={parameter.type === "ChoiceP" || parameter.type === "InputImageP" || parameter.type === "InputObjectsP"}>
              <Choice module={module} parameter={parameter} />
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
      <Show when={imageSource()}>

        <div class="container m-auto grid md:grid-cols-2 gap-4">

          <div class="max-w-lg rounded-lg shadow-lg bg-white p-4">
            <table style="width:100%">
              <For each={params()}>{(module) =>
                createControls(module, module.parameters)
              }
              </For>
            </table>

          </div>

          <div class="row-span-3 max-w-lg rounded-lg overflow-hidden shadow-lg bg-white">
            <Im image={imageSource()!} loading={imageLoading()} />
          </div>

          <Show when={message()}>
            <div class="max-w-lg rounded-lg overflow-hidden shadow-lg bg-white p-4">
              {message()}
            </div>
          </Show>

          <div class="max-w-lg rounded-lg shadow-lg bg-white p-4">
            <WorkflowNav />
          </div>
        </div>
      </Show>
    </main>

  );
}

export default App;
