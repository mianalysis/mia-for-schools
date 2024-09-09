import { For, Show, createSignal } from 'solid-js';

import { socketClient } from '../lib/client';
import MenuBar from '../components/MenuBar';

const [workflows, setWorkflows] = createSignal<WorkflowJSON[]>();

const awaitConnect = async (awaitConnectConfig) => {
  const {
    retries = 3,
    curr = 0,
    timeinterval = 100,
  } = {};

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      if (socketClient.connected) {
        subscribeToWorkflows();
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

function subscribeToWorkflows() {
  socketClient.subscribe('/user/queue/workflows', (data) => {
    const response = JSON.parse(data.body);
    const workflowsJson = JSON.parse(response.body).workflows;
    setWorkflows(workflowsJson);
  });
}
function requestAvailableWorkflows() {
  socketClient.publish({
    destination: '/app/getworkflows',
    body: JSON.stringify({})
  });
}

function NavPage() {
  if (socketClient.connected)
    requestAvailableWorkflows();

  return (
    <main class="space-y-8">
      <Show when={workflows()}>
        <MenuBar title="" ismainpage={true} />
      </Show>
      <h1 class="text-white text-4xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] w-full animate-in fade-in duration-500">Click a picture to learn more</h1>
      <div class="container m-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
        <For each={workflows()}>{(workflow) =>
          <a href={'./workflow?name=' + workflow.fullname}>
            <div class="w-full animate-in fade-in duration-200 hover:scale-105" style="position:relative;text-align:center">
              <img src={workflow.thumbnail} class="justify-center justify-self-center w-full saturate-0 hover:saturate-100 max-w-lg rounded-lg shadow-lg aspect-square content-center" />
              <div class={"text-yellow-400 text-3xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]"} style="pointer-events: none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">{workflow.displayname}</div>
            </div>
          </a>
        }
        </For>
      </div>
    </main>
  );
}

export default NavPage
