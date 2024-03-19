import { socketClient } from './client';

export function debounce(fn: (...args:any[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args:any[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => fn(args), delay);
  };
}

export function sendParameter(moduleID: String, parameterName: String, parameterValue: String) {
  socketClient.publish({
    destination: '/app/setparameter',
    body: JSON.stringify({ moduleID: moduleID, parameterName: parameterName, parameterValue: parameterValue })
  });
}
