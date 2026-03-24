/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import './styles/index.css';

await new Promise<void>((resolve) => {
  if ((window as any).cj) {
    resolve();
  } else {
    window.addEventListener('cheerpj-ready', () => resolve(), { once: true });
  }
});

render(() => <App />, document.getElementById('root'));
