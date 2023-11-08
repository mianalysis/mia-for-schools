import { Show, createSignal } from 'solid-js';
import Image from './components/Image';

import { debounce } from './lib/util';
import { client } from './lib/client';

function App() {
  client.onConnect = () => {
    client.subscribe('/user/queue/result', (data) => {
      const response = JSON.parse(data.body);

      // Set the source of the image to the Base64-encoded image data
      setSource(`data:${response.headers['Content-Type']};base64,${response.body}`);
      setLoading(false);
    });

    client.subscribe('/user/queue/parameters', (data) => {
      const response = JSON.parse(data.body);

      const paramJson = JSON.parse(response.body);

      // Set the text to show the returned JSON
      var paramString = "";
      for (var i = 0; i < paramJson.modules.length; i++) {
        paramString = paramString + "Module: " + paramJson.modules[i].name + "\r\n";
        for (var j = 0; j < paramJson.modules[i].parameters.length; j++) {
          paramString = paramString + "    Parameter: " + paramJson.modules[i].parameters[j].name + " (" + paramJson.modules[i].parameters[j].value+")\r\n";
        }
      }
      setParams(paramString);

    });

    requestParameters();
    updateImage();

  };

  const [threshold, setThreshold] = createSignal(1.0);
  const [params, setParams] = createSignal("Hang on");

  const [loading, setLoading] = createSignal(true);
  const [source, setSource] = createSignal<string>();

  function onInput(e: InputEvent) {
    const target = e.target as HTMLInputElement;

    const t = parseFloat(target.value);

    setThreshold(t);
    debouncedUpdatedImage();
    requestParameters();

  }

  const debouncedUpdatedImage = debounce(updateImage, 100);

  function updateImage() {
    setLoading(true);

    client.publish({
      destination: '/app/process',
      body: JSON.stringify({ threshold: threshold() }),
    });
  }

  function requestParameters() {
    setParams("Requesting parameters");

    client.publish({
      destination: '/app/getparameters',
      body: JSON.stringify({})
    });
  }

  return (
    <main class="space-y-8">
      <h1>MIA Demo</h1>

      <Show when={source()}>
        <Image source={source()!} loading={loading()} />
      </Show>

      <input type="range" min="0" max="5" step="0.1" value={threshold()} onInput={onInput} />

      <p class="text-[#888] font-mono">Threshold {threshold()}</p>

      <pre>{params()}</pre>
    </main>
  );
}

export default App;
