import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { DistractedBoyfriendMemeOptions } from '../types';
import { makeCanvas, roundedRect } from '../utils/canvas';

const DEFAULT_WIDTH = 750;
const DEFAULT_HEIGHT = 500;

const BF_COLOR = '#e91e63';
const GF_COLOR = '#3f51b5';
const OW_COLOR = '#ff5722';

/**
 * Renders the Distracted Boyfriend meme:
 *   – Boyfriend label, girlfriend label, other woman label.
 *   – Illustrated three-figure scene with colored label boxes.
 */
export async function renderDistractedBoyfriend(
  options: DistractedBoyfriendMemeOptions
): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 20;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Street background
  drawStreetBackground(ctx, width, height);

  // Figures (left to right: girlfriend, boyfriend, other woman)
  const figureH = height * 0.6;
  const groundY = height * 0.75;
  const gfX = width * 0.15;
  const bfX = width * 0.48;
  const owX = width * 0.75;

  drawFigure(ctx, gfX, groundY, figureH, GF_COLOR, 'gf');
  drawFigure(ctx, bfX, groundY, figureH, BF_COLOR, 'bf');
  drawFigure(ctx, owX, groundY, figureH, OW_COLOR, 'ow');

  // Label boxes
  drawLabel(ctx, gfX, groundY - figureH - 15, width * 0.25, options.girlfriendLabel, GF_COLOR, fontSize);
  drawLabel(ctx, bfX, groundY - figureH - 15, width * 0.25, options.boyfriendLabel, BF_COLOR, fontSize);
  drawLabel(ctx, owX, groundY - figureH - 15, width * 0.25, options.otherWomanLabel, OW_COLOR, fontSize);

  return canvas;
}

function drawStreetBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Sky
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, width, height * 0.55);

  // Ground
  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(0, height * 0.55, width, height * 0.45);

  // Sidewalk markings
  ctx.strokeStyle = '#bdbdbd';
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 20]);
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.lineTo(width, height * 0.7);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawFigure(
  ctx: CanvasRenderingContext2D,
  cx: number,
  groundY: number,
  figureH: number,
  shirtColor: string,
  role: 'bf' | 'gf' | 'ow'
): void {
  const headR = figureH * 0.12;
  const bodyH = figureH * 0.32;
  const legH = figureH * 0.3;
  const headCy = groundY - legH - bodyH - headR * 1.2;

  // Legs
  ctx.fillStyle = '#37474f';
  ctx.fillRect(cx - headR * 0.6, groundY - legH, headR * 0.5, legH);
  ctx.fillRect(cx + headR * 0.1, groundY - legH, headR * 0.5, legH);

  // Body / shirt
  ctx.fillStyle = shirtColor;
  ctx.fillRect(cx - headR, groundY - legH - bodyH, headR * 2, bodyH);

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = role === 'ow' ? '#ffd700' : '#3e2723';
  ctx.beginPath();
  ctx.ellipse(cx, headCy - headR * 0.4, headR * 1.05, headR * 0.65, 0, 0, Math.PI, true);
  ctx.fill();
  if (role !== 'bf') {
    // Long hair sides
    ctx.fillRect(cx - headR * 1.0, headCy - headR * 0.3, headR * 0.25, headR * 1.2);
    ctx.fillRect(cx + headR * 0.75, headCy - headR * 0.3, headR * 0.25, headR * 1.2);
  }

  // Arm turning gesture for bf
  if (role === 'bf') {
    ctx.strokeStyle = '#f5c5a3';
    ctx.lineWidth = headR * 0.3;
    ctx.lineCap = 'round';
    // Arm pointing backward (toward ow)
    ctx.beginPath();
    ctx.moveTo(cx + headR, groundY - legH - bodyH * 0.5);
    ctx.lineTo(cx + headR * 3.5, groundY - legH - bodyH * 0.8);
    ctx.stroke();
    // Other arm with gf
    ctx.beginPath();
    ctx.moveTo(cx - headR, groundY - legH - bodyH * 0.5);
    ctx.lineTo(cx - headR * 2.5, groundY - legH - bodyH * 0.25);
    ctx.stroke();
  }
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  maxW: number,
  text: string,
  color: string,
  fontSize: number
): void {
  const padding = 8;
  const labelH = 40;
  const labelX = cx - maxW / 2;

  // Label box
  roundedRect(ctx, labelX, y - labelH, maxW, labelH, 6);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.min(fontSize, 18)}px "Arial"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Truncate if too long
  let displayText = text;
  while (ctx.measureText(displayText).width > maxW - padding * 2 && displayText.length > 3) {
    displayText = displayText.slice(0, -4) + '...';
  }
  ctx.fillText(displayText, cx, y - labelH / 2);
}
