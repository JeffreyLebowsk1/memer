import { Canvas, CanvasRenderingContext2D, CanvasTextAlign } from 'canvas';
import { OneDoesNotSimplyMemeOptions } from '../types';
import { makeCanvas, drawBackground } from '../utils/canvas';
import { drawOutlinedText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 450;
const BAR_HEIGHT_RATIO = 0.22;

/**
 * Renders the "One Does Not Simply" meme:
 *   – Dark image with black bars at top and bottom.
 *   – White outlined text in Impact font on the bars.
 */
export async function renderOneDoesNotSimply(
  options: OneDoesNotSimplyMemeOptions
): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? Math.round(width / 11);
  const barH = Math.round(height * BAR_HEIGHT_RATIO);
  const prefixText = options.prefixText ?? 'One does not simply';

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Main image area (between bars)
  await drawBackground(ctx, width, height, {
    backgroundColor: options.backgroundColor ?? '#2c2c2c',
    backgroundImage: options.backgroundImage,
  });

  // Draw Boromir placeholder illustration if no image
  if (!options.backgroundImage) {
    drawBoromirPlaceholder(ctx, width, height);
  }

  // Top black bar
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, barH);

  // Bottom black bar
  ctx.fillStyle = 'black';
  ctx.fillRect(0, height - barH, width, barH);

  const textOpts = {
    fontSize,
    fontFamily: 'Impact',
    fillColor: 'white',
    strokeColor: 'black',
    strokeWidth: Math.max(2, Math.round(fontSize / 12)),
    align: 'center' as CanvasTextAlign,
  };

  // Top bar text
  drawOutlinedText(ctx, prefixText, width / 2, barH * 0.05, width - 16, textOpts);

  // Bottom bar text
  drawOutlinedText(ctx, options.actionText, width / 2, height - barH + barH * 0.05, width - 16, textOpts);

  return canvas;
}

/**
 * Draws a simplified Boromir (seated warrior) placeholder.
 */
function drawBoromirPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const cx = width / 2;
  const cy = height * 0.55;
  const barH = height * BAR_HEIGHT_RATIO;
  const imageH = height - 2 * barH;
  const scale = imageH / 300;

  // Background glow
  const radGrad = ctx.createRadialGradient(cx, cy, 20 * scale, cx, cy, 180 * scale);
  radGrad.addColorStop(0, '#5c4a28');
  radGrad.addColorStop(1, '#1a1200');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, barH, width, imageH);

  // Body armor
  ctx.fillStyle = '#4a3c28';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20 * scale, 60 * scale, 80 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  const headCy = cy - 70 * scale;
  const headR = 40 * scale;
  ctx.fillStyle = '#c8a882';
  ctx.beginPath();
  ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair (medium brown)
  ctx.fillStyle = '#5c3a1e';
  ctx.beginPath();
  ctx.ellipse(cx, headCy - headR * 0.4, headR * 1.1, headR * 0.65, 0, 0, Math.PI, true);
  ctx.fill();
  // Shoulder-length
  ctx.fillRect(cx - headR * 1.1, headCy - headR * 0.3, headR * 0.3, headR * 1.3);
  ctx.fillRect(cx + headR * 0.8, headCy - headR * 0.3, headR * 0.3, headR * 1.3);

  // Eyes (weary, knowing look)
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(cx - headR * 0.32, headCy - headR * 0.08, headR * 0.1, 0, Math.PI * 2);
  ctx.arc(cx + headR * 0.32, headCy - headR * 0.08, headR * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Beard
  ctx.fillStyle = '#5c3a1e';
  ctx.beginPath();
  ctx.ellipse(cx, headCy + headR * 0.55, headR * 0.65, headR * 0.35, 0, 0, Math.PI);
  ctx.fill();

  // Arms crossed
  ctx.strokeStyle = '#c8a882';
  ctx.lineWidth = headR * 0.3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 55 * scale, cy - 10 * scale);
  ctx.lineTo(cx + 20 * scale, cy + 5 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 55 * scale, cy - 10 * scale);
  ctx.lineTo(cx - 20 * scale, cy + 5 * scale);
  ctx.stroke();
}
