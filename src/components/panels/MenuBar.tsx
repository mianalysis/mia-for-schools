import { Show } from 'solid-js';
import Panel from './Panel';

interface Props {
  class?: string;
  style?: string;
}

export default function MenuBar(props: Props) {
  return (
    <Panel
      class={`flex max-w-lg mb-4 items-center justify-center sm:items-stretch ${props.class ?? ''}`}
      style={props.style ?? ''}
    >
      <a
        href="./"
        class="flex flex-shrink-0 items-center transition duration-150 ease-in-out hover:scale-110"
      >
        <img class="h-10 w-auto" src="./images/home-svgrepo-com.svg" alt="Go to home" />
        <h2 class="text-gray-600 ml-4 text-2xl">Select a new activity</h2>
      </a>
    </Panel>
  );
}
