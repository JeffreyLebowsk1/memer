import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { StonksMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawOutlinedText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 450;

/**
 * Renders the Stonks / Not Stonks meme:
 *   – A simple stock-market chart going up (Stonks) or down (Not Stonks).
 *   – Stylized business figure standing beside the chart.
 *   – Caption text overlaid on the chart.
 */
export async function renderStonks(options: StonksMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 48;
  const goingUp = options.goingUp !== false;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < width; gx += 50) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke();
  }
  for (let gy = 0; gy < height; gy += 40) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke();
  }

  // Chart area
  const chartLeft = width * 0.08;
  const chartRight = width * 0.78;
  const chartTop = height * 0.12;
  const chartBottom = height * 0.82;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;

  // Axes
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(chartLeft, chartTop);
  ctx.lineTo(chartLeft, chartBottom);
  ctx.lineTo(chartRight, chartBottom);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#888';
  ctx.font = `11px "Arial"`;
  ctx.textAlign = 'center';
  for (let i = 0; i <= 4; i++) {
    const xv = chartLeft + (chartW * i) / 4;
    ctx.fillText(`Q${i + 1}`, xv, chartBottom + 15);
  }
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const yv = chartTop + (chartH * i) / 4;
    ctx.fillText(`${100 - i * 20}`, chartLeft - 5, yv + 4);
  }

  // Chart line — either rising (stonks) or falling (not stonks)
  const lineColor = goingUp ? '#00e676' : '#f44336';
  const fillColor = goingUp ? 'rgba(0,230,118,0.15)' : 'rgba(244,67,54,0.15)';

  const points = generateChartPoints(chartLeft, chartTop, chartW, chartH, goingUp);

  // Fill area under chart
  ctx.beginPath();
  ctx.moveTo(points[0].x, chartBottom);
  points.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.lineTo(points[points.length - 1].x, chartBottom);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Chart line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
  }
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Arrow at the end of the chart
  const lastPt = points[points.length - 1];
  const secondLastPt = points[points.length - 2];
  const arrowAngle = Math.atan2(lastPt.y - secondLastPt.y, lastPt.x - secondLastPt.x);
  drawArrow(ctx, lastPt.x, lastPt.y, arrowAngle, lineColor);

  // Business figure on the right
  drawBusinessFigure(ctx, chartRight + (width - chartRight) / 2, chartBottom - chartH * 0.1, chartH * 0.6, goingUp);

  // Caption text (huge bold Impact, top area)
  const captionY = height * 0.02;
  drawOutlinedText(
    ctx,
    options.captionText,
    width / 2,
    captionY,
    width - 20,
    {
      fontSize,
      fontFamily: 'Impact',
      fillColor: goingUp ? '#00e676' : '#f44336',
      strokeColor: 'black',
      strokeWidth: 4,
      align: 'center',
    }
  );

  return canvas;
}

function generateChartPoints(
  left: number,
  top: number,
  w: number,
  h: number,
  goingUp: boolean
): { x: number; y: number }[] {
  // Deterministic "random-ish" chart points
  const raw = goingUp
    ? [0.85, 0.78, 0.72, 0.65, 0.55, 0.48, 0.38, 0.28, 0.18, 0.08]
    : [0.15, 0.22, 0.28, 0.35, 0.45, 0.52, 0.62, 0.72, 0.82, 0.92];

  return raw.map((v, i) => ({
    x: left + (w * i) / (raw.length - 1),
    y: top + h * v,
  }));
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string
): void {
  const arrowLen = 14;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(arrowLen, 0);
  ctx.lineTo(-arrowLen * 0.6, -arrowLen * 0.5);
  ctx.lineTo(-arrowLen * 0.6, arrowLen * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBusinessFigure(
  ctx: CanvasRenderingContext2D,
  cx: number,
  groundY: number,
  figH: number,
  goingUp: boolean
): void {
  const scale = figH / 180;

  // Body (suit)
  ctx.fillStyle = '#37474f';
  ctx.beginPath();
  ctx.ellipse(cx, groundY - 55 * scale, 22 * scale, 35 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tie
  ctx.fillStyle = goingUp ? '#4caf50' : '#f44336';
  ctx.beginPath();
  ctx.moveTo(cx, groundY - 75 * scale);
  ctx.lineTo(cx - 5 * scale, groundY - 60 * scale);
  ctx.lineTo(cx, groundY - 38 * scale);
  ctx.lineTo(cx + 5 * scale, groundY - 60 * scale);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.arc(cx, groundY - 97 * scale, 15 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.arc(cx, groundY - 110 * scale, 15 * scale, Math.PI * 0.8, Math.PI * 2.2);
  ctx.fill();

  // Expression (smile or frown based on trend)
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  if (goingUp) {
    ctx.arc(cx, groundY - 91 * scale, 5 * scale, 0.2, Math.PI - 0.2);
  } else {
    ctx.arc(cx, groundY - 86 * scale, 5 * scale, Math.PI + 0.2, Math.PI * 2 - 0.2);
  }
  ctx.stroke();

  // Arms (raised up for stonks, down for not stonks)
  ctx.strokeStyle = '#f5c5a3';
  ctx.lineWidth = 6 * scale;
  ctx.lineCap = 'round';
  if (goingUp) {
    ctx.beginPath();
    ctx.moveTo(cx - 18 * scale, groundY - 65 * scale);
    ctx.lineTo(cx - 35 * scale, groundY - 88 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 18 * scale, groundY - 65 * scale);
    ctx.lineTo(cx + 35 * scale, groundY - 88 * scale);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx - 18 * scale, groundY - 65 * scale);
    ctx.lineTo(cx - 35 * scale, groundY - 48 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 18 * scale, groundY - 65 * scale);
    ctx.lineTo(cx + 35 * scale, groundY - 48 * scale);
    ctx.stroke();
  }
}
