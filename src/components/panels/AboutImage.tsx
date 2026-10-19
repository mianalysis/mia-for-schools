import { Accessor, Match, Switch } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Button from '../controls/Button';

interface Props {
  aboutText: Accessor<string>;
  closePanel: Function;
}

export default function AboutImage(props: Props) {
  const navigate = useNavigate();

  return (
    <div
      class="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-[95vw] max-w-4xl h-fit z-40 rounded-2xl shadow-lg p-2"
      style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75);"
    >
      <h1 class="text-gray-600 mt-8 mb-8 text-4xl md:text-6xl font-bold">
        About this picture
      </h1>
      <p class="text-gray-600 ml-2 mr-2 text-2xl mb-16">
        {props.aboutText()}
      </p>
      <Button
        class="!w-fit ml-auto mr-auto p-2 pl-8 pr-8 mb-8 h-auto"
        onClick={() => props.closePanel()}
      >
        Close
      </Button>
    </div>
  );
}
