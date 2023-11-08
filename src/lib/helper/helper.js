/**
 *
 * @param {number} second
 * @returns
 */
export const hours = (second) => {
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second - hours * 3600) / 60);
  const seconds = Math.floor(second - hours * 3600 - minutes * 60);

  return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(
    seconds,
    2
  )}`;
};

/**
 * @param {number} second
 */
export const minutes = (second) => {
  const minutes = Math.floor(second / 60);
  const seconds = Math.floor(second - minutes * 60);

  return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`;
};

/**
 * with parameters
 * num is the number to be padded
 * places is the number of places to be padded
 * @param {number} num
 * @param {number} places
 * @returns
 */
export const zeroPad = (num, places) =>
  String(num).padStart(places, "0");

/**
 * @param {HTMLCanvasElement} canvas
 * @returns
 */
export const createBufferFromCanvas = (canvas) => {
  let buffer = document.createElement("canvas");
  let bufferCtx = buffer.getContext("2d");

  buffer.width = canvas.width;
  buffer.height = canvas.height;
  buffer.style.display = "none";

  bufferCtx.drawImage(canvas, 0, 0);

  return { buffer, bufferCtx };
};
