import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { IsThisAPigeonMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText, drawOutlinedText } from '../utils/text';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 500;

/**
 * Renders the "Is This a Pigeon?" meme:
 *   – Anime person reaching towards a butterfly.
 *   – Labels for the person, the butterfly, and an optional caption.
 */
export async function renderIsThisAPigeon(options: IsThisAPigeonMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Sky-blue anime background
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, width, height);

  // Ground strip
  ctx.fillStyle = '#90ee90';
  ctx.fillRect(0, height * 0.82, width, height * 0.18);

  // Draw anime person (simplified)
  drawAnimePerson(ctx, width, height);

  // Draw butterfly
  drawButterfly(ctx, width * 0.72, height * 0.22, height * 0.1);

  // Person label (bottom-left area)
  if (options.personLabel) {
    drawOutlinedText(
      ctx,
      options.personLabel,
      width * 0.22,
      height * 0.85,
      width * 0.4,
      { fontSize: 22, fillColor: 'white', strokeColor: 'black', strokeWidth: 3 }
    );
  }

  // Butterfly label
  drawOutlinedText(
    ctx,
    options.butterflyLabel,
    width * 0.72,
    height * 0.05,
    width * 0.3,
    { fontSize: 22, fillColor: 'white', strokeColor: 'black', strokeWidth: 3 }
  );

  // Optional caption at bottom
  if (options.captionText) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, height * 0.9, width, height * 0.1);
    drawCenteredText(ctx, options.captionText, width / 2, height * 0.91, width - 24, {
      fontSize: 22,
      color: 'white',
      bold: true,
    });
  }

  return canvas;
}

function drawAnimePerson(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const cx = width * 0.28;
  const groundY = height * 0.82;
  const bodyH = height * 0.45;
  const headR = bodyH * 0.16;
  const bodyTop = groundY - bodyH;

  // Body (white uniform-ish)
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(cx - headR, bodyTop, headR * 2, bodyH * 0.55);

  // Pants
  ctx.fillStyle = '#607d8b';
  ctx.fillRect(cx - headR, bodyTop + bodyH * 0.45, headR * 2, bodyH * 0.45);

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.arc(cx, bodyTop - headR * 0.3, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair (anime spiky)
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx, bodyTop - headR, headR * 1.1, Math.PI, Math.PI * 2);
  ctx.fill();
  // Spikes
  for (let s = -2; s <= 2; s++) {
    ctx.beginPath();
    ctx.moveTo(cx + s * headR * 0.4, bodyTop - headR);
    ctx.lineTo(cx + s * headR * 0.4 + headR * 0.2, bodyTop - headR * 1.6);
    ctx.lineTo(cx + (s + 1) * headR * 0.4, bodyTop - headR);
    ctx.fill();
  }

  // Extended arm towards butterfly
  ctx.strokeStyle = '#f5c5a3';
  ctx.lineWidth = headR * 0.3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + headR, bodyTop + bodyH * 0.15);
  ctx.lineTo(width * 0.65, height * 0.35);
  ctx.stroke();

  // Eyes
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx - headR * 0.3, bodyTop - headR * 0.25, headR * 0.12, 0, Math.PI * 2);
  ctx.arc(cx + headR * 0.3, bodyTop - headR * 0.25, headR * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

function drawButterfly(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void {
  ctx.save();
  // Upper wings
  ctx.fillStyle = '#ff9800';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.5;
  [[1, -1], [-1, -1]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.ellipse(cx + sx * size * 0.55, cy + sy * size * 0.35, size * 0.55, size * 0.38, sx * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  // Lower wings
  [[1, 1], [-1, 1]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.ellipse(cx + sx * size * 0.45, cy + sy * size * 0.3, size * 0.45, size * 0.28, sx * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  // Body
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(cx, cy, size * 0.08, size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
