import { For, Match, Show, Switch, createSignal } from 'solid-js';

import Choice from '../components/Choice';
import Im from '../components/Im';
import Slider from '../components/Slider';
import TextEntry from '../components/TextEntry';
import Toggle from '../components/Toggle';

import { socketClient } from '../lib/client';
import { debounce } from '../lib/util';

import WorkflowNav from '../components/WorkflowNav';
import { useLocation } from '@solidjs/router';
import MenuBar from '../components/MenuBar';

const [imageLoading, setImageLoading] = createSignal(true);
const [imageSource, setImageSource] = createSignal<ImageJSON>();
const [message, setMessage] = createSignal<string>();
const [params, setParams] = createSignal<ModuleJSON[]>();
const [hasPrevious, setHasPrevious] = createSignal(true);
const [hasNext, setHasNext] = createSignal(true);

function requestHasPreviousGroup() {
  socketClient.publish({
    destination: '/app/haspreviousgroup',
    body: JSON.stringify({})
  });
}

function requestHasNextGroup() {
  socketClient.publish({
    destination: '/app/hasnextgroup',
    body: JSON.stringify({})
  });
}

function processGroup() {
  setImageLoading(true);
  socketClient.publish({
    destination: '/app/processgroup',
    body: JSON.stringify({}),
  });
}

const debouncedProcessGroup = debounce(processGroup, 20);

const awaitConnect = async (awaitConnectConfig) => {
  const {
    retries = 3,
    curr = 0,
    timeinterval = 100,
  } = {};
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (socketClient.connected) {
        socketClient.subscribe('/user/queue/result', (data) => {
          const response = JSON.parse(data.body);
          const resultJSON = JSON.parse(response.body);
          if (resultJSON.image != undefined) {
            setImageSource(resultJSON.image);
            setImageLoading(false);
          }
          setMessage(resultJSON.message);
        });

        socketClient.subscribe('/user/queue/parameters', (data) => {
          requestHasNextGroup();
          requestHasPreviousGroup();

          const response = JSON.parse(data.body);
          const paramJson = JSON.parse(response.body);
          setParams(paramJson.modules);
          debouncedProcessGroup();
        });

        socketClient.subscribe('/user/queue/previousstatus', (data) => {
          const response = JSON.parse(data.body);
          var isTrue = (response.body === 'true')
          setHasPrevious(isTrue);
        });

        socketClient.subscribe('/user/queue/nextstatus', (data) => {
          const response = JSON.parse(data.body);
          var isTrue = (response.body === 'true')
          setHasNext(isTrue);
        });

        resolve(undefined);

      } else {
        if (curr >= retries)
          reject();
        awaitConnect({ ...awaitConnectConfig, curr: curr + 1 });
      }
    }, timeinterval);
  });
};

await awaitConnect(undefined);

function App() {
  if (socketClient.connected)
    setWorkflow(useLocation().query.name);

  function setWorkflow(workflowName: String) {
    socketClient.publish({
      destination: '/app/setworkflow',
      body: JSON.stringify({ workflowName: workflowName })
    });
  }

  // function requestEnableModuleGroups() {
  //   socketClient.publish({
  //     destination: '/app/enablemodulegroups',
  //     body: JSON.stringify({})
  //   });
  // }

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
      <MenuBar title={useLocation().query.name} ismainpage={false} />

      <div class="container m-auto grid sm:grid-cols-2 gap-4">
        <Show when={imageSource()}>
          <div class="max-w-lg rounded-lg overflow-hidden shadow-lg bg-white">
            <Im image={imageSource()!} loading={imageLoading()} />
          </div>
        </Show>

        <div class="flex flex-col relative">
          <Show when={message()}>
            <div class="flex-1 max-w-lg rounded-lg shadow-lg bg-white p-4">
              <p style="white-space: pre-line" class="text-black">{message()}</p>
            </div>
          </Show>

          <Show when={params()}>
            <div class="flex-1 max-w-lg rounded-lg shadow-lg bg-white p-4 mt-4">
              <table style="width:100%">
                <For each={params()}>{(module) =>
                  createControls(module, module.parameters)
                }
                </For>
              </table>
            </div>
          </Show>

          <div class="container m-auto grid grid-cols-2 gap-4 w-full rounded-lg shadow-lg bg-white p-4 mt-4">
            <div class="col-start-1">
              {/* <Show when={hasPrevious()}> */}
                <WorkflowNav mode="Previous" disabled={!hasPrevious()}/>
              {/* </Show> */}
            </div>
            <div class="col-start-2">
              {/* <Show when={hasNext()}> */}
                <WorkflowNav mode="Next" disabled={!hasNext()}/>
              {/* </Show> */}
            </div>
          </div>
        </div>
      </div>
    </main>

  );
}

export default App;
