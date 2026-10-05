import Background, { getDefaultBackground } from '../components/Background';
import Intro from '../components/panels/Help';

export default function Welcome() {
    return (
    <main class="space-y-0">
      <Background backgroundJSON={getDefaultBackground()} n={window.innerWidth / 20} />
      <Intro welcomeScreen={true}></Intro>
    </main>
  );
}
