import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { TradeOfferMemeOptions } from '../types';
import { makeCanvas } from '../utils/canvas';
import { wrapText } from '../utils/text';
import { roundedRect } from '../utils/canvas';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 500;

/**
 * Renders the Trade Offer meme:
 *   – Header: "I have made you a trade offer" (or custom header).
 *   – Two columns: "They receive" and "You receive".
 *   – Each column lists the items in a colored box.
 */
export async function renderTradeOffer(options: TradeOfferMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? 20;
  const headerText = options.headerText ?? 'I have made you a trade offer';

  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1a1a2e');
  bgGrad.addColorStop(1, '#16213e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw the broker figure
  drawBroker(ctx, width, height);

  // Header text
  ctx.fillStyle = '#ffd700';
  ctx.font = `bold ${Math.round(fontSize * 1.3)}px "Arial"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(headerText, width / 2, height * 0.04);

  // Decorative line under header
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, height * 0.12);
  ctx.lineTo(width * 0.9, height * 0.12);
  ctx.stroke();

  // Two columns
  const colY = height * 0.15;
  const colH = height * 0.72;
  const colW = width * 0.38;
  const col1X = width * 0.06;
  const col2X = width * 0.56;

  // Column 1 — They Receive
  drawTradeColumn(ctx, col1X, colY, colW, colH, 'They receive:', options.theyReceive, '#4caf50', '#e8f5e9', fontSize);

  // VS divider in the middle
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.round(fontSize * 1.5)}px "Impact"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', width / 2, colY + colH / 2);

  // Column 2 — You Receive
  drawTradeColumn(ctx, col2X, colY, colW, colH, 'You receive:', options.youReceive, '#2196f3', '#e3f2fd', fontSize);

  return canvas;
}

function drawTradeColumn(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  items: string[],
  headerColor: string,
  bgColor: string,
  fontSize: number
): void {
  // Column background
  roundedRect(ctx, x, y, w, h, 10);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.strokeStyle = headerColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Column header
  const headerH = 42;
  roundedRect(ctx, x, y, w, headerH, 10);
  ctx.fillStyle = headerColor;
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.round(fontSize * 0.95)}px "Arial"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, x + w / 2, y + headerH / 2);

  // Items list
  const itemPadding = 10;
  let itemY = y + headerH + itemPadding;
  const itemMaxW = w - itemPadding * 2;

  ctx.font = `${fontSize}px "Arial"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#222';

  items.slice(0, 6).forEach((item) => {
    // Bullet point
    ctx.fillStyle = headerColor;
    ctx.beginPath();
    ctx.arc(x + itemPadding + 5, itemY + fontSize * 0.55, 4, 0, Math.PI * 2);
    ctx.fill();

    // Item text (with wrapping)
    ctx.fillStyle = '#111';
    const lines = wrapText(ctx, item, itemMaxW - 18);
    lines.forEach((line, li) => {
      ctx.fillText(line, x + itemPadding + 14, itemY + li * (fontSize * 1.3));
    });
    itemY += lines.length * (fontSize * 1.3) + 6;
  });
}

function drawBroker(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Small business-man figure in the background, semi-transparent
  const cx = width / 2;
  const groundY = height * 0.95;
  const scale = height * 0.003;

  ctx.save();
  ctx.globalAlpha = 0.12;

  // Body (suit)
  ctx.fillStyle = '#1a237e';
  ctx.beginPath();
  ctx.ellipse(cx, groundY - 70 * scale, 28 * scale, 40 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#f5c5a3';
  ctx.beginPath();
  ctx.arc(cx, groundY - 115 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Arms spread wide (holding out deal)
  ctx.strokeStyle = '#f5c5a3';
  ctx.lineWidth = 8 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 25 * scale, groundY - 85 * scale);
  ctx.lineTo(cx - 70 * scale, groundY - 65 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 25 * scale, groundY - 85 * scale);
  ctx.lineTo(cx + 70 * scale, groundY - 65 * scale);
  ctx.stroke();

  ctx.restore();
}
