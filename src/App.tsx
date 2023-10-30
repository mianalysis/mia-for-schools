import { createSignal } from 'solid-js';
import Image from './components/Image';

const API_URL = import.meta.env.VITE_API_URL;

if (typeof API_URL !== 'string') {
  throw new Error('VITE_API_URL is not defined');
}

function App() {
  const [threshold, setThreshold] = createSignal(1.0);

  const increaseThreshold = () => setThreshold(round(threshold() + 0.1));
  const decreaseThreshold = () => setThreshold(round(threshold() - 0.1));

  const round = (value: number) => Math.round(value * 10) / 10;

  const source = () => `${API_URL}/mia?threshold=${threshold()}`;

  return (
    <main class="space-y-8">
      <h1>MIA Demo</h1>

      <Image source={source()} />

      <div class="space-x-2">
        <button type="button" onclick={increaseThreshold}>
          Increase
        </button>
        <button type="button" onclick={decreaseThreshold}>
          Decrease
        </button>
      </div>

      <p class="text-[#888] font-mono">Threshold {threshold()}</p>
    </main>
  );
}

export default App;
