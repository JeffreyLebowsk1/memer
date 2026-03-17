import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { GrusPlanMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';
import { roundedRect } from '../utils/canvas';

const DEFAULT_WIDTH = 600;
const DEFAULT_PANEL_HEIGHT = 200;

// Gru figure colors
const GRU_SKIN = '#f0d0a0';
const GRU_NOSE = '#d4a830';

/**
 * Renders the Gru's Plan meme:
 *   – Panel 1 & 2: Gru smiling and pointing at a plan step.
 *   – Panel 3: Gru smiling at the punchline step.
 *   – Panel 4: Gru horrified as the same punchline hits him.
 *
 * Classic 4-panel meme format.
 */
export async function renderGrusPlan(options: GrusPlanMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const panelH = options.height ? Math.floor(options.height / 4) : DEFAULT_PANEL_HEIGHT;
  const totalHeight = panelH * 4;
  const fontSize = options.fontSize ?? 22;

  const canvas = makeCanvas(width, totalHeight);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Draw all four panels
  const panels = [
    { text: options.step1, reaction: 'happy', yOff: 0 },
    { text: options.step2, reaction: 'happy', yOff: panelH },
    { text: options.step3, reaction: 'happy', yOff: panelH * 2 },
    { text: options.step3, reaction: 'horrified', yOff: panelH * 3 },
  ];

  panels.forEach(({ text, reaction, yOff }) => {
    drawPanel(ctx, width, panelH, yOff, text, reaction as 'happy' | 'horrified', fontSize);
  });

  return canvas;
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  panelH: number,
  yOff: number,
  text: string,
  reaction: 'happy' | 'horrified',
  fontSize: number
): void {
  // Panel background
  ctx.fillStyle = reaction === 'happy' ? '#f5f0e8' : '#ffe0e0';
  ctx.fillRect(0, yOff, width, panelH);

  // Panel border
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, yOff, width, panelH);

  // Gru figure on the left
  const gruW = Math.round(width * 0.35);
  drawGru(ctx, gruW, panelH, yOff, reaction);

  // Plan text on the right (with paper/board background)
  const textX = gruW + 12;
  const textW = width - gruW - 24;
  const textY = yOff + panelH * 0.1;

  // Paper rectangle
  roundedRect(ctx, textX, textY, textW, panelH * 0.8, 6);
  ctx.fillStyle = '#fffde7';
  ctx.fill();
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.stroke();

  drawCenteredText(ctx, text, textX + textW / 2, textY + panelH * 0.15, textW - 16, {
    fontSize,
    color: '#222',
    bold: true,
  });

  // Horrified panel gets a big red X
  if (reaction === 'horrified') {
    ctx.strokeStyle = 'rgba(220,0,0,0.55)';
    ctx.lineWidth = 5;
    const xPad = 10;
    ctx.beginPath();
    ctx.moveTo(textX + xPad, textY + xPad);
    ctx.lineTo(textX + textW - xPad, textY + panelH * 0.8 - xPad);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(textX + textW - xPad, textY + xPad);
    ctx.lineTo(textX + xPad, textY + panelH * 0.8 - xPad);
    ctx.stroke();
  }
}

function drawGru(
  ctx: CanvasRenderingContext2D,
  panelW: number,
  panelH: number,
  yOff: number,
  reaction: 'happy' | 'horrified'
): void {
  const cx = panelW / 2;
  const scale = panelH / 200;

  // Body (tall scarf/jumpsuit)
  ctx.fillStyle = '#696969';
  ctx.beginPath();
  ctx.ellipse(cx, yOff + panelH * 0.68, 38 * scale, 55 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Scarf (white)
  ctx.fillStyle = 'white';
  ctx.fillRect(cx - 10 * scale, yOff + panelH * 0.45, 20 * scale, 18 * scale);

  // Head (large oval)
  ctx.fillStyle = GRU_SKIN;
  ctx.beginPath();
  ctx.ellipse(cx, yOff + panelH * 0.3, 32 * scale, 38 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose (huge, iconic)
  ctx.fillStyle = GRU_NOSE;
  ctx.beginPath();
  ctx.ellipse(cx + 6 * scale, yOff + panelH * 0.34, 10 * scale, 7 * scale, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(cx - 10 * scale, yOff + panelH * 0.26, 7 * scale, 8 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 14 * scale, yOff + panelH * 0.26, 7 * scale, 8 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#222';
  ctx.beginPath();
  if (reaction === 'horrified') {
    // Wide open shocked pupils
    ctx.arc(cx - 10 * scale, yOff + panelH * 0.26, 5 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 14 * scale, yOff + panelH * 0.26, 5 * scale, 0, Math.PI * 2);
  } else {
    // Normal-sized pupils
    ctx.arc(cx - 10 * scale, yOff + panelH * 0.27, 3.5 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 14 * scale, yOff + panelH * 0.27, 3.5 * scale, 0, Math.PI * 2);
  }
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  if (reaction === 'horrified') {
    // Arched up in horror
    ctx.beginPath();
    ctx.arc(cx - 10 * scale, yOff + panelH * 0.2, 9 * scale, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 14 * scale, yOff + panelH * 0.2, 9 * scale, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else {
    // Flat confident brows
    ctx.beginPath();
    ctx.moveTo(cx - 18 * scale, yOff + panelH * 0.19);
    ctx.lineTo(cx - 3 * scale, yOff + panelH * 0.18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 7 * scale, yOff + panelH * 0.18);
    ctx.lineTo(cx + 22 * scale, yOff + panelH * 0.19);
    ctx.stroke();
  }

  // Mouth
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  if (reaction === 'horrified') {
    // Open O-shape mouth
    ctx.arc(cx + 4 * scale, yOff + panelH * 0.41, 7 * scale, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Confident closed smile
    ctx.arc(cx + 4 * scale, yOff + panelH * 0.37, 8 * scale, 0.1, Math.PI - 0.1);
    ctx.stroke();
  }

  // Arms (pointing / horrified raised arms)
  ctx.strokeStyle = GRU_SKIN;
  ctx.lineWidth = 8 * scale;
  ctx.lineCap = 'round';
  if (reaction === 'horrified') {
    // Arms up in horror
    ctx.beginPath();
    ctx.moveTo(cx - 30 * scale, yOff + panelH * 0.6);
    ctx.lineTo(cx - 50 * scale, yOff + panelH * 0.38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 30 * scale, yOff + panelH * 0.6);
    ctx.lineTo(cx + 50 * scale, yOff + panelH * 0.38);
    ctx.stroke();
  } else {
    // Pointing arm toward the plan
    ctx.beginPath();
    ctx.moveTo(cx + 30 * scale, yOff + panelH * 0.58);
    ctx.lineTo(cx + 55 * scale, yOff + panelH * 0.5);
    ctx.stroke();
    // Other arm relaxed
    ctx.beginPath();
    ctx.moveTo(cx - 30 * scale, yOff + panelH * 0.58);
    ctx.lineTo(cx - 50 * scale, yOff + panelH * 0.62);
    ctx.stroke();
  }
}
