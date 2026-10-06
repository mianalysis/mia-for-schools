import { createSignal, Show } from 'solid-js';
import Panel from './Panel';
import Button from '../controls/Button';
import Intro from './Help';

interface Props {
  class?: string;
  style?: string;
}

export default function MenuBar(props: Props) {
  const [showHelp, setShowHelp] = createSignal(false);

  function closeHelpPanel() {
    setShowHelp(false);
  }

  return (
    <div class={`flex w-full mb-4 ${props.class ?? ''}`} style={props.style ?? ''}>
      <Panel
        class="mr-4 aspect-square w-auto transition !duration-150 ease-in-out hover:scale-110 text-gray-600 text-3xl cursor-pointer"
        onClick={() => setShowHelp(!showHelp())}
      >
        ?
      </Panel>

      <a href="./workflows" class="flex-1 w-full">
        <Panel
          class={`justify-center w-full transition !duration-150 ease-in-out hover:scale-105 text-gray-600 text-3xl`}
        >
          Select a new game
        </Panel>
      </a>

      <Show when={showHelp()}>
        <Intro welcomeScreen={false} closePanel={closeHelpPanel}/>
      </Show>
    </div>
  );
}
