import { createSignal, Show } from 'solid-js';
import Intro from '../panels/Help';
import Panel from '../panels/Panel';

export default function HelpButton() {
  const [showHelp, setShowHelp] = createSignal(false);

  function closeHelpPanel() {
    setShowHelp(false);
  }

  return (
    <div class="flex">
      <Panel
        class="aspect-square w-auto transition !duration-150 ease-in-out hover:scale-110 text-gray-600 text-3xl cursor-pointer"
        onClick={() => setShowHelp(!showHelp())}
      >
        ?
      </Panel>

      <Show when={showHelp()}>
        <Intro welcomeScreen={false} closePanel={closeHelpPanel} />
      </Show>
    </div>
  );
}
