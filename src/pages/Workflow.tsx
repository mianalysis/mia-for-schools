import { For, Match, Show, Switch, createSignal } from 'solid-js';

import Choice from '../components/Choice';
import Im from '../components/Im';
import TextEntry from '../components/TextEntry';
import Toggle from '../components/Toggle';

// import { setStore } from '../lib/store';

import { useLocation } from '@solidjs/router';
import Background from '../components/Background';
import Button from '../components/Button';
import { ClickListener } from '../components/ClickListener';
import Graph from '../components/Graph';
import MenuBar from '../components/MenuBar';
import ParameterSlider from '../components/ParameterSlider';
import WorkflowNav from '../components/WorkflowNav';

var workflowName: String = '';

// const [hasPrevious, setHasPrevious] = createSignal(true);
// const [hasNext, setHasNext] = createSignal(true);
// const [params, setParams] = createSignal<ModuleJSON[]>();
const [loading, setLoading] = createSignal(true);
const [image, setImage] = createSignal<ImageJSON>();
const [background, setBackground] = createSignal<BackgroundJSON>();
const [message, setMessage] = createSignal<[MessageJSON]>();
const [graph, setGraph] = createSignal<GraphJSON | undefined>();
const [showNav, setShowNav] = createSignal(false);
const [overlays, setOverlays] = createSignal<[OverlayJSON] | undefined>();
const [clickListener, setClickListener] = createSignal<ClickListener | undefined>();

// function requestHasPreviousGroup() {
//   socketClient.publish({
//     destination: '/app/haspreviousgroup',
//     body: JSON.stringify({}),
//   });
// }

// function requestHasNextGroup() {
//   socketClient.publish({
//     destination: '/app/hasnextgroup',
//     body: JSON.stringify({}),
//   });
// }

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

// const awaitConnect = async (awaitConnectConfig) => {
//   const { retries = 3, curr = 0, timeinterval = 100 } = {};

//   return new Promise((resolve, reject) => {
//     setTimeout(async () => {
//       if (socketClient.connected) {
//         socketClient.subscribe('/user/queue/result', (data) => {
//           requestHasNextGroup();
//           requestHasPreviousGroup();

//           const response = JSON.parse(data.body);
//           if (response.body === "busy")
//             return;

//           const resultJSON = JSON.parse(response.body);

//           if (resultJSON.modules !== undefined && resultJSON.modules.length !== undefined) {
//             var clickParameter = getClickListenerParameter(resultJSON.modules);
//             if (clickParameter !== undefined)
//               if (clickListener() == undefined)
//                 setClickListener(new ClickListener(clickParameter));
//           }

//           setOverlays(resultJSON.overlays);
//           setBackground(resultJSON.background);
//           setMessage(resultJSON.message);
//           setGraph(resultJSON.graph);
//           setShowNav(true);
//           setImage(resultJSON.image);
//         });

//         // socketClient.subscribe('/user/queue/previousstatus', (data) => {
//         //   const response = JSON.parse(data.body);
//         //   var isTrue = response.body === 'true';
//         //   setHasPrevious(isTrue);
//         // });

//         // socketClient.subscribe('/user/queue/nextstatus', (data) => {
//         //   const response = JSON.parse(data.body);
//         //   var isTrue = response.body === 'true';
//         //   setHasNext(isTrue);
//         // });

//         resolve(undefined);
//       } else {
//         if (curr >= retries) {
//           reject();
//         } else {
//           try {
//             await awaitConnect({ ...awaitConnectConfig, curr: curr + 1 });
//             resolve(undefined);
//           } catch (e) {
//             reject(e);
//           }
//         }
//       }
//     }, timeinterval);
//   });
// };

// await awaitConnect(undefined);

async function loadWorkflowConfig() {
  const workflowsJson: WorkflowsJSON = await (await fetch('./mia/workflows/workflows.json')).json();

  const workflowJson: WorkflowJSON = workflowsJson.workflows.find(
    (workflow) => workflow.fullname === workflowName
  );

  setBackground(workflowJson.background);
}

async function initialiseWorkflow(workflowName: String) {
  // Read workflow XML from file
  const workflowPath: string = `./mia/workflows/${workflowName}.mia`;
  const workflowFile = await fetch(workflowPath);
  const workflowXML: string = (await workflowFile.text()).toString();

  // Create an instance of ProcessController and store it on window
  const cj = window.cj;
  const ProcessController = await cj.io.github.mianalysis.miaserver.controllers.ProcessController;
  const processController = await new ProcessController();
  window.proCon = processController;

  // Initialise the workflow
  const response = await processController.setWorkflow(workflowXML, workflowPath);
  const resultJSON: ResultJSON = await JSON.parse(response);

  setLoading(false);

  await updatePage(resultJSON);
}

