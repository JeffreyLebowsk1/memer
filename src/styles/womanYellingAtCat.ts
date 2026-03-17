import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { WomanYellingAtCatMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 400;

/**
 * Renders the Woman Yelling at Cat meme:
 *   – Left panel: woman angrily pointing at camera (illustrated placeholder).
 *   – Right panel: smug white cat sitting at a dinner table.
 */
export async function renderWomanYellingAtCat(
  options: WomanYellingAtCatMemeOptions
): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 22;
  const halfW = Math.floor(width / 2);

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // ── Left panel (woman) ────────────────────────────────────────────────────
  ctx.fillStyle = '#fce4ec';
  ctx.fillRect(0, 0, halfW, height);
  drawAngryWoman(ctx, halfW, height);

  // Caption below woman figure
  drawCenteredText(ctx, options.womanText, halfW / 2, height - 70, halfW - 20, {
    fontSize,
    color: '#c62828',
    bold: true,
  });

  // ── Right panel (cat) ─────────────────────────────────────────────────────
  ctx.fillStyle = '#e8f5e9';
  ctx.fillRect(halfW, 0, halfW, height);
  drawSmugCat(ctx, halfW, height);

  // Caption below cat
  drawCenteredText(ctx, options.catText, halfW + halfW / 2, height - 70, halfW - 20, {
    fontSize,
    color: '#2e7d32',
    bold: true,
  });

  // Divider line
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(halfW, 0);
  ctx.lineTo(halfW, height);
  ctx.stroke();

  return canvas;
}

function drawAngryWoman(ctx: CanvasRenderingContext2D, halfW: number, height: number): void {
  const cx = halfW / 2;
  const headR = height * 0.13;
  const bodyTop = height * 0.38;
  const bodyH = height * 0.3;

  // Body (dress)
  ctx.fillStyle = '#e91e63';
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.9, bodyTop);
  ctx.lineTo(cx + headR * 0.9, bodyTop);
  ctx.lineTo(cx + headR * 1.4, bodyTop + bodyH);
  ctx.lineTo(cx - headR * 1.4, bodyTop + bodyH);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.arc(cx, height * 0.28, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair (dark)
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.ellipse(cx, height * 0.15, headR * 1.05, headR * 0.65, 0, 0, Math.PI, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - headR, height * 0.25, headR * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Angry expression (furrowed brow + open mouth)
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.4, height * 0.24);
  ctx.lineTo(cx - headR * 0.15, height * 0.26);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + headR * 0.15, height * 0.26);
  ctx.lineTo(cx + headR * 0.4, height * 0.24);
  ctx.stroke();

  ctx.fillStyle = '#b71c1c';
  ctx.beginPath();
  ctx.arc(cx, height * 0.31, headR * 0.18, 0, Math.PI);
  ctx.fill();

  // Pointing arm
  ctx.strokeStyle = '#f5c5a3';
  ctx.lineWidth = headR * 0.28;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + headR * 0.8, bodyTop + bodyH * 0.25);
  ctx.lineTo(halfW + headR * 0.3, height * 0.35);
  ctx.stroke();
}

function drawSmugCat(ctx: CanvasRenderingContext2D, halfW: number, height: number): void {
  const cx = halfW + halfW / 2;
  const headR = height * 0.15;
  const tableY = height * 0.6;

  // Table
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(halfW + 10, tableY, halfW - 20, height * 0.08);
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(halfW + 20, tableY + height * 0.08, halfW * 0.15, height * 0.25);
  ctx.fillRect(halfW + halfW - 40, tableY + height * 0.08, halfW * 0.15, height * 0.25);

  // Plate
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(cx, tableY - height * 0.02, halfW * 0.22, height * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cat body (white fur)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(cx, tableY - headR * 1.1, headR * 0.85, headR * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cat head
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(cx, tableY - headR * 2.4, headR, 0, Math.PI * 2);
  ctx.fill();

  // Cat ears
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1.5;
  [[cx - headR * 0.6, tableY - headR * 3.4], [cx + headR * 0.6, tableY - headR * 3.4]].forEach(
    ([ex, ey]) => {
      ctx.beginPath();
      ctx.moveTo(ex - headR * 0.3, ey + headR * 0.5);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex + headR * 0.3, ey + headR * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  );

  // Smug face
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(cx - headR * 0.35, tableY - headR * 2.55, headR * 0.12, 0, Math.PI * 2);
  ctx.arc(cx + headR * 0.35, tableY - headR * 2.55, headR * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Smug closed mouth
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, tableY - headR * 2.15, headR * 0.18, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // Whiskers
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  [[-1, -0.05], [-1, 0.05], [1, -0.05], [1, 0.05]].forEach(([side, ang]) => {
    ctx.beginPath();
    ctx.moveTo(cx + side * headR * 0.15, tableY - headR * 2.2);
    ctx.lineTo(cx + side * headR * 0.8, tableY - headR * 2.2 + ang * headR * 3);
    ctx.stroke();
  });
}
