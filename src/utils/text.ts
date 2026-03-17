import { CanvasRenderingContext2D, CanvasTextAlign } from 'canvas';

/** Metrics returned after measuring/drawing wrapped text. */
export interface TextMetrics {
  lines: string[];
  lineHeight: number;
  totalHeight: number;
}

/**
 * Wraps text into lines that fit within maxWidth.
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Draws outlined (Impact-style) text centered horizontally.
 * Supports multi-line wrapping.
 */
export function drawOutlinedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: {
    fontSize?: number;
    fontFamily?: string;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    align?: CanvasTextAlign;
    lineHeightFactor?: number;
  } = {}
): TextMetrics {
  const {
    fontSize = 48,
    fontFamily = 'Impact',
    fillColor = 'white',
    strokeColor = 'black',
    strokeWidth = 4,
    align = 'center',
    lineHeightFactor = 1.2,
  } = options;

  const lineHeight = fontSize * lineHeightFactor;
  ctx.font = `${fontSize}px "${fontFamily}"`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';

  const lines = wrapText(ctx, text.toUpperCase(), maxWidth);
  const totalHeight = lines.length * lineHeight;

  lines.forEach((line, i) => {
    const ly = y + i * lineHeight;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.strokeText(line, x, ly);
    ctx.fillStyle = fillColor;
    ctx.fillText(line, x, ly);
  });

  return { lines, lineHeight, totalHeight };
}

/**
 * Draws plain text centered horizontally.
 * Supports multi-line wrapping.
 */
export function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    lineHeightFactor?: number;
    bold?: boolean;
    italic?: boolean;
  } = {}
): TextMetrics {
  const {
    fontSize = 32,
    fontFamily = 'Arial',
    color = 'black',
    lineHeightFactor = 1.3,
    bold = false,
    italic = false,
  } = options;

  const weight = bold ? 'bold ' : '';
  const style = italic ? 'italic ' : '';
  const lineHeight = fontSize * lineHeightFactor;

  ctx.font = `${style}${weight}${fontSize}px "${fontFamily}"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = color;

  const lines = wrapText(ctx, text, maxWidth);
  const totalHeight = lines.length * lineHeight;

  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight);
  });

  return { lines, lineHeight, totalHeight };
}

/**
 * Draws a partial text reveal — used for typewriter GIF animation.
 * @param charCount - Number of characters to reveal (from the start of the full text).
 */
export function drawPartialOutlinedText(
  ctx: CanvasRenderingContext2D,
  fullText: string,
  charCount: number,
  x: number,
  y: number,
  maxWidth: number,
  options: Parameters<typeof drawOutlinedText>[5] = {}
): void {
  const partial = fullText.slice(0, charCount);
  drawOutlinedText(ctx, partial, x, y, maxWidth, options);
}
