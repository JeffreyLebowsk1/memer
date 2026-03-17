# memer

> The ultimate meme generator with GIF export support — powered by Node.js, TypeScript, and Canvas.

[![npm version](https://img.shields.io/npm/v/memer.svg)](https://www.npmjs.com/package/memer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Memer** lets you programmatically create popular internet memes — including animated GIFs — with a simple, fully-typed API. No browser required; runs anywhere Node.js runs.

---

## Features

- 🎨 **17 meme styles** covering every popular format as of March 2026
- 🎬 **Animated GIF export** with 8 built-in animation effects
- 📸 **PNG & JPEG export** for static images
- 📐 **Customisable dimensions**, fonts, colours, and background images
- 🔒 **Full TypeScript support** — discriminated-union options, complete type exports
- 🧪 **70+ tests** covering all styles, animations, and export formats

---

## Installation

```bash
npm install memer
```

> **Note:** `memer` depends on [`canvas`](https://www.npmjs.com/package/canvas) which requires native build tools.  
> On Linux: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`  
> On macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`

---

## Quick Start

```typescript
import { Memer } from 'memer';

// Create a Classic Impact meme
const meme = await Memer.create({
  style: 'classic',
  topText: 'One does not simply',
  bottomText: 'Walk into Mordor',
});

// Save as PNG
await meme.saveImage('mordor.png');

// Get a PNG buffer
const pngBuffer = meme.toBuffer('png');

// Export as an animated GIF (typewriter effect)
await meme.saveGif('mordor.gif', {
  animation: 'typewriter',
  fps: 10,
  duration: 3,
});
```

---

## API

### `Memer.create(options: MemeOptions): Promise<MemeResult>`

Renders a meme and returns a `MemeResult` for further export.

```typescript
const result = await Memer.create({ style: 'classic', topText: 'Hello', bottomText: 'World' });
```

### `MemeResult`

| Property / Method | Type | Description |
|---|---|---|
| `width` | `number` | Width of the rendered image in pixels |
| `height` | `number` | Height of the rendered image in pixels |
| `toBuffer(format?)` | `Buffer` | Synchronously export as PNG or JPEG buffer |
| `saveImage(path, format?)` | `Promise<void>` | Save as PNG or JPEG file |
| `toGifBuffer(options?)` | `Promise<Buffer>` | Export as animated GIF buffer |
| `saveGif(path, options?)` | `Promise<void>` | Save as animated GIF file |

### `GifOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `animation` | `GifAnimation` | `'typewriter'` | Animation style |
| `fps` | `number` | `10` | Frames per second |
| `duration` | `number` | `3` | Total animation duration (seconds) |
| `repeat` | `boolean` | `true` | Whether the GIF loops |
| `quality` | `number` | `10` | Quality (1 = best, 20 = worst) |

### GIF Animations

| Name | Description |
|---|---|
| `typewriter` | Reveals the meme from top to bottom, line by line |
| `bounce` | The meme bounces up and down with a sinusoidal motion |
| `shake` | Rapid horizontal jitter (great for emphasis) |
| `flash` | White flash in the first third of the animation |
| `slide` | Meme slides in from below |
| `zoom` | Zooms in from 70% to full size |
| `fade` | Fades in from black |
| `rotate` | Settles from a slight tilt to upright |

---

## Meme Styles

All styles accept the following **base options**:

| Option | Type | Description |
|---|---|---|
| `width` | `number` | Canvas width in pixels (default: style-specific) |
| `height` | `number` | Canvas height in pixels (default: style-specific) |
| `backgroundColor` | `string` | CSS colour string for background fill |
| `backgroundImage` | `string` | Path to a background image file |

---

### `classic`

Bold white [Impact](https://en.wikipedia.org/wiki/Impact_(typeface)) text with black outline at the top and/or bottom — the original meme format.

```typescript
await Memer.create({
  style: 'classic',
  topText: 'One does not simply',
  bottomText: 'Walk into Mordor',
  // Optional:
  fontSize: 60,
  textColor: 'white',
  outlineColor: 'black',
  backgroundColor: '#333',
  backgroundImage: './my-image.jpg',
});
```

---

### `modernCaption`

Image area on top, white caption box below — the modern Facebook/Instagram meme style.

```typescript
await Memer.create({
  style: 'modernCaption',
  captionText: 'When you finally fix the bug at 3am',
  // Optional:
  fontSize: 28,
  fontFamily: 'Arial',
  backgroundImage: './fist-pump.jpg',
});
```

---

### `drake`

Two-panel Drake meme: top panel = rejection, bottom panel = approval.

```typescript
await Memer.create({
  style: 'drake',
  rejectText: 'Writing documentation',
  approveText: 'Shipping undocumented code',
  // Optional:
  fontSize: 24,
});
```

---

### `expandingBrain`

Multi-panel escalating galaxy-brain meme (2–4 panels).

```typescript
await Memer.create({
  style: 'expandingBrain',
  labels: [
    'Using a for loop',
    'Using Array.map()',
    'Using a single reduce()',
    'Rewriting in Haskell',
  ],
  // Optional:
  fontSize: 22,
});
```

---

### `twoButtons`

Person sweating while choosing between two options.

```typescript
await Memer.create({
  style: 'twoButtons',
  button1: 'Fix the bug',
  button2: 'Close the issue as "works as intended"',
  caption: 'Me every Monday', // optional header
  // Optional:
  fontSize: 20,
});
```

---

### `womanYellingAtCat`

Side-by-side panels: angry woman on the left, smug cat at a dinner table on the right.

```typescript
await Memer.create({
  style: 'womanYellingAtCat',
  womanText: 'YOU NEED TO FIX THIS BUG NOW!',
  catText: 'It works on my machine',
  // Optional:
  fontSize: 22,
});
```

---

### `doge`

Shiba Inu with colourful Comic Sans italic phrases scattered around the image.

```typescript
await Memer.create({
  style: 'doge',
  phrases: ['wow', 'such code', 'very TypeScript', 'much async', 'amaze'],
  // Optional: backgroundImage for a real Doge photo
});
```

---

### `isThisAPigeon`

Anime man reaching towards a butterfly, with labels for the person and butterfly.

```typescript
await Memer.create({
  style: 'isThisAPigeon',
  butterflyLabel: 'A production bug',
  personLabel: 'The on-call engineer',
  captionText: 'Is this a known issue?', // optional caption bar
});
```

---

### `changeMyMind`

Person sitting at a table with a sign displaying a bold statement.

```typescript
await Memer.create({
  style: 'changeMyMind',
  statement: 'Tabs are objectively better than spaces',
  // Optional:
  fontSize: 26,
});
```

---

### `distractedBoyfriend`

Three labeled figures — the distracted boyfriend, his girlfriend, and the other woman.

```typescript
await Memer.create({
  style: 'distractedBoyfriend',
  boyfriendLabel: 'Me',
  girlfriendLabel: 'My current project',
  otherWomanLabel: 'New shiny framework',
  // Optional:
  fontSize: 20,
});
```

---

### `thisIsFine`

Dog calmly sitting in a burning room, sipping coffee.

```typescript
await Memer.create({
  style: 'thisIsFine',
  captionText: 'Deploying to production on Friday', // defaults to "This is fine."
  // Optional:
  fontSize: 26,
});
```

---

### `oneDoesNotSimply`

Boromir-style black bar meme with white Impact text at the top and bottom.

```typescript
await Memer.create({
  style: 'oneDoesNotSimply',
  actionText: 'Deploy on a Friday',
  prefixText: 'One does not simply', // optional, this is the default
  // Optional:
  fontSize: 48,
  backgroundImage: './boromir.jpg',
});
```

---

### `grusPlan` ✨ New

Despicable Me 4-panel meme: Gru confidently presents his plan — until panel 4 reveals the horrifying flaw.

```typescript
await Memer.create({
  style: 'grusPlan',
  step1: 'Write clean, well-tested code',
  step2: 'Ship it to production',
  step3: 'Everything breaks immediately',
  // Optional:
  fontSize: 20,
});
```

---

### `exitRamp` ✨ New

Car dramatically swerving onto the exit ramp instead of continuing straight on the highway.

```typescript
await Memer.create({
  style: 'exitRamp',
  straightLabel: 'Going to sleep at a reasonable hour',
  exitLabel: '"Just one more episode"',
  carLabel: 'Me', // optional label on the car
  // Optional:
  fontSize: 18,
});
```

---

### `bernie` ✨ New

Bernie Sanders sitting cross-armed in his famous chunky brown mittens — place him anywhere.

```typescript
await Memer.create({
  style: 'bernie',
  captionText: 'I am once again asking for your financial support',
  // Optional: add a background image to place Bernie in a scene
  backgroundImage: './moon-landing.jpg',
  fontSize: 26,
});
```

---

### `tradeOffer` ✨ New

"I have made you a trade offer" — two side-by-side columns showing what each party gives and receives.

```typescript
await Memer.create({
  style: 'tradeOffer',
  theyReceive: ['Your time', 'Your energy', 'Your sanity'],
  youReceive: ['Stack Overflow reputation', 'Cold coffee', 'Job satisfaction'],
  headerText: 'I have made you a trade offer', // optional, this is the default
  // Optional:
  fontSize: 18,
});
```

---

### `stonks` ✨ New

Stylised stock-market chart going up (Stonks 📈) or down (Not Stonks 📉) with a bold caption.

```typescript
// Going up
await Memer.create({
  style: 'stonks',
  captionText: 'Stonks',
  goingUp: true, // default
});

// Going down
await Memer.create({
  style: 'stonks',
  captionText: 'Not Stonks',
  goingUp: false,
});
```

---

## Examples

### Generate all styles and save as PNG files

```typescript
import { Memer } from 'memer';
import path from 'path';

const memes = [
  { style: 'classic' as const, topText: 'It works', bottomText: 'On my machine' },
  { style: 'drake' as const, rejectText: 'PRs', approveText: 'Direct commits to main' },
  { style: 'stonks' as const, captionText: 'Stonks', goingUp: true },
];

for (const opts of memes) {
  const meme = await Memer.create(opts);
  await meme.saveImage(path.join('output', `${opts.style}.png`));
  console.log(`Saved ${opts.style} (${meme.width}×${meme.height})`);
}
```

### Create an animated GIF with the fade-in effect

```typescript
import { Memer } from 'memer';

const meme = await Memer.create({
  style: 'thisIsFine',
  captionText: 'Everything is absolutely fine',
});

await meme.saveGif('this-is-fine.gif', {
  animation: 'fade',
  fps: 12,
  duration: 2,
  quality: 5,   // 1 = best quality
  repeat: true, // loop forever
});
```

### Use a real background image

```typescript
import { Memer } from 'memer';

const meme = await Memer.create({
  style: 'classic',
  topText: 'When the CI passes',
  bottomText: 'On the first try',
  backgroundImage: './celebration.jpg',
  width: 800,
  height: 600,
});

await meme.saveImage('ci-pass.png');
```

---

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run all tests (70 tests)
npm test

# Lint
npm run lint
npm run lint:fix
```

### Project structure

```
src/
├── index.ts          # Public API exports
├── memer.ts          # Core Memer.create() + animation engine
├── types.ts          # TypeScript interfaces for all styles
├── styles/           # One file per meme style renderer
│   ├── classic.ts
│   ├── modernCaption.ts
│   ├── drake.ts
│   ├── expandingBrain.ts
│   ├── twoButtons.ts
│   ├── womanYellingAtCat.ts
│   ├── doge.ts
│   ├── isThisAPigeon.ts
│   ├── changeMyMind.ts
│   ├── distractedBoyfriend.ts
│   ├── thisIsFine.ts
│   ├── oneDoesNotSimply.ts
│   ├── grusPlan.ts
│   ├── exitRamp.ts
│   ├── bernie.ts
│   ├── tradeOffer.ts
│   └── stonks.ts
└── utils/
    ├── canvas.ts     # Canvas helpers (background, buffer, rounded rects)
    ├── gif.ts        # GIF frame builder + encoder
    └── text.ts       # Text wrapping, outlined text, centered text
tests/
└── memer.test.ts     # 70 Jest tests
```

---

## License

MIT

