import { createStore } from 'solid-js/store';

const [store, setStore] = createStore({ imageHash: '' });

export { store, setStore };
