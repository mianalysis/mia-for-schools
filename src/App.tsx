import { Show, createSignal } from 'solid-js';
import Image from './components/Image';

import { Client } from '@stomp/stompjs';

const API_HOST = import.meta.env.VITE_API_HOST;

if (typeof API_HOST !== 'string') {
  throw new Error('VITE_API_HOST is not defined');
}

function App() {
  const brokerURL = `ws://${API_HOST}/ws`;

  const client = new Client({
    brokerURL,
    onConnect: () => {
      client.subscribe('/user/queue/result', data => {
        const response = JSON.parse(data.body);

        // Set the source of the image to the Base64-encoded image data
        setSource(`data:${response.headers['Content-Type']};base64,${response.body}`);
        setLoading(false);
      });
    },
    onDisconnect: () => {
      window.alert('disconnected');
    },
  });

  client.activate();

  const [threshold, setThreshold] = createSignal(1.0);

  const increaseThreshold = () => {
    setThreshold(round(threshold() + 0.1));
    update();
  };
  const decreaseThreshold = () => {
    setThreshold(round(threshold() - 0.1));
    update();
  };

  const [loading, setLoading] = createSignal(true);
  const [source, setSource] = createSignal<string>();

  const round = (value: number) => Math.round(value * 10) / 10;

  function update() {
    setLoading(true);
    client.publish({
      destination: '/app/process',
      body: JSON.stringify({ threshold: threshold() }),
    });
  }

  return (
    <main class="space-y-8">
      <h1>MIA Demo</h1>

      <Show when={source()}>
        <Image source={source()!} loading={loading()} />
      </Show>

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
