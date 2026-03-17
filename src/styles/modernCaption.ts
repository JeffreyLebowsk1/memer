import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { ModernCaptionMemeOptions } from '../types';
import { makeCanvas, drawBackground } from '../utils/canvas';
import { drawCenteredText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_IMAGE_HEIGHT = 400;
const CAPTION_PADDING = 16;
const CAPTION_FONT_SIZE = 28;

/**
 * Renders the Modern Caption meme:
 *   – Image area on top.
 *   – White caption box below with centered black text.
 */
export async function renderModernCaption(options: ModernCaptionMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const fontSize = options.fontSize ?? CAPTION_FONT_SIZE;
  const fontFamily = options.fontFamily ?? 'Arial';

  // Measure caption height before allocating canvas
  const tempCanvas = makeCanvas(width, 1);
  const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
  tempCtx.font = `bold ${fontSize}px "${fontFamily}"`;

  const maxTextWidth = width - CAPTION_PADDING * 2;
  const words = options.captionText.split(' ');
  let lineCount = 1;
  let currentLine = '';
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (tempCtx.measureText(test).width > maxTextWidth && currentLine) {
      lineCount++;
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  const captionHeight = lineCount * (fontSize * 1.4) + CAPTION_PADDING * 2;

  const imageHeight = options.height ?? DEFAULT_IMAGE_HEIGHT;
  const totalHeight = imageHeight + captionHeight;
  const canvas = makeCanvas(width, totalHeight);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Draw image portion
  await drawBackground(ctx, width, imageHeight, options);

  // Draw white caption area
  ctx.fillStyle = 'white';
  ctx.fillRect(0, imageHeight, width, captionHeight);

  // Black top separator line
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, imageHeight, width, 2);

  // Draw caption text
  drawCenteredText(
    ctx,
    options.captionText,
    width / 2,
    imageHeight + CAPTION_PADDING,
    maxTextWidth,
    { fontSize, fontFamily, color: 'black', bold: true }
  );

  return canvas;
}
