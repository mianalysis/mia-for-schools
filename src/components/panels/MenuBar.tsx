import { createSignal, Show } from 'solid-js';
import Panel from './Panel';
import Intro from './Help';
import StarCounter from './StarCounter';

interface Props {
  class?: string;
  style?: string;
  starCount: Function;
  setStarCount: Function;
}

export default function MenuBar(props: Props) {
  const [showHelp, setShowHelp] = createSignal(false);
  
  function closeHelpPanel() {
    setShowHelp(false);
  }

  return (
    <div class={`flex w-full mb-4 ${props.class ?? ''}`} style={props.style ?? ''}>
      <a href="./workflows" class="flex-1 w-full mr-4">
        <Panel
          class={`justify-center w-full transition !duration-150 ease-in-out hover:scale-105 text-gray-600 text-3xl`}
        >
          Home
        </Panel>
      </a>

      <StarCounter starCount={props.starCount} setStarCount={props.setStarCount}/>

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