async function updatePage(resultJSON: ResultJSON) {
  var clickParameter = getClickListenerParameter(resultJSON.modules);

  if (clickParameter !== undefined)
    if (clickListener() == undefined)
      setClickListener(new ClickListener(clickParameter, updatePage));

  setOverlays(resultJSON.overlays);
  setMessage(resultJSON.message);
  setGraph(resultJSON.graph);
  setShowNav(true);
  setImage(resultJSON.image);

}

function App() {
  setLoading(true);
  setOverlays(undefined);
  // setParams(undefined);
  setImage(undefined);
  setGraph(undefined);
  setMessage(undefined);
  setShowNav(false);

  // Request first workflow page
  workflowName = useLocation().query.name;

  // Set workflow background
  loadWorkflowConfig();

  new Promise<void>(() => {
    if ((window as any).cheerpjReady) {
      initialiseWorkflow(workflowName);
    } else {
      window.addEventListener('cheerpj-ready', () => {
        initialiseWorkflow(workflowName);
      });
    }
  });

  function createControls(parameters: [ParameterJSON]) {
    return [<For each={parameters}>{(parameter) => createControl(parameter)}</For>];
  }

  function createTextOrSliderInput(parameter: ParameterJSON) {
    if (parameter.nickname.match(/(.+)S{(.+)}/) == null)
      return <TextEntry parameter={parameter} updatePage={updatePage} />;
    else return <ParameterSlider parameter={parameter} updatePage={updatePage} />;
  }

  function createControl(parameter: ParameterJSON) {
    return [
      <div class="flex items-center" style="display: inline;">
        <Switch>
          <Match when={parameter.type === 'BooleanP'}>
            <Toggle parameter={parameter} updatePage={updatePage} />
          </Match>
          <Match when={parameter.type === 'ClickP'}>
            <Button parameter={parameter} updatePage={updatePage} />
          </Match>
          <Match
            when={
              parameter.type === 'ChoiceP' ||
              parameter.type === 'InputImageP' ||
              parameter.type === 'InputObjectsP'
            }
          >
            <Choice parameter={parameter} updatePage={updatePage} />
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

      <Show when={loading()}>
        <div
          class="flex rounded-lg shadow-lg bg-white p-4 fade-in fade-out duration-1000 ease-in-out"
          style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75); z-index: 1"
        >
          <div role="status" class="animate-spin">
            <svg class="w-12 h-12 text-neutral-tertiary" viewBox="0 0 100 101">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#BBBBBB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#ff0000"
              />
            </svg>
          </div>
          <div class="text-gray-600 ml-4 p-2 text-2xl">Loading...</div>
        </div>
      </Show>

      <Show when={!loading()}>
        <div class="container grid sm:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <Show when={image() || message() || graph()}>
              <div
                class="flex-1 text-xl max-w-lg rounded-lg shadow-lg p-4 mb-4 animate-in fade-in duration-1000 ease-in-out"
                style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75); z-index: 1"
              >
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
              <div
                class="flex-1 text-xl max-w-lg rounded-lg shadow-lg p-4 animate-in fade-in duration-1000 ease-in-out"
                style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75); z-index: 1"
              >
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
              <div
                class="flex flex-1 justify-center flex-auto rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-1000 ease-in-out"
                style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75)"
              >
                <Graph graphJSON={graph()} imageJSON={image()}></Graph>
              </div>
            </Show>

            <Show when={showNav()}>
              <div
                class="flex container m-auto grid grid-cols-2 gap-4 w-full rounded-lg shadow-lg bg-white p-4 mt-4 animate-in fade-in duration-1000 ease-in-out"
                style="backdrop-filter: blur(16px); background-color: rgba(255,255,255,0.75)"
              >
                <div class="flex-1 col-start-1">
                  {/* <WorkflowNav mode="Previous" disabled={!hasPrevious()} updatePage={updatePage} /> */}
                  <WorkflowNav mode="Previous" disabled={false} updatePage={updatePage} />
                </div>
                <div class="flex-1 col-start-2">
                  {/* <WorkflowNav mode="Next" disabled={!hasNext()} updatePage={updatePage} /> */}
                  <WorkflowNav mode="Next" disabled={false} updatePage={updatePage} />
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </main>
  );
}

export default App;
