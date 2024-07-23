import { For, Match, Show, Switch, createSignal } from 'solid-js';

import Choice from '../components/Choice';
import Im from '../components/Im';
import Slider from '../components/Slider';
import TextEntry from '../components/TextEntry';
import Toggle from '../components/Toggle';

import { socketClient } from '../lib/client';
import { debounce } from '../lib/util';

import { useLocation } from '@solidjs/router';
import Graph from '../components/Graph';
import MenuBar from '../components/MenuBar';
import WorkflowNav from '../components/WorkflowNav';

const [hasPrevious, setHasPrevious] = createSignal(true);
const [hasNext, setHasNext] = createSignal(true);
const [params, setParams] = createSignal<ModuleJSON[]>();
const [imageLoading, setImageLoading] = createSignal(true);
const [image, setImage] = createSignal<ImageJSON>();
const [message, setMessage] = createSignal<string>();
const [graph, setGraph] = createSignal<GraphJSON | undefined>();
const [showNav, setShowNav] = createSignal(false);

var currParams = undefined;

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
    setTimeout(async () => {
      if (socketClient.connected) {
        socketClient.subscribe('/user/queue/result', (data) => {
          const response = JSON.parse(data.body);
          const resultJSON = JSON.parse(response.body);

          setMessage(resultJSON.message);

          if (resultJSON.graph == undefined)
            setGraph(undefined);
          else
            setGraph(resultJSON.graph);

          if (resultJSON.image != undefined) {
            setImage(resultJSON.image);
            setImageLoading(false);
          }

          setShowNav(true);
          setParams(currParams);

        });

        socketClient.subscribe('/user/queue/parameters', (data) => {
          requestHasNextGroup();
          requestHasPreviousGroup();

          const response = JSON.parse(data.body);
          const paramJson = JSON.parse(response.body);
          currParams = paramJson.modules;
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
        if (curr >= retries) {
          reject();
        } else {
          try {
            await awaitConnect({ ...awaitConnectConfig, curr: curr + 1 });
            resolve(undefined);
          } catch (e) {
            reject(e);
          }
        }
      }
    }, timeinterval);
  });
};

await awaitConnect(undefined);

function App() {
  setParams(undefined);
  setImage(undefined);
  setGraph(undefined);
  setMessage(undefined);
  setShowNav(false);

  if (socketClient.connected)
    setWorkflow(useLocation().query.name);

  function setWorkflow(workflowName: String) {
    setImageLoading(true);
    socketClient.publish({
      destination: '/app/setworkflow',
      body: JSON.stringify({ workflowName: workflowName })
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
        <Show when={image()}>
          <Im image={image()!} loading={imageLoading()} graph={graph()} setGraph={setGraph} />
        </Show>

        <div class="flex flex-col relative">
          <Show when={message()}>
            <div class="flex-1 max-w-lg rounded-lg shadow-lg bg-white p-4 animate-in fade-in duration-500">
              <p style="white-space: pre-line" class="text-black">{message()}</p>
            </div>
          </Show>

          <Show when={params()}>
            <div class="flex-1 max-w-lg rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-500">
              <table style="width:100%">
                <For each={params()}>{(module) =>
                  createControls(module, module.parameters)
                }
                </For>
              </table>
            </div>
          </Show>

          <Show when={graph()}>
            <div class="flex justify-center flex-1 max-w-lg rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-500">
              <Graph graphJSON={graph()} type='pie' imageJSON={image()}></Graph>
            </div>
          </Show>

          <Show when={showNav()}>
            <div class="container m-auto grid grid-cols-2 gap-4 w-full rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-500">
              <div class="col-start-1">
                <WorkflowNav mode="Previous" disabled={!hasPrevious()} />
              </div>
              <div class="col-start-2">
                <WorkflowNav mode="Next" disabled={!hasNext()} />
              </div>
            </div>
          </Show>
        </div>
      </div>
    </main>
  );
}

export default App;
