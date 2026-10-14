import { Accessor, Setter } from 'solid-js';
import Panel from './Panel';
import StarCounter from './StarCounter';
import HelpButton from '../controls/HelpButton';

type Props = {
  class?: string;
  style?: string;
  starCount: Accessor<number>;
  setStarCount: Setter<number>;
};

export default function WelcomeBar(props: Props) {
  return (
    <div class={`flex w-full mb-4 ${props.class ?? ''}`} style={props.style ?? ''}>
      <StarCounter class="mr-4" starCount={props.starCount} setStarCount={props.setStarCount} />

      <Panel class="items-center justify-center sm:items-stretch mr-4 w-full">
        <div class="font-[pixel] text-3xl text-gray-600">Click a tile</div>
      </Panel>

      <HelpButton />
    </div>
  );
}
