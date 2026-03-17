import { Canvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

import {
  MemeOptions,
  MemeResult,
  ImageFormat,
  GifOptions,
} from './types';
import { canvasToBuffer, saveCanvasToFile } from './utils/canvas';
import { encodeGif, buildFrames, calcTotalFrames } from './utils/gif';

// Style renderers
import { renderClassic } from './styles/classic';
import { renderModernCaption } from './styles/modernCaption';
import { renderDrake } from './styles/drake';
import { renderExpandingBrain } from './styles/expandingBrain';
import { renderTwoButtons } from './styles/twoButtons';
import { renderWomanYellingAtCat } from './styles/womanYellingAtCat';
import { renderDoge } from './styles/doge';
import { renderIsThisAPigeon } from './styles/isThisAPigeon';
import { renderChangeMyMind } from './styles/changeMyMind';
import { renderDistractedBoyfriend } from './styles/distractedBoyfriend';
import { renderThisIsFine } from './styles/thisIsFine';
import { renderOneDoesNotSimply } from './styles/oneDoesNotSimply';

/**
 * Dispatches the given options to the appropriate style renderer.
 */
async function renderMeme(options: MemeOptions): Promise<Canvas> {
  switch (options.style) {
    case 'classic':
      return renderClassic(options);
    case 'modernCaption':
      return renderModernCaption(options);
    case 'drake':
      return renderDrake(options);
    case 'expandingBrain':
      return renderExpandingBrain(options);
    case 'twoButtons':
      return renderTwoButtons(options);
    case 'womanYellingAtCat':
      return renderWomanYellingAtCat(options);
    case 'doge':
      return renderDoge(options);
    case 'isThisAPigeon':
      return renderIsThisAPigeon(options);
    case 'changeMyMind':
      return renderChangeMyMind(options);
    case 'distractedBoyfriend':
      return renderDistractedBoyfriend(options);
    case 'thisIsFine':
      return renderThisIsFine(options);
    case 'oneDoesNotSimply':
      return renderOneDoesNotSimply(options);
    default: {
      const exhaustive: never = options;
      throw new Error(`Unknown meme style: ${(exhaustive as MemeOptions).style}`);
    }
  }
}

/**
 * Builds a MemeResult wrapping the rendered canvas.
 */
function buildResult(canvas: Canvas, options: MemeOptions): MemeResult {
  return {
    width: canvas.width,
    height: canvas.height,

    toBuffer(format: ImageFormat = 'png'): Buffer {
      return canvasToBuffer(canvas, format);
    },

    async saveImage(filePath: string, format: ImageFormat = 'png'): Promise<void> {
      await saveCanvasToFile(canvas, filePath, format);
    },

    async toGifBuffer(gifOptions: GifOptions = {}): Promise<Buffer> {
      const animation = gifOptions.animation ?? 'typewriter';
      const totalFrames = calcTotalFrames(gifOptions);

      // Re-render the base meme on each frame with the animation applied
      const frames = buildFrames(
        canvas.width,
        canvas.height,
        totalFrames,
        async (ctx, frameIndex, total) => {
          // Render fresh base meme
          const frameCanvas = await renderMeme(options);
          const frameCtx = frameCanvas.getContext('2d');

          // Apply animation effect on top
          applyAnimation(ctx, frameCtx, frameCanvas, animation, frameIndex, total);
        }
      );

      return encodeGif(frames, gifOptions);
    },

    async saveGif(filePath: string, gifOptions: GifOptions = {}): Promise<void> {
      const buf = await this.toGifBuffer(gifOptions);
      const dir = path.dirname(filePath);
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(filePath, buf);
    },
  };
}

/**
 * Applies an animation effect to the destination context using the source frame canvas.
 *
 * Note: buildFrames is synchronous so we pre-render the canvas and use it here.
 * For the GIF we render separate canvases per frame using a sync approach.
 */
function applyAnimation(
  destCtx: import('canvas').CanvasRenderingContext2D,
  _srcCtx: import('canvas').CanvasRenderingContext2D,
  srcCanvas: Canvas,
  animation: NonNullable<GifOptions['animation']>,
  frameIndex: number,
  totalFrames: number
): void {
  const { width, height } = srcCanvas;
  const progress = (frameIndex + 1) / totalFrames;

  switch (animation) {
    case 'typewriter': {
      // Draw cropped portion of the canvas (top fraction reveals progressively)
      const revealHeight = Math.round(height * progress);
      destCtx.drawImage(srcCanvas, 0, 0, width, revealHeight, 0, 0, width, revealHeight);
      // Fill the unrevealed area with the background color (white/grey overlay)
      destCtx.fillStyle = 'white';
      destCtx.fillRect(0, revealHeight, width, height - revealHeight);
      break;
    }
    case 'bounce': {
      const bounceOffset = Math.round(Math.abs(Math.sin(progress * Math.PI * 4)) * 12);
      destCtx.clearRect(0, 0, width, height);
      destCtx.fillStyle = '#e0e0e0';
      destCtx.fillRect(0, 0, width, height);
      destCtx.drawImage(srcCanvas, 0, -bounceOffset);
      break;
    }
    case 'shake': {
      const shakeOffsets = [-5, 5, -4, 4, -2, 2, -1, 1, 0, 0];
      const dx = shakeOffsets[frameIndex % shakeOffsets.length];
      destCtx.clearRect(0, 0, width, height);
      destCtx.fillStyle = '#e0e0e0';
      destCtx.fillRect(0, 0, width, height);
      destCtx.drawImage(srcCanvas, dx, 0);
      break;
    }
    case 'flash': {
      destCtx.drawImage(srcCanvas, 0, 0);
      if (frameIndex % 2 === 0 && frameIndex < Math.floor(totalFrames / 3)) {
        destCtx.save();
        destCtx.globalAlpha = 0.45;
        destCtx.fillStyle = 'white';
        destCtx.fillRect(0, 0, width, height);
        destCtx.restore();
      }
      break;
    }
    case 'slide': {
      const slideOffset = Math.round((1 - progress) * height * 0.25);
      destCtx.fillStyle = '#e0e0e0';
      destCtx.fillRect(0, 0, width, height);
      destCtx.drawImage(srcCanvas, 0, slideOffset);
      break;
    }
    default:
      destCtx.drawImage(srcCanvas, 0, 0);
  }
}

/**
 * Main entry point for creating memes.
 *
 * @example
 * ```typescript
 * import { Memer } from 'memer';
 *
 * const meme = await Memer.create({
 *   style: 'classic',
 *   topText: 'One does not simply',
 *   bottomText: 'Walk into Mordor',
 * });
 *
 * await meme.saveImage('output.png');
 * await meme.saveGif('output.gif', { animation: 'typewriter' });
 * ```
 */
export const Memer = {
  /**
   * Renders a meme and returns a MemeResult for further export.
   */
  async create(options: MemeOptions): Promise<MemeResult> {
    const canvas = await renderMeme(options);
    return buildResult(canvas, options);
  },
};
