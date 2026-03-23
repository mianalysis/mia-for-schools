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

  const processController = window.proCon;
  const resultJSON = await JSON.parse(await processController.setParameter(
    moduleID,
    parameterName,
    parameterValue,
    parentGroupName,
    groupCollectionNumber
  ));

  updatePage(resultJSON);

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
  hex = hex.replace(/^#/, "");

  if (hex.length === 3)
    hex = hex.split("").map(c => c + c).join("");

  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `${r},${g},${b}`;

}
