import { Client } from '@stomp/stompjs';

const API_HOST = import.meta.env.VITE_API_HOST;

if (typeof API_HOST !== 'string') {
  throw new Error('VITE_API_HOST is not defined');
}

const PROTOCOL = import.meta.env.VITE_SSL === 'true' ? 'wss' : 'ws';

const brokerURL = `${PROTOCOL}://${API_HOST}/ws`;

export const client = new Client({
  brokerURL,
  onDisconnect: () => {
    window.alert('disconnected');
  },
});

client.activate();
