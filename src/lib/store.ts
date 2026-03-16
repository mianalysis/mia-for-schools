import { createStore } from 'solid-js/store';

var cj;
const [store, setStore] = createStore({ imageHash: '' });

export { store, setStore };
