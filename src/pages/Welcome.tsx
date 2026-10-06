import Background, { getDefaultBackground } from '../components/Background';
import Help from '../components/panels/Help';

export default function Welcome() {
    return (
    <main class="space-y-0">
      <Background firstLoad={true} backgroundJSON={getDefaultBackground()} n={window.innerWidth / 20} />
      <Help welcomeScreen={true}></Help>
    </main>
  );
}
