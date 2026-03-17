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
import { renderGrusPlan } from './styles/grusPlan';
import { renderExitRamp } from './styles/exitRamp';
import { renderBernie } from './styles/bernie';
import { renderTradeOffer } from './styles/tradeOffer';
import { renderStonks } from './styles/stonks';

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
    case 'grusPlan':
      return renderGrusPlan(options);
    case 'exitRamp':
      return renderExitRamp(options);
    case 'bernie':
      return renderBernie(options);
    case 'tradeOffer':
      return renderTradeOffer(options);
    case 'stonks':
      return renderStonks(options);
    default: {
      const exhaustive: never = options;
      throw new Error(`Unknown meme style: ${(exhaustive as MemeOptions).style}`);
    }
  }
}

/**
 * Builds a MemeResult wrapping the rendered canvas.
 */
function buildResult(canvas: Canvas): MemeResult {
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

      // Use the already-rendered canvas — no need to re-render per frame.
      // Each frame applies an animation effect on top of the static meme.
      const frames = await buildFrames(
        canvas.width,
        canvas.height,
        totalFrames,
        (ctx, frameIndex, total) => {
          applyAnimation(ctx, canvas, animation, frameIndex, total);
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
 * Applies an animation effect to the destination context using the pre-rendered source canvas.
 */
function applyAnimation(
  destCtx: import('canvas').CanvasRenderingContext2D,
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
    case 'zoom': {
      // Zoom in from 70% → 100% over the animation duration
      const scale = 0.7 + progress * 0.3;
      const scaledW = Math.round(width * scale);
      const scaledH = Math.round(height * scale);
      const offsetX = Math.round((width - scaledW) / 2);
      const offsetY = Math.round((height - scaledH) / 2);
      destCtx.fillStyle = '#000';
      destCtx.fillRect(0, 0, width, height);
      destCtx.drawImage(srcCanvas, offsetX, offsetY, scaledW, scaledH);
      break;
    }
    case 'fade': {
      // Fade in from transparent to fully opaque
      destCtx.fillStyle = '#000';
      destCtx.fillRect(0, 0, width, height);
      destCtx.save();
      destCtx.globalAlpha = progress;
      destCtx.drawImage(srcCanvas, 0, 0);
      destCtx.restore();
      break;
    }
    case 'rotate': {
      // Subtle rotation that settles: starts slightly tilted, rotates to upright
      const maxAngle = 0.15; // radians
      const angle = maxAngle * (1 - progress);
      destCtx.fillStyle = '#111';
      destCtx.fillRect(0, 0, width, height);
      destCtx.save();
      destCtx.translate(width / 2, height / 2);
      destCtx.rotate(angle);
      destCtx.drawImage(srcCanvas, -width / 2, -height / 2);
      destCtx.restore();
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
    return buildResult(canvas);
  },
};
