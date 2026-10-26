import { Match, Switch } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Button from '../controls/Button';
import Star from '../svgs/Star';
import Lightbulb from '../svgs/Lightbulb';

interface Props {
  welcomeScreen: boolean;
  closePanel?: Function;
}

export default function Help(props: Props) {
  const navigate = useNavigate();

  return (
    <div
      class="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-[95vw] max-w-4xl h-fit z-40 rounded-2xl shadow-lg p-2"
      style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75);"
    >
      <h1 class="text-gray-600 mt-8 mb-8 text-4xl md:text-6xl font-bold">
        Welcome, Image Explorers!
      </h1>
      <p class="text-gray-600 ml-2 mr-2 text-2xl mb-16">
        As image explorers, you'll play a series of games that will teach you about pictures and how
        computers can understand and work with them.
        <br />
        <br />
        Complete challenges to earn <Star svgClass='inline w-6 mb-1' pathStyle='fill:none;stroke:#4a5565'/>. You can see how many stars you have in the top-left
        corner.
        <br />
        <br />
        To learn more about any of the pictures you see, click the <Lightbulb svgClass='inline w-7 mb-2' svgStyle="fill:none; stroke:#4a5565"/> button in the bottom-left corner of each picture.
      </p>
      <Switch>
        <Match when={props.welcomeScreen}>
          <Button
            class="!w-fit ml-auto mr-auto p-2 pl-4 pr-4 mb-8 h-auto"
            onClick={() => navigate('./workflows')}
          >
            Ready? Let's get started!
          </Button>
        </Match>
        <Match when={!props.welcomeScreen}>
          <Button
            class="!w-fit ml-auto mr-auto p-2 pl-8 pr-8 mb-8 h-auto"
            onClick={() => props.closePanel()}
          >
            Close
          </Button>
        </Match>
      </Switch>
    </div>
  );
}
