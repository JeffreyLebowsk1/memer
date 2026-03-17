import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { BernieMemeOptions } from '../types';
import { makeCanvas, drawBackground } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 450;

/**
 * Renders the Bernie Sanders mittens meme:
 *   – Bernie sitting cross-armed with chunky brown mittens.
 *   – Caption text below (or overlaid on a background image).
 */
export async function renderBernie(options: BernieMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 26;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  await drawBackground(ctx, width, height, {
    backgroundColor: options.backgroundColor ?? '#e8eef5',
    backgroundImage: options.backgroundImage,
  });

  // Draw Bernie
  drawBernie(ctx, width, height);

  // Caption area
  const captionH = height * 0.2;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, height - captionH, width, captionH);

  drawCenteredText(ctx, options.captionText, width / 2, height - captionH + captionH * 0.15, width - 40, {
    fontSize,
    color: 'white',
    bold: true,
  });

  return canvas;
}

function drawBernie(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const cx = width * 0.38;
  const groundY = height * 0.82;
  const scale = (height * 0.65) / 280;

  // Coat (puffy grey winter coat)
  ctx.fillStyle = '#607d8b';
  ctx.beginPath();
  ctx.ellipse(cx, groundY - 80 * scale, 55 * scale, 90 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Coat highlight
  ctx.fillStyle = '#78909c';
  ctx.beginPath();
  ctx.ellipse(cx - 10 * scale, groundY - 90 * scale, 30 * scale, 60 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Coat collar / scarf (darker)
  ctx.fillStyle = '#455a64';
  ctx.beginPath();
  ctx.ellipse(cx, groundY - 155 * scale, 32 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.ellipse(cx, groundY - 195 * scale, 28 * scale, 32 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair (white, sparse, messy)
  ctx.fillStyle = '#e8e8e8';
  ctx.beginPath();
  ctx.ellipse(cx, groundY - 224 * scale, 28 * scale, 14 * scale, 0, 0, Math.PI, true);
  ctx.fill();
  // Messy wisps
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * 7 * scale, groundY - 220 * scale);
    ctx.quadraticCurveTo(
      cx + i * 8 * scale,
      groundY - 235 * scale + (i % 2 === 0 ? -5 * scale : 5 * scale),
      cx + i * 9 * scale,
      groundY - 228 * scale
    );
    ctx.stroke();
  }

  // Glasses (iconic blue frames)
  ctx.strokeStyle = '#1976d2';
  ctx.lineWidth = 2.5 * scale;
  ctx.fillStyle = 'rgba(200,230,255,0.3)';
  const glassY = groundY - 198 * scale;
  // Left lens
  ctx.beginPath();
  ctx.rect(cx - 26 * scale, glassY - 7 * scale, 20 * scale, 14 * scale);
  ctx.fill();
  ctx.stroke();
  // Right lens
  ctx.beginPath();
  ctx.rect(cx + 6 * scale, glassY - 7 * scale, 20 * scale, 14 * scale);
  ctx.fill();
  ctx.stroke();
  // Bridge
  ctx.beginPath();
  ctx.moveTo(cx - 6 * scale, glassY);
  ctx.lineTo(cx + 6 * scale, glassY);
  ctx.stroke();
  // Temple arms
  ctx.beginPath();
  ctx.moveTo(cx - 26 * scale, glassY);
  ctx.lineTo(cx - 32 * scale, glassY + 2 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 26 * scale, glassY);
  ctx.lineTo(cx + 32 * scale, glassY + 2 * scale);
  ctx.stroke();

  // Eyes (behind glasses — small & squinting a little)
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(cx - 16 * scale, glassY, 3 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 16 * scale, glassY, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Mouth (slight frown / neutral expression)
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(cx, groundY - 182 * scale, 6 * scale, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // MITTENS! (chunky, brown, crossed arms)
  // Left mitten
  ctx.fillStyle = '#795548';
  ctx.beginPath();
  ctx.ellipse(cx - 38 * scale, groundY - 105 * scale, 24 * scale, 16 * scale, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6d4c41';
  ctx.beginPath();
  ctx.ellipse(cx - 50 * scale, groundY - 100 * scale, 12 * scale, 9 * scale, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Right mitten
  ctx.fillStyle = '#795548';
  ctx.beginPath();
  ctx.ellipse(cx + 30 * scale, groundY - 112 * scale, 24 * scale, 16 * scale, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6d4c41';
  ctx.beginPath();
  ctx.ellipse(cx + 40 * scale, groundY - 103 * scale, 12 * scale, 9 * scale, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Mittens pattern (horizontal stripes)
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 2 * scale;
  [-6, 0, 6].forEach((dy) => {
    ctx.beginPath();
    ctx.arc(cx - 38 * scale, groundY - 105 * scale + dy * scale, 22 * scale, -0.5, 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 30 * scale, groundY - 112 * scale + dy * scale, 22 * scale, Math.PI + 0.5, Math.PI * 2 - 0.5);
    ctx.stroke();
  });

  // Legs / lower body (dark pants)
  ctx.fillStyle = '#37474f';
  ctx.fillRect(cx - 28 * scale, groundY - 22 * scale, 56 * scale, 22 * scale);

  // Shoes / boots (dark)
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.ellipse(cx - 14 * scale, groundY + 2 * scale, 16 * scale, 7 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 14 * scale, groundY + 2 * scale, 16 * scale, 7 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}
