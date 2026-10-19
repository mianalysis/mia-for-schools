import { Accessor, Setter } from 'solid-js';
import Lightbulb from '../svgs/Lightbulb';

interface Props {
    showAbout: Accessor<boolean>;
    setShowAbout: Setter<boolean>
}

export default function AboutButton(props: Props) {
  return (
    <div class="flex">
      <div
        class="absolute left-0 bottom-0 flex z-20 rounded-xl overflow-visible shadow-lg bg-white 
      opacity-40 hover:opacity-75 w-8 h-8 m-2 cursor-pointer"
        onClick={() => props.setShowAbout(!props.showAbout())}
      >
        <Lightbulb svgClass="m-1 h-auto" svgStyle="fill:none; stroke:#4a5565" />
      </div>
    </div>
  );
}
