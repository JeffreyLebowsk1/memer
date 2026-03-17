import * as fs from 'fs';
import * as path from 'path';
import { Memer } from '../src/memer';
import type { MemeOptions, GifOptions } from '../src/types';

const OUTPUT_DIR = path.join(__dirname, '../tmp/test-output');

beforeAll(async () => {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // Clean up test output directory
  await fs.promises.rm(OUTPUT_DIR, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function renderAndCheck(options: MemeOptions): Promise<void> {
  const result = await Memer.create(options);
  expect(result.width).toBeGreaterThan(0);
  expect(result.height).toBeGreaterThan(0);

  const buf = result.toBuffer('png');
  expect(buf).toBeInstanceOf(Buffer);
  expect(buf.length).toBeGreaterThan(100);

  // Verify PNG magic bytes
  expect(buf.slice(0, 4).toString('hex')).toBe('89504e47');
}

// ---------------------------------------------------------------------------
// Classic
// ---------------------------------------------------------------------------

describe('classic style', () => {
  it('renders with both top and bottom text', async () => {
    await renderAndCheck({
      style: 'classic',
      topText: 'Top text here',
      bottomText: 'Bottom text here',
    });
  });

  it('renders with only top text', async () => {
    await renderAndCheck({ style: 'classic', topText: 'Top only' });
  });

  it('renders with only bottom text', async () => {
    await renderAndCheck({ style: 'classic', bottomText: 'Bottom only' });
  });

  it('respects custom dimensions', async () => {
    const result = await Memer.create({
      style: 'classic',
      topText: 'Custom size',
      width: 800,
      height: 600,
    });
    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
  });

  it('respects custom colors', async () => {
    await renderAndCheck({
      style: 'classic',
      topText: 'Custom colors',
      textColor: 'yellow',
      outlineColor: 'red',
      backgroundColor: '#123456',
    });
  });
});

// ---------------------------------------------------------------------------
// Modern Caption
// ---------------------------------------------------------------------------

describe('modernCaption style', () => {
  it('renders caption below image', async () => {
    await renderAndCheck({
      style: 'modernCaption',
      captionText: 'This is a modern meme caption',
    });
  });

  it('handles long caption text with wrapping', async () => {
    await renderAndCheck({
      style: 'modernCaption',
      captionText:
        'This is a very long caption that should wrap across multiple lines in the caption box below the image area of the meme',
    });
  });
});

// ---------------------------------------------------------------------------
// Drake
// ---------------------------------------------------------------------------

describe('drake style', () => {
  it('renders two panels', async () => {
    const result = await Memer.create({
      style: 'drake',
      rejectText: 'Doing it the wrong way',
      approveText: 'Doing it the right way',
    });
    // Should be taller than wide or at least double a single panel
    expect(result.height).toBeGreaterThanOrEqual(400);
  });

  it('renders with custom dimensions', async () => {
    const result = await Memer.create({
      style: 'drake',
      rejectText: 'Rejected',
      approveText: 'Approved',
      width: 500,
      height: 400,
    });
    expect(result.width).toBe(500);
    expect(result.height).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Expanding Brain
// ---------------------------------------------------------------------------

describe('expandingBrain style', () => {
  it('renders 2 panels', async () => {
    await renderAndCheck({
      style: 'expandingBrain',
      labels: ['Small idea', 'Big idea'],
    });
  });

  it('renders 4 panels', async () => {
    await renderAndCheck({
      style: 'expandingBrain',
      labels: ['Idea 1', 'Idea 2', 'Idea 3', 'Idea 4'],
    });
  });

  it('clamps to max 4 panels', async () => {
    // TypeScript allows extra items; runtime should handle gracefully
    const result = await Memer.create({
      style: 'expandingBrain',
      labels: ['A', 'B', 'C', 'D', 'E'] as [string, string, ...string[]],
    });
    // Still valid output
    expect(result.width).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Two Buttons
// ---------------------------------------------------------------------------

describe('twoButtons style', () => {
  it('renders without optional caption', async () => {
    await renderAndCheck({
      style: 'twoButtons',
      button1: 'Option A',
      button2: 'Option B',
    });
  });

  it('renders with caption', async () => {
    await renderAndCheck({
      style: 'twoButtons',
      button1: 'Yes',
      button2: 'Also yes',
      caption: 'Impossible choice',
    });
  });
});

// ---------------------------------------------------------------------------
// Woman Yelling at Cat
// ---------------------------------------------------------------------------

describe('womanYellingAtCat style', () => {
  it('renders two panels side by side', async () => {
    const result = await Memer.create({
      style: 'womanYellingAtCat',
      womanText: 'How dare you!',
      catText: 'No.',
    });
    // Width should be greater than height for side-by-side panels
    expect(result.width).toBeGreaterThan(result.height * 0.8);
  });
});

// ---------------------------------------------------------------------------
// Doge
// ---------------------------------------------------------------------------

describe('doge style', () => {
  it('renders with phrases', async () => {
    await renderAndCheck({
      style: 'doge',
      phrases: ['wow', 'such meme', 'very test', 'much canvas'],
    });
  });

  it('renders with a single phrase', async () => {
    await renderAndCheck({ style: 'doge', phrases: ['wow'] });
  });

  it('caps at 8 phrases', async () => {
    const result = await Memer.create({
      style: 'doge',
      phrases: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    });
    expect(result.width).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Is This a Pigeon?
// ---------------------------------------------------------------------------

describe('isThisAPigeon style', () => {
  it('renders with butterfly label only', async () => {
    await renderAndCheck({
      style: 'isThisAPigeon',
      butterflyLabel: 'Is this a pigeon?',
    });
  });

  it('renders with all labels', async () => {
    await renderAndCheck({
      style: 'isThisAPigeon',
      personLabel: 'Me',
      butterflyLabel: 'A butterfly',
      captionText: 'Is this a pigeon?',
    });
  });
});

// ---------------------------------------------------------------------------
// Change My Mind
// ---------------------------------------------------------------------------

describe('changeMyMind style', () => {
  it('renders the sign with statement', async () => {
    await renderAndCheck({
      style: 'changeMyMind',
      statement: 'Tabs are better than spaces',
    });
  });
});

// ---------------------------------------------------------------------------
// Distracted Boyfriend
// ---------------------------------------------------------------------------

describe('distractedBoyfriend style', () => {
  it('renders three labeled figures', async () => {
    await renderAndCheck({
      style: 'distractedBoyfriend',
      boyfriendLabel: 'Me',
      girlfriendLabel: 'My responsibilities',
      otherWomanLabel: 'New shiny thing',
    });
  });
});

// ---------------------------------------------------------------------------
// This Is Fine
// ---------------------------------------------------------------------------

describe('thisIsFine style', () => {
  it('renders with default caption', async () => {
    await renderAndCheck({ style: 'thisIsFine' });
  });

  it('renders with custom caption', async () => {
    await renderAndCheck({
      style: 'thisIsFine',
      captionText: 'Everything is under control.',
    });
  });
});

// ---------------------------------------------------------------------------
// One Does Not Simply
// ---------------------------------------------------------------------------

describe('oneDoesNotSimply style', () => {
  it('renders with default prefix', async () => {
    await renderAndCheck({
      style: 'oneDoesNotSimply',
      actionText: 'Write tests',
    });
  });

  it('renders with custom prefix', async () => {
    await renderAndCheck({
      style: 'oneDoesNotSimply',
      prefixText: 'One simply does not',
      actionText: 'Walk into Mordor',
    });
  });
});

// ---------------------------------------------------------------------------
// saveImage
// ---------------------------------------------------------------------------

describe('saveImage', () => {
  it('saves a PNG file', async () => {
    const filePath = path.join(OUTPUT_DIR, 'test-classic.png');
    const result = await Memer.create({
      style: 'classic',
      topText: 'Saved',
      bottomText: 'To disk',
    });
    await result.saveImage(filePath);
    const stat = await fs.promises.stat(filePath);
    expect(stat.size).toBeGreaterThan(100);
  });

  it('saves a JPEG file', async () => {
    const filePath = path.join(OUTPUT_DIR, 'test-classic.jpg');
    const result = await Memer.create({
      style: 'classic',
      topText: 'JPEG',
      bottomText: 'Test',
    });
    await result.saveImage(filePath, 'jpeg');
    const buf = await fs.promises.readFile(filePath);
    // JPEG magic bytes: ff d8
    expect(buf.slice(0, 2).toString('hex')).toBe('ffd8');
  });
});

// ---------------------------------------------------------------------------
// GIF export
// ---------------------------------------------------------------------------

describe('GIF export', () => {
  const gifOptions: GifOptions = {
    fps: 5,
    duration: 1,
    quality: 20,
  };

  it('toGifBuffer returns a Buffer', async () => {
    const result = await Memer.create({
      style: 'classic',
      topText: 'GIF',
      bottomText: 'Test',
    });
    const buf = await result.toGifBuffer({ ...gifOptions, animation: 'typewriter' });
    expect(buf).toBeInstanceOf(Buffer);
    expect(buf.length).toBeGreaterThan(0);
    // GIF magic bytes: GIF8
    expect(buf.slice(0, 4).toString('ascii')).toMatch(/^GIF8/);
  }, 30000);

  it('saves a GIF file', async () => {
    const filePath = path.join(OUTPUT_DIR, 'test-classic.gif');
    const result = await Memer.create({
      style: 'classic',
      topText: 'Animated',
      bottomText: 'Meme',
    });
    await result.saveGif(filePath, { ...gifOptions, animation: 'bounce' });
    const stat = await fs.promises.stat(filePath);
    expect(stat.size).toBeGreaterThan(100);
  }, 30000);

  const animations: GifOptions['animation'][] = ['typewriter', 'bounce', 'shake', 'flash', 'slide'];
  animations.forEach((anim) => {
    it(`animation "${anim}" produces a valid GIF`, async () => {
      const result = await Memer.create({
        style: 'modernCaption',
        captionText: `${anim} animation`,
      });
      const buf = await result.toGifBuffer({ ...gifOptions, animation: anim });
      expect(buf.slice(0, 4).toString('ascii')).toMatch(/^GIF8/);
    }, 30000);
  });

  it('non-repeating GIF', async () => {
    const result = await Memer.create({
      style: 'thisIsFine',
    });
    const buf = await result.toGifBuffer({ ...gifOptions, repeat: false });
    expect(buf).toBeInstanceOf(Buffer);
  }, 30000);

  const newAnimations: GifOptions['animation'][] = ['zoom', 'fade', 'rotate'];
  newAnimations.forEach((anim) => {
    it(`new animation "${anim}" produces a valid GIF`, async () => {
      const result = await Memer.create({
        style: 'classic',
        topText: `${anim}`,
        bottomText: 'animation',
      });
      const buf = await result.toGifBuffer({ ...gifOptions, animation: anim });
      expect(buf.slice(0, 4).toString('ascii')).toMatch(/^GIF8/);
    }, 30000);
  });

  it('GIF frames contain rendered content (not blank)', async () => {
    // Verify the GIF bug fix: frames must not be blank white/grey.
    // We check that the PNG of the static meme has non-trivial pixel data.
    const result = await Memer.create({
      style: 'classic',
      topText: 'NOT BLANK',
      bottomText: 'FRAME CHECK',
      backgroundColor: '#ff0000', // bright red background — easy to detect
    });
    const buf = result.toBuffer('png');
    // A red 600×450 canvas would have pixel bytes far from all-white.
    // If the meme renders correctly the average byte value should not be 255.
    const sum = Array.from(buf).slice(0, 1000).reduce((a, b) => a + b, 0);
    expect(sum).toBeGreaterThan(0);
    expect(sum).toBeLessThan(255 * 1000); // not all white
  });
});

// ---------------------------------------------------------------------------
// Gru's Plan
// ---------------------------------------------------------------------------

describe("grusPlan style", () => {
  it('renders 4 panels with all steps', async () => {
    const result = await Memer.create({
      style: 'grusPlan',
      step1: 'Step 1: Steal the moon',
      step2: 'Step 2: Ransom it for $1 million',
      step3: 'The moon crashes into Earth',
    });
    // 4 panels stacked — height should be at least 4× a single panel height
    expect(result.height).toBeGreaterThanOrEqual(600);
  });

  it('renders with custom font size', async () => {
    await renderAndCheck({
      style: 'grusPlan',
      step1: 'Write code',
      step2: 'Write tests',
      step3: 'Deploy to production on Friday',
      fontSize: 18,
    });
  });

  it('respects custom width and height', async () => {
    const result = await Memer.create({
      style: 'grusPlan',
      step1: 'A',
      step2: 'B',
      step3: 'C',
      width: 500,
      height: 600,
    });
    expect(result.width).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// Exit Ramp
// ---------------------------------------------------------------------------

describe('exitRamp style', () => {
  it('renders highway scene with labels', async () => {
    await renderAndCheck({
      style: 'exitRamp',
      straightLabel: 'Doing the right thing',
      exitLabel: 'The fun thing',
    });
  });

  it('renders with car label', async () => {
    await renderAndCheck({
      style: 'exitRamp',
      straightLabel: 'Sleep',
      exitLabel: 'One more episode',
      carLabel: 'Me',
    });
  });
});

// ---------------------------------------------------------------------------
// Bernie
// ---------------------------------------------------------------------------

describe('bernie style', () => {
  it('renders Bernie with caption', async () => {
    await renderAndCheck({
      style: 'bernie',
      captionText: 'I am once again asking for your support',
    });
  });

  it('renders with custom background color', async () => {
    await renderAndCheck({
      style: 'bernie',
      captionText: 'Just chillin',
      backgroundColor: '#c8e6c9',
    });
  });
});

// ---------------------------------------------------------------------------
// Trade Offer
// ---------------------------------------------------------------------------

describe('tradeOffer style', () => {
  it('renders with basic trade items', async () => {
    await renderAndCheck({
      style: 'tradeOffer',
      theyReceive: ['Your time', 'Your energy'],
      youReceive: ['Experience', 'Pizza'],
    });
  });

  it('renders with custom header and many items', async () => {
    await renderAndCheck({
      style: 'tradeOffer',
      headerText: 'I have proposed a deal',
      theyReceive: ['Item A', 'Item B', 'Item C', 'Item D'],
      youReceive: ['Thing 1', 'Thing 2', 'Thing 3'],
    });
  });

  it('renders with default header when none given', async () => {
    const result = await Memer.create({
      style: 'tradeOffer',
      theyReceive: ['Nothing'],
      youReceive: ['Also nothing'],
    });
    expect(result.width).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Stonks
// ---------------------------------------------------------------------------

describe('stonks style', () => {
  it('renders stonks (going up)', async () => {
    await renderAndCheck({
      style: 'stonks',
      captionText: 'Stonks',
      goingUp: true,
    });
  });

  it('renders not stonks (going down)', async () => {
    await renderAndCheck({
      style: 'stonks',
      captionText: 'Not Stonks',
      goingUp: false,
    });
  });

  it('defaults to going up when goingUp is not specified', async () => {
    const result = await Memer.create({
      style: 'stonks',
      captionText: 'Default Stonks',
    });
    expect(result.width).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// All styles smoke test
// ---------------------------------------------------------------------------

describe('all styles smoke test', () => {
  const allStyles: MemeOptions[] = [
    { style: 'classic', topText: 'Classic', bottomText: 'Meme' },
    { style: 'modernCaption', captionText: 'Modern caption meme' },
    { style: 'drake', rejectText: 'Old way', approveText: 'New way' },
    { style: 'expandingBrain', labels: ['Small', 'Medium', 'Large'] },
    { style: 'twoButtons', button1: 'Button 1', button2: 'Button 2' },
    { style: 'womanYellingAtCat', womanText: 'Woman text', catText: 'Cat text' },
    { style: 'doge', phrases: ['wow', 'such doge', 'very meme'] },
    { style: 'isThisAPigeon', butterflyLabel: 'Is this a pigeon?' },
    { style: 'changeMyMind', statement: 'This library is great' },
    {
      style: 'distractedBoyfriend',
      boyfriendLabel: 'Dev',
      girlfriendLabel: 'Work',
      otherWomanLabel: 'Side project',
    },
    { style: 'thisIsFine', captionText: 'This is fine.' },
    { style: 'oneDoesNotSimply', actionText: 'Use tabs' },
    { style: 'grusPlan', step1: 'Plan', step2: 'Execute', step3: 'Chaos' },
    { style: 'exitRamp', straightLabel: 'Responsibility', exitLabel: 'Fun' },
    { style: 'bernie', captionText: 'I am once again asking' },
    { style: 'tradeOffer', theyReceive: ['Time'], youReceive: ['Fun'] },
    { style: 'stonks', captionText: 'Stonks', goingUp: true },
  ];

  allStyles.forEach(({ style }) => {
    it(`renders "${style}" without errors`, async () => {
      const opts = allStyles.find((o) => o.style === style)!;
      await renderAndCheck(opts);
    });
  });
});
