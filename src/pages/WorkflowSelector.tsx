import { For, createSignal } from 'solid-js';

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
    setTimeout(() => {
      if (socketClient.connected) {
        socketClient.subscribe('/user/queue/workflows', (data) => {
          const response = JSON.parse(data.body);
          const workflowsJson = JSON.parse(response.body).workflows;
          setWorkflows(workflowsJson);
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
      <MenuBar title="" ismainpage={true}/>
      <h1 class="text-orange-400 text-5xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">Select an image</h1>
      <div class="container m-auto grid sm:grid-cols-2 md:grid-cols-1 gap-4 items-center">
        <For each={workflows()}>{(workflow) =>
          <a href={'./workflow?name=' + workflow.fullname}>
            <div class="w-full" style="position:relative;text-align:center">
              <img src={workflow.thumbnail} class="justify-center justify-self-center w-full saturate-0 hover:saturate-100 max-w-lg rounded-lg shadow-lg bg-white aspect-square content-center" />
              <div class={"text-yellow-400 text-3xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]"} style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">{workflow.displayname}</div>
            </div>
          </a>
        }
        </For>
      </div>
    </main>
  );
}

export default NavPage