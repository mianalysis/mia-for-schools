import { For, createSignal } from 'solid-js';

import Background, { getDefaultBackground } from '../components/Background';
import WelcomeBar from '../components/panels/WelcomeBar';
import WorkflowTile from '../components/panels/WorkflowTile';

const [workflows, setWorkflows] = createSignal<WorkflowJSON[]>();


async function loadWorkflows() {
  const response = await fetch('./mia/workflows/workflows.json');
  const workflowsJson = await response.json();

  setWorkflows(workflowsJson.workflows);
}

function NavPage() {
  loadWorkflows();

  return (
    <main class="space-y-0">
      <Background backgroundJSON={getDefaultBackground()} n={window.innerWidth / 20} />
      <div class="container m-auto grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
        <WelcomeBar class="mb-4 text-2xl sm:col-span-2 md:col-span-3"/>
        <For each={workflows()}>
          {(workflow) => (
            <WorkflowTile workflow={workflow} />
          )}
        </For>
      </div>
    </main>
  );
}

export default NavPage;
