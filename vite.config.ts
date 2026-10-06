import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/mia-for-schools/',
  plugins: [
    solid(),
    nodePolyfills(),
    tailwindcss(),
  ],
  build: {
    target: 'esnext',
  },
});
