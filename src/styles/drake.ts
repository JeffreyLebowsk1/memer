import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { DrakeMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_PANEL_HEIGHT = 250;
// Drake avatar colors (simplified cartoon placeholders)
const DRAKE_BG = '#f5e6c8';
const PANEL_BORDER = '#999';
const REJECT_PANEL_BG = '#fff0f0';
const APPROVE_PANEL_BG = '#f0fff0';
const DRAKE_BODY_COLOR = '#4a3728';
const DRAKE_SKIN = '#c8a882';

/**
 * Renders the Drake meme:
 *   – Two stacked panels.
 *   – Top panel: Drake rejecting something.
 *   – Bottom panel: Drake approving something.
 *
 * Drake figure is rendered as a simple cartoon placeholder since
 * no template image is available.
 */
export async function renderDrake(options: DrakeMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const panelHeight = options.height ? Math.floor(options.height / 2) : DEFAULT_PANEL_HEIGHT;
  const totalHeight = panelHeight * 2;
  const fontSize = options.fontSize ?? 24;

  const canvas = makeCanvas(width, totalHeight);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Overall background
  ctx.fillStyle = DRAKE_BG;
  ctx.fillRect(0, 0, width, totalHeight);

  const drakeW = Math.round(width * 0.4);
  const textX = drakeW + 20;
  const textMaxW = width - drakeW - 40;

  // ── Top panel (rejection) ──────────────────────────────────────────────────
  ctx.fillStyle = REJECT_PANEL_BG;
  ctx.fillRect(0, 0, width, panelHeight);
  ctx.strokeStyle = PANEL_BORDER;
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, panelHeight);

  drawDrakeFigure(ctx, drakeW, panelHeight, 'reject');

  // Red "no" hand emoji area
  ctx.font = `${Math.round(panelHeight * 0.3)}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🚫', drakeW / 2, panelHeight * 0.55);

  drawCenteredText(ctx, options.rejectText, textX + textMaxW / 2, panelHeight * 0.25, textMaxW, {
    fontSize,
    color: '#333',
    bold: true,
  });

  // ── Bottom panel (approval) ────────────────────────────────────────────────
  ctx.fillStyle = APPROVE_PANEL_BG;
  ctx.fillRect(0, panelHeight, width, panelHeight);
  ctx.strokeStyle = PANEL_BORDER;
  ctx.strokeRect(0, panelHeight, width, panelHeight);

  drawDrakeFigure(ctx, drakeW, panelHeight, 'approve', panelHeight);

  // Green checkmark emoji
  ctx.font = `${Math.round(panelHeight * 0.3)}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('✅', drakeW / 2, panelHeight + panelHeight * 0.55);

  drawCenteredText(
    ctx,
    options.approveText,
    textX + textMaxW / 2,
    panelHeight + panelHeight * 0.25,
    textMaxW,
    { fontSize, color: '#333', bold: true }
  );

  // Divider
  ctx.strokeStyle = PANEL_BORDER;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, panelHeight);
  ctx.lineTo(width, panelHeight);
  ctx.stroke();

  void DRAKE_BODY_COLOR;
  void DRAKE_SKIN;

  return canvas;
}

/**
 * Draws a simple cartoon Drake silhouette placeholder.
 */
function drawDrakeFigure(
  ctx: CanvasRenderingContext2D,
  panelWidth: number,
  panelHeight: number,
  mode: 'reject' | 'approve',
  yOffset = 0
): void {
  const cx = panelWidth / 2;
  const headR = panelHeight * 0.15;
  const headCy = yOffset + panelHeight * 0.3;
  const bodyTop = headCy + headR;
  const bodyBot = yOffset + panelHeight * 0.85;

  // Body
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(cx - panelWidth * 0.12, bodyTop, panelWidth * 0.24, bodyBot - bodyTop);

  // Head
  ctx.fillStyle = '#c8a882';
  ctx.beginPath();
  ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(cx - headR * 0.3, headCy - headR * 0.1, headR * 0.1, 0, Math.PI * 2);
  ctx.arc(cx + headR * 0.3, headCy - headR * 0.1, headR * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Arm gesture
  ctx.strokeStyle = '#c8a882';
  ctx.lineWidth = panelHeight * 0.05;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (mode === 'reject') {
    // Arm out + palm facing away
    ctx.moveTo(cx + panelWidth * 0.1, bodyTop + (bodyBot - bodyTop) * 0.2);
    ctx.lineTo(cx + panelWidth * 0.3, bodyTop + (bodyBot - bodyTop) * 0.1);
  } else {
    // Arm pointing forward/down with finger
    ctx.moveTo(cx + panelWidth * 0.1, bodyTop + (bodyBot - bodyTop) * 0.3);
    ctx.lineTo(cx + panelWidth * 0.35, bodyTop + (bodyBot - bodyTop) * 0.5);
  }
  ctx.stroke();
}
