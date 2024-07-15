import { For, createSignal } from 'solid-js';

import { socketClient } from '../lib/client';
import MenuBar from '../components/MenuBar';

// var workflowsJson = undefined;

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
      <MenuBar title="Select a workflow" />
      <div class="container m-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <For each={workflows()}>{(workflow) =>
          <a href={'./workflow?name='+workflow.name}>
            <div style="position:relative;text-align:center">
              <img src={workflow.thumbnail} class="max-w-lg rounded-lg shadow-lg bg-white aspect-square content-center" > {workflow.name}</img>
              <div class="top-left font-red" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">{workflow.name}</div>
            </div>
          </a>
        }
        </For>
      </div>
    </main>
  );
}

export default NavPage