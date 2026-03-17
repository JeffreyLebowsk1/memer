import { createCanvas, loadImage, Canvas, CanvasRenderingContext2D } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Creates a canvas with the given dimensions.
 */
export function makeCanvas(width: number, height: number): Canvas {
  return createCanvas(width, height);
}

/**
 * Loads a background image onto the canvas context, scaled to fill the canvas.
 */
export async function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: { backgroundColor?: string; backgroundImage?: string }
): Promise<void> {
  if (options.backgroundImage) {
    const img = await loadImage(options.backgroundImage);
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.fillStyle = options.backgroundColor ?? '#e0e0e0';
    ctx.fillRect(0, 0, width, height);
  }
}

/**
 * Converts a Canvas to a Buffer synchronously.
 */
export function canvasToBuffer(canvas: Canvas, format: 'png' | 'jpeg' = 'png'): Buffer {
  if (format === 'jpeg') {
    return canvas.toBuffer('image/jpeg');
  }
  return canvas.toBuffer('image/png');
}

/**
 * Saves a canvas to a file.
 */
export async function saveCanvasToFile(
  canvas: Canvas,
  filePath: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
  const buf = canvasToBuffer(canvas, format);
  await fs.promises.writeFile(filePath, buf);
}

/**
 * Draws a rounded rectangle path on a canvas context.
 */
export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
