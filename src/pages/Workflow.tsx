import { For, Match, Show, Switch, createSignal } from 'solid-js';

import Choice from '../components/Choice';
import Im from '../components/Im';
import TextEntry from '../components/TextEntry';
import Toggle from '../components/Toggle';

import { socketClient } from '../lib/client';
// import { setStore } from '../lib/store';

import { useLocation } from '@solidjs/router';
import Background from '../components/Background';
import Button from '../components/Button';
import { ClickListener } from '../components/ClickListener';
import Graph from '../components/Graph';
import ParameterSlider from '../components/ParameterSlider';
import WorkflowNav from '../components/WorkflowNav';
import MenuBar from '../components/MenuBar';

const [hasPrevious, setHasPrevious] = createSignal(true);
const [hasNext, setHasNext] = createSignal(true);
// const [params, setParams] = createSignal<ModuleJSON[]>();
const [image, setImage] = createSignal<ImageJSON>();
const [background, setBackground] = createSignal<BackgroundJSON>();
const [message, setMessage] = createSignal<[MessageJSON]>();
const [graph, setGraph] = createSignal<GraphJSON | undefined>();
const [showNav, setShowNav] = createSignal(false);
const [overlays, setOverlays] = createSignal<[OverlayJSON] | undefined>();
const [clickListener, setClickListener] = createSignal<ClickListener | undefined>();

function requestHasPreviousGroup() {
  socketClient.publish({
    destination: '/app/haspreviousgroup',
    body: JSON.stringify({}),
  });
}

function requestHasNextGroup() {
  socketClient.publish({
    destination: '/app/hasnextgroup',
    body: JSON.stringify({}),
  });
}

function getClickListenerParameter(modules: [ModuleJSON]) {
  if (modules == undefined) return undefined;

  var clickParameter = undefined;
  modules.forEach((module) => {
    module.parameters.forEach((parameter) => {
      if (parameter.type === 'ClickListenerP') {
        clickParameter = parameter;

        return clickParameter;
      }
    });
  });

  return clickParameter;

}

const awaitConnect = async (awaitConnectConfig) => {
  const { retries = 3, curr = 0, timeinterval = 100 } = {};

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      if (socketClient.connected) {
        socketClient.subscribe('/user/queue/result', (data) => {
          requestHasNextGroup();
          requestHasPreviousGroup();

          const response = JSON.parse(data.body);
          if (response.body === "busy")
            return;

          const resultJSON = JSON.parse(response.body);

          if (resultJSON.modules !== undefined && resultJSON.modules.length !== undefined) {
            var clickParameter = getClickListenerParameter(resultJSON.modules);
            if (clickParameter !== undefined)
              if (clickListener() == undefined)
                setClickListener(new ClickListener(clickParameter));
          }
          
          setOverlays(resultJSON.overlays);
          setBackground(resultJSON.background);
          setMessage(resultJSON.message);
          setGraph(resultJSON.graph);
          setShowNav(true);
          setImage(resultJSON.image);
        });

        socketClient.subscribe('/user/queue/previousstatus', (data) => {
          const response = JSON.parse(data.body);
          var isTrue = response.body === 'true';
          setHasPrevious(isTrue);
        });

        socketClient.subscribe('/user/queue/nextstatus', (data) => {
          const response = JSON.parse(data.body);
          var isTrue = response.body === 'true';
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
  setBackground(undefined);
  setOverlays(undefined);
  // setParams(undefined);
  setImage(undefined);
  setGraph(undefined);
  setMessage(undefined);
  setShowNav(false);

  if (socketClient.connected) setWorkflow(useLocation().query.name);

  function setWorkflow(workflowName: String) {
    socketClient.publish({
      destination: '/app/setworkflow',
      body: JSON.stringify({ workflowName: workflowName }),
    });
  }

  function createControls(parameters: [ParameterJSON]) {
    return [<For each={parameters}>{(parameter) => createControl(parameter)}</For>];
  }

  function createTextOrSliderInput(parameter: ParameterJSON) {
    if (parameter.nickname.match(/(.+)S{(.+)}/) == null) return <TextEntry parameter={parameter} />;
    else return <ParameterSlider parameter={parameter} />;
  }

  function createControl(parameter: ParameterJSON) {
    return [
      <div class="flex items-center" style="display: inline;">
        <Switch>
          <Match when={parameter.type === 'BooleanP'}>
            <Toggle parameter={parameter} />
          </Match>
          <Match when={parameter.type === 'ClickP'}>
            <Button parameter={parameter} />
          </Match>
          <Match
            when={
              parameter.type === 'ChoiceP' ||
              parameter.type === 'InputImageP' ||
              parameter.type === 'InputObjectsP'
            }
          >
            <Choice parameter={parameter} />
          </Match>
          <Match
            when={
              parameter.type === 'DoubleP' ||
              parameter.type == 'IntegerP' ||
              parameter.type == 'StringP'
            }
          >
            {createTextOrSliderInput(parameter)}
          </Match>
          <Match when={parameter.type === 'ParameterGroup'}>
            {createControls(parameter.collections)}
          </Match>
        </Switch>
      </div>,
    ];
  }

  return (
    <main class="space-y-0">
      <Show when={background()}>
        <Background backgroundJSON={background()} n={window.innerWidth / 20} />
      </Show>

      <div class="container grid sm:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <Show when={image() || message() || graph()}>
            <div class="flex-1 text-xl max-w-lg rounded-lg shadow-lg p-4 mb-4 animate-in fade-in duration-1000 ease-in-out" style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75); z-index: 1">
              <MenuBar title={useLocation().query.name} ismainpage={false} />
            </div>
          </Show>
          <Show when={image()}>
            <Im
              image={image()!}
              graphJSON={graph()}
              graph={graph}
              setGraph={setGraph}
              overlaysJSON={overlays()}
              overlays={overlays}
              clickListener={clickListener}
            />
          </Show>
        </div>

        <div class="flex flex-col">
          <Show when={message()}>
            <div class="flex-1 text-xl max-w-lg rounded-lg shadow-lg p-4 animate-in fade-in duration-1000 ease-in-out" style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75); z-index: 1">
              <For each={message()}>
                {(content) => (
                  <Switch>
                    <Match when={content.type === 'parameter'}>
                      {createControl(content.data as ParameterJSON)}
                    </Match>
                    <Match when={content.type === 'text'}>
                      <span
                        style="white-space: pre-line;"
                        class="text-gray-600"
                        innerHTML={content.data as string}
                      ></span>
                    </Match>
                  </Switch>
                )}
              </For>
            </div>
          </Show>

          <Show when={graph()}>
            <div class="flex flex-1 justify-center flex-auto rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-1000 ease-in-out" style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75)">
              <Graph graphJSON={graph()} imageJSON={image()}></Graph>
            </div>
          </Show>

          <Show when={showNav()}>
            <div class="flex container m-auto grid grid-cols-2 gap-4 w-full rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-1000 ease-in-out" style="backdrop-filter: blur(16px); background-color: rgba(255,255,255,0.75)">
              <div class="flex-1 col-start-1">
                <WorkflowNav mode="Previous" disabled={!hasPrevious()} />
              </div>
              <div class="flex-1 col-start-2">
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
