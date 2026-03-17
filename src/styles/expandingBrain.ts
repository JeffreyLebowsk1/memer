import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { ExpandingBrainMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_PANEL_HEIGHT = 160;

// Brain glow intensities per panel (0 = dim, 1 = blazing)
const BRAIN_GLOWS = [
  { bg: '#1a1a2e', glow: '#3a3a5c', size: 0.18 },   // small brain
  { bg: '#16213e', glow: '#5c5caa', size: 0.24 },   // medium brain
  { bg: '#0f3460', glow: '#7a7af0', size: 0.30 },   // large brain
  { bg: '#533483', glow: '#e040fb', size: 0.38 },   // galaxy brain
];

/**
 * Renders the Expanding Brain meme:
 *   – Multiple stacked panels (2–4).
 *   – Left: increasingly glowing brain cartoon.
 *   – Right: the escalating idea text.
 */
export async function renderExpandingBrain(options: ExpandingBrainMemeOptions): Promise<Canvas> {
  const labels = options.labels.slice(0, 4);
  const count = labels.length;
  const width = options.width ?? DEFAULT_WIDTH;
  const panelH = options.height ? Math.floor(options.height / count) : DEFAULT_PANEL_HEIGHT;
  const totalHeight = panelH * count;
  const fontSize = options.fontSize ?? 22;

  const canvas = makeCanvas(width, totalHeight);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const brainW = Math.round(width * 0.4);
  const textMaxW = width - brainW - 24;

  labels.forEach((label, i) => {
    const yOff = i * panelH;
    const glow = BRAIN_GLOWS[Math.min(i, BRAIN_GLOWS.length - 1)];

    // Background gradient
    const grad = ctx.createLinearGradient(0, yOff, brainW, yOff + panelH);
    grad.addColorStop(0, glow.bg);
    grad.addColorStop(1, glow.glow);
    ctx.fillStyle = grad;
    ctx.fillRect(0, yOff, brainW, panelH);

    // Right panel white
    ctx.fillStyle = 'white';
    ctx.fillRect(brainW, yOff, width - brainW, panelH);

    // Panel border
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, yOff, width, panelH);

    // Brain silhouette (glowing circle cluster)
    drawBrain(ctx, brainW / 2, yOff + panelH / 2, panelH * glow.size, glow.glow, i);

    // Label text
    drawCenteredText(
      ctx,
      label,
      brainW + 12 + textMaxW / 2,
      yOff + panelH * 0.25,
      textMaxW,
      { fontSize, color: '#111', bold: i === count - 1 }
    );
  });

  return canvas;
}

/**
 * Draws a simple brain placeholder using overlapping circles.
 */
function drawBrain(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  level: number
): void {
  // Outer glow
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 2);
  glow.addColorStop(0, color + 'aa');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2, 0, Math.PI * 2);
  ctx.fill();

  // Main brain shape (two lobes)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx - radius * 0.4, cy, radius * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + radius * 0.4, cy, radius * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Center groove
  ctx.strokeStyle = ctx.canvas.getContext !== undefined ? '#00000033' : 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius * 0.5);
  ctx.lineTo(cx, cy + radius * 0.5);
  ctx.stroke();

  // Extra sparkles for higher levels
  if (level >= 2) {
    ctx.fillStyle = 'white';
    for (let s = 0; s < level * 3; s++) {
      const angle = (s / (level * 3)) * Math.PI * 2;
      const dist = radius * 1.4;
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(sx, sy, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
