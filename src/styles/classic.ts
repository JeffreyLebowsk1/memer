import { Canvas, CanvasRenderingContext2D, CanvasTextAlign } from 'canvas';
import { ClassicMemeOptions } from '../types';
import { makeCanvas, drawBackground } from '../utils/canvas';
import { drawOutlinedText } from '../utils/text';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 450;
const PADDING = 12;

/**
 * Renders the Classic Impact meme:
 *   – Bold white text with black outline at the top and/or bottom.
 *   – All-caps Impact font (or user-defined font/color).
 */
export async function renderClassic(options: ClassicMemeOptions): Promise<Canvas> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const fontSize = options.fontSize ?? Math.round(width / 10);
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  await drawBackground(ctx, width, height, options);

  const textOpts = {
    fontSize,
    fontFamily: 'Impact',
    fillColor: options.textColor ?? 'white',
    strokeColor: options.outlineColor ?? 'black',
    strokeWidth: Math.max(2, Math.round(fontSize / 10)),
    align: 'center' as CanvasTextAlign,
  };

  if (options.topText) {
    drawOutlinedText(ctx, options.topText, width / 2, PADDING, width - PADDING * 2, textOpts);
  }

  if (options.bottomText) {
    ctx.font = `${fontSize}px "Impact"`;
    const lines = options.bottomText.toUpperCase().split(' ');
    // Approximate line count for bottom-up positioning
    const approxLines = Math.ceil(
      ctx.measureText(options.bottomText.toUpperCase()).width / (width - PADDING * 2)
    );
    const lineHeight = fontSize * 1.2;
    const totalHeight = Math.max(1, approxLines) * lineHeight;
    const bottomY = height - totalHeight - PADDING;
    drawOutlinedText(ctx, options.bottomText, width / 2, bottomY, width - PADDING * 2, textOpts);
    void lines;
  }

  return canvas;
}
