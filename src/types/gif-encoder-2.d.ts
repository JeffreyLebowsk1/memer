declare module 'gif-encoder-2' {
  interface GIFEncoderOutput {
    getData(): Uint8Array;
  }

  class GIFEncoder {
    out: GIFEncoderOutput;
    constructor(
      width: number,
      height: number,
      algorithm?: string,
      useOptimizer?: boolean,
      totalFrames?: number
    );
    setDelay(delay: number): void;
    setRepeat(repeat: number): void;
    setQuality(quality: number): void;
    setFrameRate(fps: number): void;
    start(): void;
    addFrame(ctx: import('canvas').CanvasRenderingContext2D): void;
    finish(): void;
  }

  export = GIFEncoder;
}
