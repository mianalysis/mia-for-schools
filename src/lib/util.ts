import { socketClient } from './client';
import { store } from './store';

export function debounce(fn: (...args: any[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => fn(args), delay);
  };
}

export function sendParameter(moduleID: String, parameterName: String, parameterValue: String, parentGroupName: String, groupCollectionNumber: number) {
  socketClient.publish({
    destination: '/app/setparameter',
    body: JSON.stringify({ moduleID: moduleID, parameterName: parameterName, parameterValue: parameterValue, parentGroupName: parentGroupName, groupCollectionNumber: groupCollectionNumber, imageHash: store.imageHash })
  });
}

// From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb (Accessed 2024-07-19)
export function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb (Accessed 2024-07-19)
export function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}