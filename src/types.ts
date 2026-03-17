/**
 * Supported meme styles as of March 2026.
 */
export type MemeStyle =
  | 'classic'
  | 'modernCaption'
  | 'drake'
  | 'expandingBrain'
  | 'twoButtons'
  | 'womanYellingAtCat'
  | 'doge'
  | 'isThisAPigeon'
  | 'changeMyMind'
  | 'distractedBoyfriend'
  | 'thisIsFine'
  | 'oneDoesNotSimply'
  | 'grusPlan'
  | 'exitRamp'
  | 'bernie'
  | 'tradeOffer'
  | 'stonks';

/** Output image format for static memes. */
export type ImageFormat = 'png' | 'jpeg';

/** GIF animation type for animated export. */
export type GifAnimation = 'typewriter' | 'bounce' | 'shake' | 'flash' | 'slide' | 'zoom' | 'fade' | 'rotate';

/** Text alignment within a meme panel. */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Base options common to all meme styles.
 */
export interface BaseMemeOptions {
  /** Canvas width in pixels. Defaults to 600. */
  width?: number;
  /** Canvas height in pixels. Defaults vary by style. */
  height?: number;
  /** Background color (CSS color string). Used when no image is supplied. */
  backgroundColor?: string;
  /** Optional path to a background image. */
  backgroundImage?: string;
}

/**
 * Options for the Classic Impact meme style.
 * Renders bold white Impact text at the top and/or bottom of an image.
 */
export interface ClassicMemeOptions extends BaseMemeOptions {
  style: 'classic';
  topText?: string;
  bottomText?: string;
  fontSize?: number;
  /** Text outline color. Defaults to 'black'. */
  outlineColor?: string;
  /** Text fill color. Defaults to 'white'. */
  textColor?: string;
}

/**
 * Options for the Modern Caption meme style.
 * White box below the image with centered black text.
 */
export interface ModernCaptionMemeOptions extends BaseMemeOptions {
  style: 'modernCaption';
  captionText: string;
  fontSize?: number;
  fontFamily?: string;
}

/**
 * Options for the Drake meme style.
 * Two-panel meme: top panel = disapproval, bottom panel = approval.
 */
export interface DrakeMemeOptions extends BaseMemeOptions {
  style: 'drake';
  /** Text for the thing Drake disapproves of (top panel). */
  rejectText: string;
  /** Text for the thing Drake approves of (bottom panel). */
  approveText: string;
  fontSize?: number;
}

/**
 * Options for the Expanding Brain meme style.
 * Multiple stacked panels with escalating levels of galaxy-brained ideas.
 */
export interface ExpandingBrainMemeOptions extends BaseMemeOptions {
  style: 'expandingBrain';
  /** Array of text labels, ordered from small-brain to big-brain (2–4 items). */
  labels: [string, string, ...string[]];
  fontSize?: number;
}

/**
 * Options for the Two Buttons meme style.
 * Person sweating while choosing between two options.
 */
export interface TwoButtonsMemeOptions extends BaseMemeOptions {
  style: 'twoButtons';
  button1: string;
  button2: string;
  /** Optional caption above the buttons. */
  caption?: string;
  fontSize?: number;
}

/**
 * Options for the Woman Yelling at Cat meme style.
 * Side-by-side panels: woman pointing/yelling, smug cat at dinner table.
 */
export interface WomanYellingAtCatMemeOptions extends BaseMemeOptions {
  style: 'womanYellingAtCat';
  womanText: string;
  catText: string;
  fontSize?: number;
}

/**
 * Options for the Doge meme style.
 * Shiba Inu with multicolored Comic Sans italic phrases scattered around.
 */
export interface DogeMemeOptions extends BaseMemeOptions {
  style: 'doge';
  /** Array of short phrases to render around the image (e.g. ['wow', 'such meme', 'much fun']). */
  phrases: string[];
}

/**
 * Options for the Is This a Pigeon? meme style.
 * Anime man gesturing at butterfly with a label.
 */
export interface IsThisAPigeonMemeOptions extends BaseMemeOptions {
  style: 'isThisAPigeon';
  personLabel?: string;
  butterflyLabel: string;
  captionText?: string;
}

/**
 * Options for the Change My Mind meme style.
 * Person at a table with a sign bearing a bold statement.
 */
export interface ChangeMyMindMemeOptions extends BaseMemeOptions {
  style: 'changeMyMind';
  statement: string;
  fontSize?: number;
}

/**
 * Options for the Distracted Boyfriend meme style.
 * Three-label meme: boyfriend, girlfriend, other woman.
 */
export interface DistractedBoyfriendMemeOptions extends BaseMemeOptions {
  style: 'distractedBoyfriend';
  boyfriendLabel: string;
  girlfriendLabel: string;
  otherWomanLabel: string;
  fontSize?: number;
}

/**
 * Options for the This Is Fine meme style.
 * Dog sitting in a burning room, captioned with a calm statement.
 */
export interface ThisIsFineMemeOptions extends BaseMemeOptions {
  style: 'thisIsFine';
  captionText?: string;
  fontSize?: number;
}

