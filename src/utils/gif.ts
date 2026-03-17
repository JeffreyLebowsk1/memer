import GIFEncoder from 'gif-encoder-2';
import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { GifOptions, GifAnimation } from '../types';

const DEFAULT_FPS = 10;
const DEFAULT_DURATION = 3;
const DEFAULT_QUALITY = 10;

/**
 * Encodes an array of canvas frames into an animated GIF buffer.
 * @param frames - Array of Canvas frames in display order.
 * @param options - GIF export options.
 */
export async function encodeGif(frames: Canvas[], options: GifOptions = {}): Promise<Buffer> {
  if (frames.length === 0) throw new Error('No frames provided for GIF encoding.');

  const { width, height } = frames[0];
  const fps = options.fps ?? DEFAULT_FPS;
  const repeat = options.repeat !== false;
  const quality = options.quality ?? DEFAULT_QUALITY;

  const encoder = new GIFEncoder(width, height, 'neuquant', true);
  encoder.setDelay(Math.round(1000 / fps));
  encoder.setRepeat(repeat ? 0 : -1);
  encoder.setQuality(quality);
  encoder.start();

  for (const frame of frames) {
    const ctx = frame.getContext('2d') as CanvasRenderingContext2D;
    encoder.addFrame(ctx);
  }

  encoder.finish();

  const buffer = encoder.out.getData();
  return Buffer.from(buffer);
}

/**
 * Builds animation frames using one of the built-in animation types.
 *
 * @param baseCanvas - The fully rendered static meme canvas.
 * @param animationFn - A function that renders a single animation frame onto a fresh canvas context.
 * @param options - GIF options.
 */
export function buildFrames(
  width: number,
  height: number,
  totalFrames: number,
  drawFrame: (ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number) => void
): Canvas[] {
  // Lazy import to avoid circular deps
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createCanvas } = require('canvas') as typeof import('canvas');

  const frames: Canvas[] = [];
  for (let i = 0; i < totalFrames; i++) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    drawFrame(ctx, i, totalFrames);
    frames.push(canvas);
  }
  return frames;
}

/**
 * Calculates the total number of frames from fps and duration.
 */
export function calcTotalFrames(options: GifOptions): number {
  const fps = options.fps ?? DEFAULT_FPS;
  const duration = options.duration ?? DEFAULT_DURATION;
  return Math.max(1, Math.round(fps * duration));
}

/**
 * Returns the animation drawing function for the specified animation type.
 * The returned function draws the background first (calling drawBase), then
 * applies the animation effect.
 *
 * @param animation - The animation type.
 * @param drawBase - Function that draws the static meme content onto a context.
 * @param texts - Flat array of texts to animate (used for typewriter/slide).
 */
export function getAnimationDrawer(
  animation: GifAnimation,
  drawBase: (ctx: CanvasRenderingContext2D) => void,
  texts: string[]
): (ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number) => void {
  switch (animation) {
    case 'typewriter':
      return typewriterDrawer(drawBase, texts);
    case 'bounce':
      return bounceDrawer(drawBase);
    case 'shake':
      return shakeDrawer(drawBase);
    case 'flash':
      return flashDrawer(drawBase);
    case 'slide':
      return slideDrawer(drawBase, texts);
    default:
      return () => { /* no-op */ };
  }
}

// ---------------------------------------------------------------------------
// Individual animation drawers
// ---------------------------------------------------------------------------

function typewriterDrawer(
  drawBase: (ctx: CanvasRenderingContext2D) => void,
  texts: string[]
): (ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number) => void {
  const fullText = texts.join(' ');
  return (ctx, frameIndex, totalFrames) => {
    drawBase(ctx);
    // Overlay a semi-transparent rectangle to wipe out existing text
    ctx.save();
    // Reveal characters progressively
    const progress = (frameIndex + 1) / totalFrames;
    const charCount = Math.round(fullText.length * progress);
    // Re-draw only the revealed portion; base handles background
    ctx.restore();
    // Store state for use by meme-specific renderers
    (ctx as CanvasRenderingContext2D & { _typewriterProgress?: number; _typewriterCharCount?: number })._typewriterProgress = progress;
    (ctx as CanvasRenderingContext2D & { _typewriterCharCount?: number })._typewriterCharCount = charCount;
  };
}

function bounceDrawer(
  drawBase: (ctx: CanvasRenderingContext2D) => void
): (ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number) => void {
  return (ctx, frameIndex, totalFrames) => {
    const angle = (frameIndex / totalFrames) * 2 * Math.PI;
    const bounceOffset = Math.abs(Math.sin(angle)) * 10;
    ctx.save();
    ctx.translate(0, -bounceOffset);
    drawBase(ctx);
    ctx.restore();
  };
}

function shakeDrawer(
  drawBase: (ctx: CanvasRenderingContext2D) => void
): (ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number) => void {
  const shakePattern = [-4, 4, -3, 3, -2, 2, -1, 1, 0];
  return (ctx, frameIndex) => {
    const dx = shakePattern[frameIndex % shakePattern.length];
    ctx.save();
    ctx.translate(dx, 0);
    drawBase(ctx);
    ctx.restore();
  };
}

function flashDrawer(
  drawBase: (ctx: CanvasRenderingContext2D) => void
): (ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number) => void {
  return (ctx, frameIndex, totalFrames) => {
    drawBase(ctx);
    // Every other frame: overlay a white flash
    if (frameIndex % 2 === 0 && frameIndex < totalFrames / 3) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
  };
}

function slideDrawer(
  drawBase: (ctx: CanvasRenderingContext2D) => void,
  texts: string[]
): (ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number) => void {
  return (ctx, frameIndex, totalFrames) => {
    const progress = frameIndex / (totalFrames - 1 || 1);
    const slideOffset = Math.round((1 - progress) * ctx.canvas.height * 0.3);
    ctx.save();
    ctx.translate(0, slideOffset);
    drawBase(ctx);
    ctx.restore();
    // Store for meme-specific renderers
    (ctx as CanvasRenderingContext2D & { _slideProgress?: number })._slideProgress = progress;
    void texts; // used by caller context
  };
}
