import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { ThisIsFineMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 450;

/**
 * Renders the "This Is Fine" meme:
 *   – Dog sitting in a burning room, calmly sipping coffee.
 *   – Optional caption overlay.
 */
export async function renderThisIsFine(options: ThisIsFineMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 26;
  const captionText = options.captionText ?? 'This is fine.';

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Room background
  drawBurningRoom(ctx, width, height);

  // Dog figure
  drawDog(ctx, width, height);

  // Caption speech bubble
  drawSpeechBubble(ctx, width, height, captionText, fontSize);

  return canvas;
}

function drawBurningRoom(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Floor
  ctx.fillStyle = '#8d5524';
  ctx.fillRect(0, height * 0.7, width, height * 0.3);

  // Wall
  ctx.fillStyle = '#f5e6c8';
  ctx.fillRect(0, 0, width, height * 0.7);

  // Flames — lots of them
  const flameCount = 12;
  for (let i = 0; i < flameCount; i++) {
    const fx = (i / flameCount) * width;
    const fw = width / flameCount * 1.2;
    drawFlame(ctx, fx, height * 0.7, fw, height * (0.3 + (i % 3) * 0.12));
  }

  // Some flames on the walls too
  for (let i = 0; i < 5; i++) {
    drawFlame(ctx, i * (width / 5), height * 0.35, width * 0.12, height * 0.25);
  }

  // Window outline
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 4;
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(width * 0.6, height * 0.1, width * 0.28, height * 0.22);
  ctx.strokeRect(width * 0.6, height * 0.1, width * 0.28, height * 0.22);
  // Cross bar
  ctx.beginPath();
  ctx.moveTo(width * 0.74, height * 0.1);
  ctx.lineTo(width * 0.74, height * 0.32);
  ctx.moveTo(width * 0.6, height * 0.21);
  ctx.lineTo(width * 0.88, height * 0.21);
  ctx.stroke();
}

function drawFlame(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  width: number,
  height: number
): void {
  ctx.save();
  ctx.globalAlpha = 0.75;

  const grad = ctx.createLinearGradient(x, baseY - height, x, baseY);
  grad.addColorStop(0, '#ff9800');
  grad.addColorStop(0.4, '#f44336');
  grad.addColorStop(1, '#ffeb3b');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.bezierCurveTo(x - width * 0.3, baseY - height * 0.3, x + width * 0.1, baseY - height * 0.6, x + width * 0.2, baseY - height);
  ctx.bezierCurveTo(x + width * 0.4, baseY - height * 0.5, x + width * 0.6, baseY - height * 0.7, x + width * 0.5, baseY - height * 0.2);
  ctx.bezierCurveTo(x + width * 0.8, baseY - height * 0.4, x + width * 0.9, baseY - height * 0.1, x + width, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDog(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const cx = width * 0.28;
  const groundY = height * 0.7;
  const bodyH = height * 0.22;
  const headR = bodyH * 0.36;

  // Seated body
  ctx.fillStyle = '#f5a623';
  ctx.beginPath();
  ctx.ellipse(cx, groundY - bodyH * 0.45, bodyH * 0.48, bodyH * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#f5a623';
  ctx.beginPath();
  ctx.arc(cx, groundY - bodyH - headR * 0.5, headR, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = '#ffd580';
  ctx.beginPath();
  ctx.ellipse(cx + headR * 0.2, groundY - bodyH - headR * 0.2, headR * 0.55, headR * 0.38, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (calm/lidded)
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(cx - headR * 0.3, groundY - bodyH - headR * 0.7, headR * 0.1, 0, Math.PI * 2);
  ctx.arc(cx + headR * 0.3, groundY - bodyH - headR * 0.7, headR * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = '#e67e22';
  [[-0.7, 1.1], [0.7, 1.1]].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.ellipse(
      cx + ex * headR, groundY - bodyH - headR * ey,
      headR * 0.28, headR * 0.42, ex * 0.4, 0, Math.PI * 2
    );
    ctx.fill();
  });

  // Coffee mug in paw
  drawCoffeeMug(ctx, cx + bodyH * 0.4, groundY - bodyH * 0.2, bodyH * 0.18);
}

function drawCoffeeMug(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void {
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1.5;
  ctx.fillRect(cx - size * 0.5, cy - size * 0.8, size, size * 0.9);
  ctx.strokeRect(cx - size * 0.5, cy - size * 0.8, size, size * 0.9);

  // Handle
  ctx.beginPath();
  ctx.arc(cx + size * 0.5, cy - size * 0.35, size * 0.25, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Coffee inside
  ctx.fillStyle = '#6f4e37';
  ctx.fillRect(cx - size * 0.45, cy - size * 0.75, size * 0.9, size * 0.35);
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  fontSize: number
): void {
  const bubbleX = width * 0.42;
  const bubbleY = height * 0.08;
  const bubbleW = width * 0.5;
  const bubbleH = height * 0.22;

  // Bubble
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 12);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(bubbleX + bubbleW * 0.2, bubbleY + bubbleH);
  ctx.lineTo(bubbleX + bubbleW * 0.1, bubbleY + bubbleH + height * 0.1);
  ctx.lineTo(bubbleX + bubbleW * 0.35, bubbleY + bubbleH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  drawCenteredText(ctx, text, bubbleX + bubbleW / 2, bubbleY + bubbleH * 0.2, bubbleW - 20, {
    fontSize,
    color: '#333',
    bold: true,
  });
}
