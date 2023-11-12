import { Client } from '@stomp/stompjs';
import axios from 'axios';

const API_HOST = import.meta.env.VITE_API_HOST;

if (typeof API_HOST !== 'string') {
  throw new Error('VITE_API_HOST is not defined');
}

const SOCKET_PROTOCOL = import.meta.env.VITE_SSL === 'true' ? 'wss' : 'ws';

const brokerURL = `${SOCKET_PROTOCOL}://${API_HOST}/ws`;

export const socketClient = new Client({
  brokerURL,
  onDisconnect: () => {
    window.alert('disconnected');
  },
});

socketClient.activate();

const REST_PROTOCOL = import.meta.env.VITE_SSL === 'true' ? 'https' : 'http';

const restURL = `${REST_PROTOCOL}://${API_HOST}`;

export const restClient = axios.create({
  baseURL: restURL,
});
