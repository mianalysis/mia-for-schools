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
import { ObjectSelector } from '../components/ObjectSelector';
import WorkflowNav from '../components/WorkflowNav';

const [hasPrevious, setHasPrevious] = createSignal(true);
const [hasNext, setHasNext] = createSignal(true);
const [params, setParams] = createSignal<ModuleJSON[]>();
const [image, setImage] = createSignal<ImageJSON>();
const [message, setMessage] = createSignal<string>();
const [graph, setGraph] = createSignal<GraphJSON | undefined>();
const [showNav, setShowNav] = createSignal(false);
const [overlays, setOverlays] = createSignal<[OverlayJSON] | undefined>();
const [objectSelector, setObjectSelector] = createSignal<ObjectSelector | undefined>();

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
  socketClient.publish({
    destination: '/app/processgroup',
    body: JSON.stringify({}),
  });
}

function hasVisibleParams(modules: [ModuleJSON]) {
  if (modules == undefined)
    return false;

  var hasVisible = false;
  modules.forEach(module => {
    if (module.name !== "Select objects") {
      module.parameters.forEach(parameter => {
        if (parameter.visible)
          hasVisible = true;
      });
    }
  })

  return hasVisible;

}

function processObjectSelector(modules: [ModuleJSON]) {
  if (modules == undefined)
    return;

  modules.forEach(module => {
    if (module.name === "Select objects") {
      setObjectSelector(new ObjectSelector(module));
    }
  })
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

          if (resultJSON.overlays == undefined)
            setOverlays(undefined)
          else
            setOverlays(resultJSON.overlays)
          
          if (resultJSON.image == undefined)
            setImage(undefined)
          else
            setImage(resultJSON.image);

          if (resultJSON.message == undefined)
            setMessage(undefined)
          else
            setMessage(resultJSON.message);

          if (resultJSON.graph == undefined)
            setGraph(undefined);
          else
            setGraph(resultJSON.graph);

          // if (resultJSON.objects == undefined)
          //   setObjects(undefined);
          // else
          //   setObjects(resultJSON.objects);

          setShowNav(true);

          if (hasVisibleParams(currParams))
            setParams(currParams);

          processObjectSelector(currParams);

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
  setOverlays(undefined);
  // setObjects(undefined);
  setMessage(undefined);
  setShowNav(false);

  if (socketClient.connected)
    setWorkflow(useLocation().query.name);

  function setWorkflow(workflowName: String) {
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
      <div class="flex items-center">
        <Show when={parameter.visible && module.name !== "Select objects"}>
          <div class="flex-1 p-2">
            <div class="font-semibold">
              {getParameterName(parameter.nickname)}
            </div>
          </div>
          <div class="flex-1 flex-end items-center">
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
              {/* <Match when={parameter.type === "ObjectSelectorP"}>
              ObjectSelector!
            </Match> */}
            </Switch>
          </div>
        </Show>
      </div>
    ]
  }

  return (
    <main class="space-y-8">
      <Show when={image() || message() || params() || graph()}>
        <MenuBar title={useLocation().query.name} ismainpage={false} />
      </Show>

      <div class="container grid sm:grid-cols-2 gap-4">
        <Show when={image()}>
          <Im image={image()!} graph={graph()} setGraph={setGraph} overlays={overlays()} objectSelector={objectSelector()} />
        </Show>

        <div class="flex flex-col relative">
          <Show when={message()}>
            <div class="flex-1 text-lg max-w-lg rounded-lg shadow-lg bg-white p-4 animate-in fade-in duration-500">
              <p style="white-space: pre-line" class="text-black" innerHTML={message()}></p>
            </div>
          </Show>

          <Show when={params()}>
            <div class="flex-1 max-w-lg rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-500">
              <For each={params()}>{(module) =>
                createControls(module, module.parameters)
              }
              </For>
            </div>
          </Show>

          <Show when={graph()}>
            <div class="flex justify-center flex-auto max-w-lg rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-500">
              <Graph graphJSON={graph()} imageJSON={image()}></Graph>
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
