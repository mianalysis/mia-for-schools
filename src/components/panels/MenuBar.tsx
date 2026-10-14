import { Accessor, createSignal, Setter, Show } from 'solid-js';
import Panel from './Panel';
import Intro from './Help';
import StarCounter from './StarCounter';
import HelpButton from '../controls/HelpButton';

interface Props {
  class?: string;
  style?: string;
  starCount: Accessor<number>;
  setStarCount: Setter<number>;
}

export default function MenuBar(props: Props) {
  return (
    <div class={`flex w-full mb-4 ${props.class ?? ''}`} style={props.style ?? ''}>
      <StarCounter class="mr-4" starCount={props.starCount} setStarCount={props.setStarCount} />

      <a href="./workflows" class="flex-1 w-full mr-4">
        <Panel
          class={`justify-center w-full transition !duration-150 ease-in-out hover:scale-105 text-gray-600 text-3xl`}
        >
          Home
        </Panel>
      </a>

      <HelpButton />
    </div>
  );
}
