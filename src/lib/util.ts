export function debounce(fn: (...args: any[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => fn(args), delay);
  };
}

export async function sendParameter(
  moduleID: String,
  parameterName: String,
  parameterValue: String,
  parentGroupName: String,
  groupCollectionNumber: number,
  updatePage: Function
) {
  console.log("Send parameter");
  let t1 = Date.now();
  const processController = window.proCon;
  let t2 = Date.now();
  const result = await processController.setParameter(
    moduleID,
    parameterName,
    parameterValue,
    parentGroupName,
    groupCollectionNumber
  );

  let t3 = Date.now();
  console.log(result);
  updatePage(result);
  let t4 = Date.now();

  console.log('T1: ' + (t2 - t1));
  console.log('T2: ' + (t3 - t2));
  console.log('T3: ' + (t4 - t3));
}

// From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb (Accessed 2024-07-19)
export function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

// From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb (Accessed 2024-07-19)
export function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3)
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');

  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `${r},${g},${b}`;
}
