import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { DogeMemeOptions } from '../types';
import { makeCanvas, drawBackground } from '../utils/canvas';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

const DOGE_COLORS = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#009688', '#ff9800'];

/**
 * Renders the Doge meme:
 *   – Shiba Inu background (illustrated placeholder).
 *   – Multicolored, randomly placed Comic Sans italic phrases.
 */
export async function renderDoge(options: DogeMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Background — warm tan/brown typical Doge background
  await drawBackground(ctx, width, height, {
    backgroundColor: options.backgroundColor ?? '#c8a850',
    backgroundImage: options.backgroundImage,
  });

  // Draw a simple Shiba Inu placeholder if no background image
  if (!options.backgroundImage) {
    drawShibaPlaceholder(ctx, width, height);
  }

  // Scatter phrases in Comic Sans
  const phrases = options.phrases.slice(0, 8); // cap at 8 for readability
  const positions = generatePositions(phrases.length, width, height);

  phrases.forEach((phrase, i) => {
    const color = DOGE_COLORS[i % DOGE_COLORS.length];
    const fontSize = 24 + ((i * 7) % 18);
    const [px, py] = positions[i];

    ctx.save();
    ctx.font = `italic bold ${fontSize}px "Comic Sans MS", cursive`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(phrase, px, py);
    ctx.restore();
  });

  return canvas;
}

/**
 * Generates non-overlapping positions for the doge phrases.
 */
function generatePositions(count: number, width: number, height: number): [number, number][] {
  const positions: [number, number][] = [];
  const margin = 30;
  // Deterministic pseudo-random layout
  for (let i = 0; i < count; i++) {
    const col = i % 2 === 0 ? margin : Math.round(width * 0.55);
    const rowH = (height - margin * 2) / Math.ceil(count / 2);
    const row = Math.floor(i / 2);
    positions.push([col, Math.round(margin + row * rowH + rowH * 0.1)]);
  }
  return positions;
}

/**
 * Draws a simple Shiba Inu cartoon placeholder.
 */
function drawShibaPlaceholder(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const cx = width * 0.5;
  const cy = height * 0.55;
  const headR = height * 0.2;

  // Body
  ctx.fillStyle = '#d4a254';
  ctx.beginPath();
  ctx.ellipse(cx, cy + headR * 1.2, headR * 1.1, headR * 1.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#e8b870';
  ctx.beginPath();
  ctx.arc(cx, cy - headR * 0.3, headR, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle
  ctx.fillStyle = '#f5d5a0';
  ctx.beginPath();
  ctx.ellipse(cx, cy + headR * 0.2, headR * 0.55, headR * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx - headR * 0.38, cy - headR * 0.35, headR * 0.12, 0, Math.PI * 2);
  ctx.arc(cx + headR * 0.38, cy - headR * 0.35, headR * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrow worried/judgy look
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.5, cy - headR * 0.52);
  ctx.lineTo(cx - headR * 0.25, cy - headR * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + headR * 0.25, cy - headR * 0.6);
  ctx.lineTo(cx + headR * 0.5, cy - headR * 0.52);
  ctx.stroke();

  // Nose
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(cx, cy, headR * 0.12, headR * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = '#d4a254';
  const earOffsets: [number, number, number][] = [
    [-headR * 0.7, -headR * 0.9, -0.3],
    [headR * 0.7, -headR * 0.9, 0.3],
  ];
  earOffsets.forEach(([ex, ey, tilt]) => {
    ctx.save();
    ctx.translate(cx + ex, cy + ey);
    ctx.rotate(tilt);
    ctx.beginPath();
    ctx.ellipse(0, 0, headR * 0.28, headR * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}
