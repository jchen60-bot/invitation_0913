import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Output directories
const framesDir = '/tmp/frames';
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

const WIDTH = 480;
const HEIGHT = 720;

// Render keyframes representing the full interactive sequence:
// State 1: Hero view with swipe instructions & separated HLA shapes (frames 0 - 15)
// State 2: User dragging shapes together (frames 16 - 28)
// State 3: Shapes merge into a glowing life heart with confetti & pulse (frames 29 - 42)
// State 4: Invitation Card animates in with date, venue, Bancroft map, and RSVP button (frames 43 - 65)

const totalFrames = 65;

for (let i = 0; i < totalFrames; i++) {
  const frameNum = String(i).padStart(4, '0');
  const svgPath = path.join(framesDir, `frame_${frameNum}.svg`);
  const pngPath = path.join(framesDir, `frame_${frameNum}.png`);

  let progress = i / totalFrames;
  
  // Phase logic:
  // 0 - 15: Idle floating
  // 16 - 30: Swiping towards each other
  // 31 - 42: Matched flash & pulse
  // 43 - 64: Invitation revealed + calendar pulse

  let leftX = 140;
  let rightX = 340;
  let shapeScale = 1.0;
  let glowOpacity = 0.2;
  let showMatchedCard = false;
  let cardY = 720;
  let cardOpacity = 0;
  let heartScale = 0;
  let sparkOpacity = 0;
  let hintText = "DRAG OR TAP TO FIND MATCH";
  let handX = 240;
  let showHand = false;

  if (i <= 15) {
    // Idle float
    const float = Math.sin((i / 15) * Math.PI * 2) * 5;
    leftX = 140 + float;
    rightX = 340 - float;
    glowOpacity = 0.25 + Math.sin(i * 0.4) * 0.1;
    showHand = true;
    handX = 170 + (i % 8) * 12;
  } else if (i <= 30) {
    // Dragging together
    const dragT = (i - 15) / 15;
    leftX = 140 + dragT * 90;
    rightX = 340 - dragT * 90;
    glowOpacity = 0.3 + dragT * 0.5;
    hintText = "HLA-MATCHING IN PROGRESS...";
    showHand = true;
    handX = leftX + 25;
  } else if (i <= 42) {
    // Match snap!
    const snapT = (i - 30) / 12;
    leftX = 230;
    rightX = 250;
    glowOpacity = 0.9;
    heartScale = 1.0 + Math.sin(snapT * Math.PI) * 0.35;
    sparkOpacity = 1.0 - snapT * 0.5;
    hintText = "✨ 10/10 PERFECT GENETIC MATCH!";
  } else {
    // Reveal card
    const cardT = Math.min(1, (i - 42) / 12);
    // Ease out quad
    const easeCard = 1 - (1 - cardT) * (1 - cardT);
    cardOpacity = easeCard;
    cardY = 320 - (easeCard * 120);
    showMatchedCard = true;
    heartScale = 1.0 + Math.sin((i - 42) * 0.3) * 0.08;
    glowOpacity = 0.6;
    hintText = "YOU'VE BEEN INVITED!";
  }

  const svgContent = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0c12"/>
      <stop offset="50%" stop-color="#14141f"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </linearGradient>

    <!-- Glowing Heart Gradient -->
    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="50%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>

    <!-- Left Shape Gradient -->
    <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>

    <!-- Right Shape Gradient -->
    <linearGradient id="rightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="24" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

  <!-- Subtle grid texture lines -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    <line x1="0" y1="120" x2="480" y2="120"/>
    <line x1="0" y1="240" x2="480" y2="240"/>
    <line x1="0" y1="360" x2="480" y2="360"/>
    <line x1="0" y1="480" x2="480" y2="480"/>
    <line x1="0" y1="600" x2="480" y2="600"/>
    <line x1="120" y1="0" x2="120" y2="720"/>
    <line x1="240" y1="0" x2="240" y2="720"/>
    <line x1="360" y1="0" x2="360" y2="720"/>
  </g>

  <!-- Top App Navigation Header -->
  <g id="header" transform="translate(24, 24)">
    <!-- NMDP Cal Badge -->
    <rect x="0" y="0" width="148" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="14" cy="14" r="5" fill="#F43F5E"/>
    <text x="26" y="18" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="700">NMDP &times; Cal MDes</text>

    <!-- Top Right Stats Pill -->
    <g transform="translate(340, 0)">
      <rect x="0" y="0" width="92" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)"/>
      <text x="46" y="18" fill="#818CF8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="700" text-anchor="middle">&#128274; stats 0000</text>
    </g>
  </g>

  <!-- September Awareness Tag -->
  <g transform="translate(24, 68)">
    <rect x="0" y="0" width="432" height="26" rx="13" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.25)"/>
    <text x="216" y="17" fill="#FDA4AF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="800" text-anchor="middle" letter-spacing="1">SEPTEMBER &bull; BLOOD CANCER AWARENESS MONTH</text>
  </g>

  <!-- Ambient Glow Center -->
  <circle cx="240" cy="210" r="110" fill="#F43F5E" opacity="${glowOpacity * 0.35}" filter="url(#glow)"/>
  <circle cx="240" cy="210" r="80" fill="#6366F1" opacity="${glowOpacity * 0.3}" filter="url(#glow)"/>

  ${
    i < 30
      ? `
  <!-- Left Shape: Donor Cell Curve -->
  <g transform="translate(${leftX}, 205)" filter="url(#glow)">
    <circle cx="0" cy="0" r="42" fill="url(#leftGrad)" />
    <!-- Connector Tab -->
    <path d="M 20 -15 C 38 -15 38 15 20 15 Z" fill="url(#leftGrad)"/>
    <text x="0" y="5" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" text-anchor="middle">YOU</text>
    <text x="0" y="20" fill="rgba(255,255,255,0.7)" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" text-anchor="middle">DONOR</text>
  </g>

  <!-- Right Shape: Patient Cell Inset -->
  <g transform="translate(${rightX}, 205)" filter="url(#glow)">
    <circle cx="0" cy="0" r="42" fill="url(#rightGrad)" />
    <!-- Inset Socket -->
    <path d="M -20 -15 C -2 -15 -2 15 -20 15 Z" fill="#0c0c14"/>
    <text x="0" y="5" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" text-anchor="middle">PATIENT</text>
    <text x="0" y="20" fill="rgba(255,255,255,0.7)" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" text-anchor="middle">WAITING</text>
  </g>

  <!-- Interactive Swipe Finger Gesture -->
  ${
    showHand
      ? `
  <g transform="translate(${handX}, 245)">
    <circle cx="0" cy="0" r="18" fill="rgba(255,255,255,0.25)"/>
    <circle cx="0" cy="0" r="9" fill="#FFFFFF"/>
    <!-- Arrows pointing right -->
    <path d="M 12 0 L 22 0 M 18 -4 L 22 0 L 18 4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  </g>
  `
      : ''
  }
  `
      : `
  <!-- Combined Life-Saving Heart Shape after match -->
  <g transform="translate(240, 205) scale(${heartScale})" filter="url(#strongGlow)">
    <!-- Heart Path -->
    <path d="M 0,25 
             C -45,-15 -45,-55 0,-30 
             C 45,-55 45,-15 0,25 Z" 
          fill="url(#heartGrad)" 
          stroke="#FFFFFF" 
          stroke-width="2"/>
    <text x="0" y="-8" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="900" text-anchor="middle">MATCH</text>
    <text x="0" y="8" fill="rgba(255,255,255,0.9)" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="700" text-anchor="middle">100% HLA</text>
  </g>

  <!-- Confetti burst particles -->
  <g opacity="${sparkOpacity}">
    <circle cx="180" cy="150" r="4" fill="#FBBF24"/>
    <rect x="290" y="160" width="6" height="6" rx="2" fill="#34D399" transform="rotate(25 290 160)"/>
    <circle cx="210" cy="130" r="3.5" fill="#EC4899"/>
    <rect x="270" y="135" width="5" height="5" rx="1.5" fill="#60A5FA" transform="rotate(45 270 135)"/>
    <circle cx="150" cy="210" r="3" fill="#F43F5E"/>
    <circle cx="330" cy="205" r="3" fill="#A78BFA"/>
  </g>
  `
  }

  <!-- Interaction Status Pill -->
  <g transform="translate(24, 290)">
    <rect x="60" y="0" width="312" height="34" rx="17" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)"/>
    <text x="216" y="21" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="0.5">${hintText}</text>
  </g>

  ${
    !showMatchedCard
      ? `
  <!-- Bottom Initial Hero Prompt Card -->
  <g transform="translate(24, 345)">
    <rect x="0" y="0" width="432" height="345" rx="28" fill="#14141e" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <text x="216" y="55" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="2">COULD YOU BE SOMEONE'S MATCH?</text>
    <text x="216" y="92" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="900" text-anchor="middle">Every 3 Minutes,</text>
    <text x="216" y="122" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="800" text-anchor="middle">Someone Is Diagnosed.</text>

    <!-- Explanatory note -->
    <text x="216" y="168" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" text-anchor="middle">70% of blood cancer patients cannot find</text>
    <text x="216" y="190" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" text-anchor="middle">a matching donor inside their own family.</text>

    <!-- Tap CTA Button -->
    <g transform="translate(36, 240)">
      <rect x="0" y="0" width="360" height="54" rx="20" fill="url(#heartGrad)"/>
      <text x="180" y="32" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="1">FIND OUT &bull; JOIN TABLING</text>
    </g>
  </g>
  `
      : `
  <!-- Revealed Official Invitation Card -->
  <g transform="translate(24, ${cardY})" opacity="${cardOpacity}">
    <rect x="0" y="0" width="432" height="490" rx="28" fill="#13131d" stroke="rgba(244,63,94,0.3)" stroke-width="2"/>
    
    <!-- Header Banner in Card -->
    <rect x="0" y="0" width="432" height="68" rx="28" fill="rgba(244,63,94,0.12)"/>
    <text x="32" y="38" fill="#F43F5E" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="900" letter-spacing="1.5">OFFICIAL EVENT INVITATION</text>
    <text x="32" y="55" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="900">NMDP Tabling Session @ UC Berkeley</text>

    <!-- Date & Time Row -->
    <g transform="translate(32, 95)">
      <rect x="0" y="0" width="42" height="42" rx="12" fill="rgba(244,63,94,0.15)"/>
      <text x="21" y="26" fill="#FDA4AF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" text-anchor="middle">&#128197;</text>
      <text x="56" y="18" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="800">Monday, Sept 21, 2026</text>
      <text x="56" y="36" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11">10:00 AM &ndash; 12:00 PM PDT</text>
    </g>

    <!-- Location Row -->
    <g transform="translate(32, 150)">
      <rect x="0" y="0" width="42" height="42" rx="12" fill="rgba(99,102,241,0.15)"/>
      <text x="21" y="26" fill="#A5B4FC" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" text-anchor="middle">&#128205;</text>
      <text x="56" y="18" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="800">Outside Amazon Hub Locker</text>
      <text x="56" y="36" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11">2495 Bancroft Way, Berkeley, CA</text>
    </g>

    <!-- 3-Minute Cheek Swab Highlight Pill -->
    <g transform="translate(32, 210)">
      <rect x="0" y="0" width="368" height="34" rx="17" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)"/>
      <text x="184" y="21" fill="#6EE7B7" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" text-anchor="middle">&check; FREE 3-MIN CHEEK SWAB &bull; NON-SURGICAL</text>
    </g>

    <!-- Primary Add to Calendar CTA -->
    <g transform="translate(32, 260)">
      <rect x="0" y="0" width="368" height="48" rx="18" fill="url(#heartGrad)"/>
      <text x="184" y="29" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="0.5">+ ADD TO CALENDAR (APPLE / GOOGLE)</text>
    </g>

    <!-- 1-Tap RSVP Button -->
    <g transform="translate(32, 320)">
      <rect x="0" y="0" width="368" height="44" rx="16" fill="rgba(16,185,129,0.18)" stroke="rgba(16,185,129,0.4)"/>
      <text x="184" y="27" fill="#A7F3D0" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="800" text-anchor="middle">&#128587; Count Me In! (1-Tap RSVP)</text>
    </g>
  </g>
  `
  }

  <!-- Bottom Brand Footer Dock -->
  <g transform="translate(24, 680)">
    <text x="216" y="16" fill="rgba(255,255,255,0.4)" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" text-anchor="middle">&bull; UC Berkeley MDes &bull; my.nmdp.org &bull; Be The Match &bull;</text>
  </g>
</svg>
`;

  fs.writeFileSync(svgPath, svgContent);
  // Convert svg to png using ImageMagick
  try {
    execSync(`convert -background none -density 150 "${svgPath}" -resize 480x720 "${pngPath}"`);
  } catch (err) {
    console.error(`Error converting frame ${i}:`, err);
  }
}

console.log('All SVG frames rendered. Generating GIF with ffmpeg...');

// Generate high quality optimized GIF with palettegen
const palettePath = '/tmp/palette.png';
const gifOutputPath = path.join(process.cwd(), 'public', 'nmdp-interaction-preview.gif');

// Ensure public directory exists
if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}

// 1. Generate optimal color palette
execSync(`ffmpeg -y -framerate 12 -i /tmp/frames/frame_%04d.png -vf "fps=12,scale=480:-1:flags=lanczos,palettegen=stats_mode=diff" "${palettePath}"`);

// 2. Output GIF with paletteuse for smooth colors and gradients
execSync(`ffmpeg -y -framerate 12 -i /tmp/frames/frame_%04d.png -i "${palettePath}" -lavfi "fps=12,scale=480:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3" "${gifOutputPath}"`);

console.log(`GIF generated successfully at: ${gifOutputPath}`);
