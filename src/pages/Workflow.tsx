import { Show, createSignal } from 'solid-js';

import SimpleIm from '../components/SimpleIm';

// import { setStore } from '../lib/store';

import { useLocation } from '@solidjs/router';
import Background from '../components/Background';
import { ClickListener } from '../components/ClickListener';
import Graph from '../components/Graph';
import MenuBar from '../components/panels/MenuBar';
import WorkflowNav from '../components/panels/WorkflowNav';
// import Im from '../components/Im';
import Panel from '../components/panels/Panel';
import LoadingBar from '../components/panels/LoadingBar';
import Message from '../components/panels/Message';

var workflowName: String = '';

// const [hasPrevious, setHasPrevious] = createSignal(true);
// const [hasNext, setHasNext] = createSignal(true);
// const [params, setParams] = createSignal<ModuleJSON[]>();
const [loading, setLoading] = createSignal(false);
const [image, setImage] = createSignal<any>();
const [background, setBackground] = createSignal<BackgroundJSON>();
const [message, setMessage] = createSignal<[MessageJSON]>();
const [graph, setGraph] = createSignal<GraphJSON | undefined>();
const [showNav, setShowNav] = createSignal(false);
const [overlays, setOverlays] = createSignal<[OverlayJSON] | undefined>();
const [clickListener, setClickListener] = createSignal<ClickListener | undefined>();
const [loadedBytes, setLoadedBytes] = createSignal(0);

window.setLoadedBytes = setLoadedBytes;
var startingBytes = 0;
var finalBytes = 0;

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
  setLoading(false);

  const workflowsJson: WorkflowsJSON = await (await fetch('./mia/workflows/workflows.json')).json();

  const workflowJson: WorkflowJSON = workflowsJson.workflows.find(
    (workflow) => workflow.fullname === workflowName
  );

  setBackground(workflowJson.background);

  startingBytes = window.localLoadedBytes;
  finalBytes = 0;
  if (!window.cheerpjReady) finalBytes = window.TOTAL_INIT_BYTES;

  finalBytes = finalBytes + workflowJson.memory;
  console.log('Starting bytes ' + startingBytes);
  console.log('Final bytes ' + finalBytes);
  setLoading(true);
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
  const result = await processController.setWorkflow(workflowXML, workflowPath);

  setLoading(false);

  await updatePage(result);
}

async function updatePage(result: any) {
  // var clickParameter = getClickListenerParameter(result.modules);

  // if (clickParameter !== undefined)
  //   if (clickListener() == undefined)
  //     setClickListener(new ClickListener(clickParameter, updatePage));

  // setOverlays(resultJSON.overlays);
  var message = await (await result.getMessage()).toString();
  setMessage(await JSON.parse(message));

  setImage(result);
  // setGraph(resultJSON.graph);
  setShowNav(true);
}

export default function Workflow() {
  setLoading(true);
  setOverlays(undefined);
  // setParams(undefined);
  setImage(undefined);
  setGraph(undefined);
  // setMessage(undefined);
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

  return (
    <main class="space-y-0">
      <Show when={background()}>
        <Background backgroundJSON={background()} n={window.innerWidth / 20} />
      </Show>

      <Show when={loading()}>
        <LoadingBar
          startingBytes={startingBytes}
          finalBytes={finalBytes}
          loadedBytes={loadedBytes}
        />
      </Show>

      <Show when={!loading()}>
        <div class="container grid sm:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <Show when={image() || message() || graph()}>
              <MenuBar />
            </Show>
            <Show when={image()}>
              <SimpleIm
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
            {/* <Show when={message()}> */}
              <Message message={message} updatePage={updatePage} />
            {/* </Show> */}

            <Show when={graph()}>
              <Panel class="flex flex-1 justify-center flex-auto mt-4">
                <Graph graphJSON={graph()} imageJSON={image()}></Graph>
              </Panel>
            </Show>

            <Show when={showNav()}>
              <WorkflowNav previousDisabled={false} nextDisabled={false} updatePage={updatePage} />
            </Show>
          </div>
        </div>
      </Show>
    </main>
  );
}
