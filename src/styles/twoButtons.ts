import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { TwoButtonsMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 500;

/**
 * Renders the Two Buttons meme:
 *   – A person sweating while hovering over two buttons.
 *   – Each button is labeled with one of the provided options.
 */
export async function renderTwoButtons(options: TwoButtonsMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 22;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Background
  ctx.fillStyle = '#f5f5dc';
  ctx.fillRect(0, 0, width, height);

  // Optional caption at top
  if (options.caption) {
    ctx.fillStyle = '#333';
    ctx.font = `bold ${fontSize + 4}px "Arial"`;
    ctx.textAlign = 'center';
    ctx.fillText(options.caption, width / 2, 40);
  }

  const btnW = Math.round(width * 0.3);
  const btnH = 60;
  const btn1X = Math.round(width * 0.12);
  const btn2X = Math.round(width * 0.58);
  const btnY = Math.round(height * 0.15);

  // Draw buttons
  drawButton(ctx, btn1X, btnY, btnW, btnH, options.button1, fontSize);
  drawButton(ctx, btn2X, btnY, btnW, btnH, options.button2, fontSize);

  // Draw the sweating figure
  drawSweatingPerson(ctx, width, height, btn1X, btn2X, btnY, btnW, btnH);

  return canvas;
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  fontSize: number
): void {
  // Button shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x + 4, y + 4, w, h);

  // Button body
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#ff6b6b');
  grad.addColorStop(1, '#cc0000');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Button border
  ctx.strokeStyle = '#880000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Button label
  drawCenteredText(ctx, label, x + w / 2, y + h * 0.2, w - 10, {
    fontSize: Math.min(fontSize, 18),
    color: 'white',
    bold: true,
  });
}

function drawSweatingPerson(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  btn1X: number,
  btn2X: number,
  btnY: number,
  btnW: number,
  _btnH: number
): void {
  const cx = width / 2;
  const personTopY = Math.round(height * 0.32);
  const headR = Math.round(height * 0.1);
  const bodyH = Math.round(height * 0.28);

  // Body
  ctx.fillStyle = '#4169e1';
  ctx.fillRect(cx - headR * 0.8, personTopY + headR * 2, headR * 1.6, bodyH);

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.arc(cx, personTopY + headR, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#4a3728';
  ctx.beginPath();
  ctx.ellipse(cx, personTopY, headR * 1.1, headR * 0.55, 0, 0, Math.PI, true);
  ctx.fill();

  // Eyes (wide, sweating look)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(cx - headR * 0.35, personTopY + headR * 0.8, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + headR * 0.35, personTopY + headR * 0.8, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx - headR * 0.32, personTopY + headR * 0.85, headR * 0.1, 0, Math.PI * 2);
  ctx.arc(cx + headR * 0.32, personTopY + headR * 0.85, headR * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Sweat drops
  ctx.fillStyle = 'rgba(100,180,255,0.7)';
  [[cx - headR * 1.2, personTopY + headR * 0.5], [cx + headR * 1.3, personTopY + headR * 0.8]].forEach(
    ([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, headR * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - headR * 0.05, sy + headR * 0.2);
      ctx.lineTo(sx + headR * 0.05, sy + headR * 0.2);
      ctx.closePath();
      ctx.fill();
    }
  );

  // Arms stretched towards both buttons
  const armY = personTopY + headR * 2 + bodyH * 0.3;
  ctx.strokeStyle = '#f5c5a3';
  ctx.lineWidth = headR * 0.3;
  ctx.lineCap = 'round';

  // Left arm → btn1
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.8, armY);
  ctx.lineTo(btn1X + btnW, btnY + 30);
  ctx.stroke();

  // Right arm → btn2
  ctx.beginPath();
  ctx.moveTo(cx + headR * 0.8, armY);
  ctx.lineTo(btn2X, btnY + 30);
  ctx.stroke();
}
