import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { ChangeMyMindMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';
import { roundedRect } from '../utils/canvas';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 500;

/**
 * Renders the "Change My Mind" meme:
 *   – Person sitting at a table with a sign displaying the statement.
 *   – "Change My Mind" caption on the sign.
 */
export async function renderChangeMyMind(options: ChangeMyMindMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 26;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Outdoor background
  drawBackground(ctx, width, height);

  // Table
  drawTable(ctx, width, height);

  // Person (simple seated figure)
  drawSeatedPerson(ctx, width, height);

  // Sign
  const signX = width * 0.18;
  const signY = height * 0.3;
  const signW = width * 0.6;
  const signH = height * 0.28;
  drawSign(ctx, signX, signY, signW, signH, options.statement, fontSize);

  return canvas;
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
  skyGrad.addColorStop(0, '#87ceeb');
  skyGrad.addColorStop(1, '#e0f0ff');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.65);

  // Grass
  ctx.fillStyle = '#5aad3f';
  ctx.fillRect(0, height * 0.65, width, height * 0.35);

  // Sidewalk / ground area
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(0, height * 0.72, width, height * 0.28);
}

function drawTable(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const tableY = height * 0.6;
  const tableW = width * 0.55;
  const tableH = height * 0.06;
  const tableX = (width - tableW) / 2;

  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(tableX, tableY, tableW, tableH);

  // Table legs
  ctx.fillStyle = '#6d4c41';
  const legW = tableW * 0.05;
  const legH = height * 0.18;
  ctx.fillRect(tableX + tableW * 0.05, tableY + tableH, legW, legH);
  ctx.fillRect(tableX + tableW * 0.9, tableY + tableH, legW, legH);
}

function drawSeatedPerson(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const cx = width * 0.5;
  const tableY = height * 0.6;
  const headR = height * 0.07;
  const headCy = tableY - headR * 1.8;

  // Body
  ctx.fillStyle = '#1565c0';
  ctx.fillRect(cx - headR, tableY - headR * 3.8, headR * 2, headR * 2.2);

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#4a3728';
  ctx.beginPath();
  ctx.ellipse(cx, headCy - headR * 0.5, headR * 1.05, headR * 0.6, 0, 0, Math.PI, true);
  ctx.fill();

  // Glasses (Steven Crowder style)
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  [-0.35, 0.35].forEach((side) => {
    ctx.beginPath();
    ctx.arc(cx + side * headR * 0.6, headCy - headR * 0.05, headR * 0.24, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.12, headCy - headR * 0.05);
  ctx.lineTo(cx + headR * 0.12, headCy - headR * 0.05);
  ctx.stroke();

  // Arms on table
  ctx.strokeStyle = '#f5c5a3';
  ctx.lineWidth = headR * 0.3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.9, tableY - headR * 2);
  ctx.lineTo(cx - headR * 2, tableY + headR * 0.1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + headR * 0.9, tableY - headR * 2);
  ctx.lineTo(cx + headR * 2, tableY + headR * 0.1);
  ctx.stroke();
}

function drawSign(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  statement: string,
  fontSize: number
): void {
  // Sign shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  roundedRect(ctx, x + 4, y + 4, w, h, 8);
  ctx.fill();

  // Sign background
  ctx.fillStyle = '#fffde7';
  roundedRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = '#f9a825';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Statement text
  drawCenteredText(ctx, statement, x + w / 2, y + h * 0.12, w - 24, {
    fontSize,
    color: '#212121',
    bold: true,
  });

  // "Change My Mind" subtext
  ctx.fillStyle = '#e65100';
  ctx.font = `italic ${Math.round(fontSize * 0.75)}px "Arial"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Change My Mind', x + w / 2, y + h * 0.72);
}
