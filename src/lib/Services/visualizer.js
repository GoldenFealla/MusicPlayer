import { createBufferFromCanvas } from "../helper/helper";

/**
 * @typedef {(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, height: number, width: number, analyser: AnalyserNode) => void} VisualizerFunction
 */

/**
 * @type {VisualizerFunction}
 */
export const renderByBar = (canvas, ctx, height, width, analyser) => {
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.clearRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  if (analyser) {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const divisor = 32;
    const barWidth = (width / bufferLength) * divisor;

    let x = 0;

    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < bufferLength / divisor; i++) {
      let barHeight = ((dataArray[i] / 2) * canvas.height) / 255 + 1;
      ctx.fillStyle = "white";
      ctx.fillRect(
        -canvas.width / 2 + x,
        -barHeight - 1,
        barWidth,
        barHeight + 1
      );
      x += barWidth;
    }

    let buffer = createBufferFromCanvas(canvas);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(buffer.buffer, 0, 0, canvas.width, canvas.height);
  }
};
