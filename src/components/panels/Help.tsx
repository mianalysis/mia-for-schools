import { Match, Switch } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Button from '../controls/Button';

interface Props {
  welcomeScreen: boolean;
  closePanel?: Function;
}

export default function Intro(props: Props) {
  const navigate = useNavigate();

  return (
    <div
      class="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-[95vw] max-w-4xl h-fit z-40 rounded-2xl shadow-lg p-2"
      style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75);"
    >
      <h1 class="text-gray-600 mt-8 mb-8 text-4xl md:text-6xl font-bold">Image Explorers</h1>
      <p class="text-gray-600 ml-2 mr-2 text-2xl mb-16">
        In this activity, you'll play a series of games that will teach you about pictures and how
        computers can understand them.
        <br />
        <br />
        Complete challenges to earn ⭐ stars. You can see how many stars you have in the top-right
        corner.
      </p>
      <Switch>
        <Match when={props.welcomeScreen}>
          <Button class="!w-fit ml-auto mr-auto mb-8 h-auto" onClick={() => navigate('./workflows')}>
            Ready? Let's get started!
          </Button>
        </Match>
        <Match when={!props.welcomeScreen}>
          <Button class="!w-fit ml-auto mr-auto mb-8 h-auto" onClick={() => props.closePanel()}>
            Close
          </Button>
        </Match>
      </Switch>
    </div>
  );
}
