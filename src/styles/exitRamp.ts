import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { ExitRampMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';
import { roundedRect } from '../utils/canvas';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 500;

/**
 * Renders the Exit Ramp meme:
 *   – Car on a highway.
 *   – One path leads straight (sensible option).
 *   – Car dramatically swerves onto the exit ramp (exciting option).
 *   – Labels on each path and optionally on the car.
 */
export async function renderExitRamp(options: ExitRampMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 22;

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  drawHighwayScene(ctx, width, height);
  drawCar(ctx, width, height);
  drawLabels(ctx, width, height, options, fontSize);

  return canvas;
}

function drawHighwayScene(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
  skyGrad.addColorStop(0, '#87ceeb');
  skyGrad.addColorStop(1, '#d0eeff');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.5);

  // Ground (grass at sides)
  ctx.fillStyle = '#5aad3f';
  ctx.fillRect(0, height * 0.5, width, height * 0.5);

  // Main highway (straight, going into the distance)
  const roadGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
  roadGrad.addColorStop(0, '#666');
  roadGrad.addColorStop(1, '#888');

  // Highway body — trapezoidal road going to the top
  ctx.fillStyle = roadGrad;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, height);      // bottom-left
  ctx.lineTo(width * 0.7, height);      // bottom-right
  ctx.lineTo(width * 0.48, height * 0.5); // top-right (vanishing point)
  ctx.lineTo(width * 0.42, height * 0.5); // top-left (vanishing point)
  ctx.closePath();
  ctx.fill();

  // Center line (dashed)
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 15]);
  ctx.beginPath();
  ctx.moveTo(width * 0.5, height * 0.5);
  ctx.lineTo(width * 0.5, height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Exit ramp peeling off to the RIGHT
  const rampGrad = ctx.createLinearGradient(width * 0.55, height * 0.7, width, height * 0.55);
  rampGrad.addColorStop(0, '#666');
  rampGrad.addColorStop(1, '#777');
  ctx.fillStyle = rampGrad;
  ctx.beginPath();
  ctx.moveTo(width * 0.62, height * 0.72);    // entry point from highway
  ctx.bezierCurveTo(
    width * 0.8, height * 0.72,
    width * 0.88, height * 0.6,
    width, height * 0.55
  );
  ctx.lineTo(width, height * 0.68);
  ctx.bezierCurveTo(
    width * 0.9, height * 0.73,
    width * 0.82, height * 0.8,
    width * 0.66, height * 0.82
  );
  ctx.closePath();
  ctx.fill();

  // Ramp exit line (dashed)
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 2;
  ctx.setLineDash([15, 12]);
  ctx.beginPath();
  ctx.moveTo(width * 0.64, height * 0.77);
  ctx.bezierCurveTo(width * 0.82, height * 0.77, width * 0.9, height * 0.64, width, height * 0.61);
  ctx.stroke();
  ctx.setLineDash([]);

  // Road guardrails
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, height);
  ctx.lineTo(width * 0.42, height * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width * 0.7, height);
  ctx.lineTo(width * 0.56, height * 0.52);
  ctx.stroke();
}

function drawCar(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Car is dramatically swerving — tilted to the right towards the exit
  ctx.save();
  const carCx = width * 0.52;
  const carCy = height * 0.76;
  ctx.translate(carCx, carCy);
  ctx.rotate(0.35); // tilted toward exit

  const cw = width * 0.14;
  const ch = height * 0.1;

  // Car body
  ctx.fillStyle = '#e53935';
  ctx.fillRect(-cw / 2, -ch / 2, cw, ch);

  // Car roof
  ctx.fillStyle = '#c62828';
  ctx.fillRect(-cw * 0.32, -ch * 1.1, cw * 0.64, ch * 0.65);

  // Windows
  ctx.fillStyle = 'rgba(150,220,255,0.7)';
  ctx.fillRect(-cw * 0.28, -ch * 1.05, cw * 0.25, ch * 0.52);
  ctx.fillRect(cw * 0.02, -ch * 1.05, cw * 0.25, ch * 0.52);

  // Wheels
  ctx.fillStyle = '#222';
  [[-cw * 0.32, ch * 0.42], [cw * 0.32, ch * 0.42]].forEach(([wx, wy]) => {
    ctx.beginPath();
    ctx.arc(wx, wy, ch * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.arc(wx, wy, ch * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
  });

  // Skid marks / motion lines
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-cw * 0.4 - i * 8, ch * 0.55);
    ctx.lineTo(-cw * 0.4 - i * 8 - 25, ch * 0.55 + 5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawLabels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: ExitRampMemeOptions,
  fontSize: number
): void {
  // "Straight" label — on the highway going up (sensible option)
  const straightBoxW = width * 0.32;
  const straightBoxH = 60;
  const straightX = width * 0.35;
  const straightY = height * 0.52;

  roundedRect(ctx, straightX, straightY, straightBoxW, straightBoxH, 6);
  ctx.fillStyle = '#1565c0';
  ctx.fill();
  drawCenteredText(ctx, options.straightLabel, straightX + straightBoxW / 2, straightY + straightBoxH * 0.15, straightBoxW - 12, {
    fontSize: Math.min(fontSize, 18),
    color: 'white',
    bold: true,
  });

  // "Exit" label — on the ramp going right (chaotic option)
  const exitBoxW = width * 0.32;
  const exitBoxH = 60;
  const exitX = width * 0.65;
  const exitY = height * 0.55;

  roundedRect(ctx, exitX, exitY, exitBoxW, exitBoxH, 6);
  ctx.fillStyle = '#c62828';
  ctx.fill();
  drawCenteredText(ctx, options.exitLabel, exitX + exitBoxW / 2, exitY + exitBoxH * 0.15, exitBoxW - 12, {
    fontSize: Math.min(fontSize, 18),
    color: 'white',
    bold: true,
  });

  // Optional car label
  if (options.carLabel) {
    const carBoxW = width * 0.28;
    const carBoxH = 46;
    const carBoxX = width * 0.36;
    const carBoxY = height * 0.65;

    roundedRect(ctx, carBoxX, carBoxY, carBoxW, carBoxH, 6);
    ctx.fillStyle = '#333';
    ctx.fill();
    drawCenteredText(ctx, options.carLabel, carBoxX + carBoxW / 2, carBoxY + carBoxH * 0.15, carBoxW - 12, {
      fontSize: Math.min(fontSize, 16),
      color: 'white',
      bold: true,
    });
  }
}
