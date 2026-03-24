/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import './styles/index.css';

console.log('index.tsx started, cheerpjReady:', (window as any).cheerpjReady);

await new Promise<void>((resolve) => {
  if ((window as any).cheerpjReady) {
    resolve();
  } else {
    window.addEventListener('cheerpj-ready', () => resolve(), { once: true });
  }
});

console.log('Running main page now');

render(() => <App />, document.getElementById('root'));