/**
 * Options for the One Does Not Simply meme style.
 * Boromir (black bars top and bottom) with a statement.
 */
export interface OneDoesNotSimplyMemeOptions extends BaseMemeOptions {
  style: 'oneDoesNotSimply';
  /** The text that replaces "walk into Mordor". */
  actionText: string;
  /** Override the opening phrase. Defaults to "One does not simply". */
  prefixText?: string;
  fontSize?: number;
}

/**
 * Options for the Gru's Plan meme style.
 * Four-panel comic where the last panel repeats step 3 with a horrified reaction.
 * Inspired by the Despicable Me villain Gru.
 */
export interface GrusPlanMemeOptions extends BaseMemeOptions {
  style: 'grusPlan';
  /** Step 1: The first part of the plan. */
  step1: string;
  /** Step 2: The second part of the plan. */
  step2: string;
  /** Step 3: The punchline / unexpected outcome. */
  step3: string;
  fontSize?: number;
}

/**
 * Options for the Exit Ramp meme style.
 * Car on a highway ignoring the straight path and swerving onto the exit ramp.
 * Used to show preferring something unexpected over the obvious choice.
 */
export interface ExitRampMemeOptions extends BaseMemeOptions {
  style: 'exitRamp';
  /** Label for the straight highway option (the sensible/boring choice). */
  straightLabel: string;
  /** Label for the exit ramp option (the exciting/chaotic choice). */
  exitLabel: string;
  /** Optional label for the car/driver. */
  carLabel?: string;
  fontSize?: number;
}

/**
 * Options for the Bernie meme style.
 * Bernie Sanders sitting in mittens — place him anywhere with a caption.
 */
export interface BernieMemeOptions extends BaseMemeOptions {
  style: 'bernie';
  /** Caption text displayed below or beside Bernie. */
  captionText: string;
  fontSize?: number;
}

/**
 * Options for the Trade Offer meme style.
 * "I have made you a trade offer" — two columns showing what each party gives and receives.
 */
export interface TradeOfferMemeOptions extends BaseMemeOptions {
  style: 'tradeOffer';
  /** Items the first party (you) receive. */
  theyReceive: string[];
  /** Items the second party receives (what you give). */
  youReceive: string[];
  /** Optional header/title text. Defaults to "I have made you a trade offer". */
  headerText?: string;
  fontSize?: number;
}

/**
 * Options for the Stonks meme style.
 * A chart going up ("Stonks") or down ("Not Stonks") with a caption.
 */
export interface StonksMemeOptions extends BaseMemeOptions {
  style: 'stonks';
  /** Whether the chart is going up (stonks) or down (not stonks). Defaults to true. */
  goingUp?: boolean;
  /** Caption text overlaid on the chart. */
  captionText: string;
  fontSize?: number;
}

/** Union of all style-specific option types. */
export type MemeOptions =
  | ClassicMemeOptions
  | ModernCaptionMemeOptions
  | DrakeMemeOptions
  | ExpandingBrainMemeOptions
  | TwoButtonsMemeOptions
  | WomanYellingAtCatMemeOptions
  | DogeMemeOptions
  | IsThisAPigeonMemeOptions
  | ChangeMyMindMemeOptions
  | DistractedBoyfriendMemeOptions
  | ThisIsFineMemeOptions
  | OneDoesNotSimplyMemeOptions
  | GrusPlanMemeOptions
  | ExitRampMemeOptions
  | BernieMemeOptions
  | TradeOfferMemeOptions
  | StonksMemeOptions;

/** Options controlling GIF export. */
export interface GifOptions {
  /** Frames per second. Defaults to 10. */
  fps?: number;
  /** Total duration of the animation in seconds. Defaults to 3. */
  duration?: number;
  /** Animation style applied to the meme text. Defaults to 'typewriter'. */
  animation?: GifAnimation;
  /** Whether the GIF loops indefinitely. Defaults to true. */
  repeat?: boolean;
  /** GIF quality (1 = best, 20 = worst). Defaults to 10. */
  quality?: number;
}

/** The result object returned by Memer after rendering. */
export interface MemeResult {
  /** Width of the rendered image in pixels. */
  width: number;
  /** Height of the rendered image in pixels. */
  height: number;
  /**
   * Export the meme as a PNG or JPEG Buffer.
   * @param format - Output format. Defaults to 'png'.
   */
  toBuffer(format?: ImageFormat): Buffer;
  /**
   * Save the meme to a file.
   * @param filePath - Destination file path.
   * @param format - Output format. Defaults to 'png'.
   */
  saveImage(filePath: string, format?: ImageFormat): Promise<void>;
  /**
   * Export the meme as an animated GIF Buffer.
   * @param options - GIF animation options.
   */
  toGifBuffer(options?: GifOptions): Promise<Buffer>;
  /**
   * Save the meme as an animated GIF.
   * @param filePath - Destination file path (should end with .gif).
   * @param options - GIF animation options.
   */
  saveGif(filePath: string, options?: GifOptions): Promise<void>;
}
