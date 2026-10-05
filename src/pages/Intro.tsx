import { useNavigate } from '@solidjs/router';
import Background, { getDefaultBackground } from '../components/Background';
import Button from '../components/controls/Button';
import Panel from '../components/panels/Panel';

export default function Intro() {
  const navigate = useNavigate();

  return (
    <main class="space-y-0">
      <Background backgroundJSON={getDefaultBackground()} n={window.innerWidth / 20} />
      <Panel class="max-w-2xl text-gray-600">
        <h1 class="mt-8 mb-8 text-6xl font-bold">Image Explorers</h1>
        <p class="pl-8 pr-8 text-2xl mb-16">
          In this activity, you'll play a series of games that will teach you about pictures and how
          computers can understand them.
          <br />
          <br />
          Complete challenges to earn ⭐ stars. You can see how many stars you have in the top-right
          corner.
        </p>
        <Button class="!w-fit pl-4 pr-4 mb-8  h-auto" onClick={() => navigate('./workflows')}>Ready? Let's get started!</Button>
      </Panel>
    </main>
  );
}
