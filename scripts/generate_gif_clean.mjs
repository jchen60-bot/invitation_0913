import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const framesDir = '/tmp/frames_clean';
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

const WIDTH = 480;
const HEIGHT = 720;
const totalFrames = 60;

console.log('Generating SVG clean frames...');

for (let i = 0; i < totalFrames; i++) {
  const frameNum = String(i).padStart(4, '0');
  const svgPath = path.join(framesDir, `frame_${frameNum}.svg`);

  let leftX = 140;
  let rightX = 340;
  let glowOpacity = 0.25;
  let showMatchedCard = false;
  let cardY = 720;
  let cardOpacity = 0;
  let heartScale = 0;
  let sparkOpacity = 0;
  let hintText = "DRAG OR TAP TO FIND MATCH";
  let handX = 240;
  let showHand = false;

  if (i <= 14) {
    // Idle float
    const float = Math.sin((i / 14) * Math.PI * 2) * 5;
    leftX = 140 + float;
    rightX = 340 - float;
    glowOpacity = 0.25 + Math.sin(i * 0.4) * 0.1;
    showHand = true;
    handX = 165 + (i % 7) * 12;
  } else if (i <= 28) {
    // Dragging together
    const dragT = (i - 14) / 14;
    leftX = 140 + dragT * 92;
    rightX = 340 - dragT * 92;
    glowOpacity = 0.35 + dragT * 0.55;
    hintText = "HLA-MATCHING IN PROGRESS...";
    showHand = true;
    handX = leftX + 25;
  } else if (i <= 38) {
    // Match snap!
    const snapT = (i - 28) / 10;
    leftX = 232;
    rightX = 248;
    glowOpacity = 0.95;
    heartScale = 1.0 + Math.sin(snapT * Math.PI) * 0.35;
    sparkOpacity = 1.0 - snapT * 0.6;
    hintText = "10/10 PERFECT GENETIC MATCH!";
  } else {
    // Reveal card
    const cardT = Math.min(1, (i - 38) / 12);
    const easeCard = 1 - (1 - cardT) * (1 - cardT);
    cardOpacity = easeCard;
    cardY = 320 - (easeCard * 125);
    showMatchedCard = true;
    heartScale = 1.0 + Math.sin((i - 38) * 0.35) * 0.06;
    glowOpacity = 0.65;
    hintText = "YOU'VE BEEN INVITED!";
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0b12"/>
      <stop offset="50%" stop-color="#141420"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </linearGradient>

    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="50%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>

    <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>

    <linearGradient id="rightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>

    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="strongGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="22" result="blur"/>
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
  <g id="header" transform="translate(24, 22)">
    <rect x="0" y="0" width="154" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="14" cy="14" r="5" fill="#F43F5E"/>
    <text x="28" y="18" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="bold">NMDP x Cal MDes</text>

    <!-- Top Right Stats Pill -->
    <g transform="translate(330, 0)">
      <rect x="0" y="0" width="102" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)"/>
      <text x="51" y="18" fill="#818CF8" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">stats [0000]</text>
    </g>
  </g>

  <!-- September Awareness Tag -->
  <g transform="translate(24, 66)">
    <rect x="0" y="0" width="432" height="26" rx="13" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.25)"/>
    <text x="216" y="17" fill="#FDA4AF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">SEPTEMBER • BLOOD CANCER AWARENESS</text>
  </g>

  <!-- Ambient Glow Center -->
  <circle cx="240" cy="205" r="105" fill="#F43F5E" opacity="${glowOpacity * 0.35}" filter="url(#glow)"/>
  <circle cx="240" cy="205" r="75" fill="#6366F1" opacity="${glowOpacity * 0.3}" filter="url(#glow)"/>

  ${
    i < 28
      ? `
  <!-- Left Shape: Donor Cell Curve -->
  <g transform="translate(${leftX}, 205)" filter="url(#glow)">
    <circle cx="0" cy="0" r="42" fill="url(#leftGrad)" />
    <!-- Connector Tab -->
    <path d="M 20 -15 C 38 -15 38 15 20 15 Z" fill="url(#leftGrad)"/>
    <text x="0" y="5" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">YOU</text>
    <text x="0" y="19" fill="rgba(255,255,255,0.8)" font-family="sans-serif" font-size="8" text-anchor="middle">DONOR</text>
  </g>

  <!-- Right Shape: Patient Cell Inset -->
  <g transform="translate(${rightX}, 205)" filter="url(#glow)">
    <circle cx="0" cy="0" r="42" fill="url(#rightGrad)" />
    <!-- Inset Socket -->
    <path d="M -20 -15 C -2 -15 -2 15 -20 15 Z" fill="#0b0b12"/>
    <text x="0" y="5" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">PATIENT</text>
    <text x="0" y="19" fill="rgba(255,255,255,0.8)" font-family="sans-serif" font-size="8" text-anchor="middle">WAITING</text>
  </g>

  <!-- Interactive Swipe Finger Gesture -->
  ${
    showHand
      ? `
  <g transform="translate(${handX}, 245)">
    <circle cx="0" cy="0" r="18" fill="rgba(255,255,255,0.25)"/>
    <circle cx="0" cy="0" r="8" fill="#FFFFFF"/>
    <path d="M 12 0 L 22 0 M 18 -4 L 22 0 L 18 4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  </g>
  `
      : ''
  }
  `
      : `
  <!-- Combined Life-Saving Heart Shape after match -->
  <g transform="translate(240, 205) scale(${heartScale})" filter="url(#strongGlow)">
    <path d="M 0,25 C -45,-15 -45,-55 0,-30 C 45,-55 45,-15 0,25 Z" fill="url(#heartGrad)" stroke="#FFFFFF" stroke-width="2"/>
    <text x="0" y="-8" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">MATCH</text>
    <text x="0" y="8" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="middle">100% HLA</text>
  </g>

  <!-- Confetti burst particles -->
  <g opacity="${sparkOpacity}">
    <circle cx="180" cy="150" r="4" fill="#FBBF24"/>
    <rect x="290" y="160" width="6" height="6" rx="2" fill="#34D399"/>
    <circle cx="210" cy="130" r="3.5" fill="#EC4899"/>
    <rect x="270" y="135" width="5" height="5" rx="1.5" fill="#60A5FA"/>
    <circle cx="150" cy="210" r="3" fill="#F43F5E"/>
    <circle cx="330" cy="205" r="3" fill="#A78BFA"/>
  </g>
  `
  }

  <!-- Interaction Status Pill -->
  <g transform="translate(24, 286)">
    <rect x="50" y="0" width="332" height="34" rx="17" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)"/>
    <text x="216" y="21" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="0.5">${hintText}</text>
  </g>

  ${
    !showMatchedCard
      ? `
  <!-- Bottom Initial Hero Prompt Card -->
  <g transform="translate(24, 340)">
    <rect x="0" y="0" width="432" height="345" rx="26" fill="#14141e" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <text x="216" y="52" fill="#94A3B8" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="2">COULD YOU BE SOMEONE'S MATCH?</text>
    <text x="216" y="88" fill="#FFFFFF" font-family="sans-serif" font-size="23" font-weight="bold" text-anchor="middle">Every 3 Minutes,</text>
    <text x="216" y="118" fill="#FFFFFF" font-family="sans-serif" font-size="19" font-weight="bold" text-anchor="middle">Someone Is Diagnosed.</text>

    <!-- Explanatory note -->
    <text x="216" y="162" fill="#94A3B8" font-family="sans-serif" font-size="13" text-anchor="middle">70% of blood cancer patients cannot find</text>
    <text x="216" y="184" fill="#94A3B8" font-family="sans-serif" font-size="13" text-anchor="middle">a matching donor inside their own family.</text>

    <!-- Tap CTA Button -->
    <g transform="translate(36, 235)">
      <rect x="0" y="0" width="360" height="54" rx="20" fill="url(#heartGrad)"/>
      <text x="180" y="32" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="1">FIND OUT • JOIN TABLING</text>
    </g>
  </g>
  `
      : `
  <!-- Revealed Official Invitation Card -->
  <g transform="translate(24, ${cardY})" opacity="${cardOpacity}">
    <rect x="0" y="0" width="432" height="490" rx="26" fill="#13131d" stroke="rgba(244,63,94,0.35)" stroke-width="2"/>
    
    <!-- Header Banner in Card -->
    <rect x="0" y="0" width="432" height="66" rx="26" fill="rgba(244,63,94,0.12)"/>
    <text x="28" y="36" fill="#F43F5E" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1.5">OFFICIAL EVENT INVITATION</text>
    <text x="28" y="54" fill="#FFFFFF" font-family="sans-serif" font-size="15" font-weight="bold">NMDP Tabling Session @ UC Berkeley</text>

    <!-- Date & Time Row -->
    <g transform="translate(28, 92)">
      <rect x="0" y="0" width="42" height="42" rx="12" fill="rgba(244,63,94,0.15)"/>
      <circle cx="21" cy="21" r="12" fill="#F43F5E" opacity="0.3"/>
      <text x="21" y="26" fill="#FDA4AF" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">21</text>
      <text x="54" y="18" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold">Monday, Sept 21, 2026</text>
      <text x="54" y="35" fill="#94A3B8" font-family="sans-serif" font-size="11">10:00 AM - 12:00 PM PDT</text>
    </g>

    <!-- Location Row -->
    <g transform="translate(28, 146)">
      <rect x="0" y="0" width="42" height="42" rx="12" fill="rgba(99,102,241,0.15)"/>
      <circle cx="21" cy="21" r="10" fill="#6366F1" opacity="0.3"/>
      <text x="21" y="26" fill="#A5B4FC" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">LOC</text>
      <text x="54" y="18" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold">Outside Amazon Hub Locker</text>
      <text x="54" y="35" fill="#94A3B8" font-family="sans-serif" font-size="11">2495 Bancroft Way, Berkeley, CA</text>
    </g>

    <!-- 3-Minute Cheek Swab Highlight Pill -->
    <g transform="translate(28, 205)">
      <rect x="0" y="0" width="376" height="34" rx="17" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)"/>
      <text x="188" y="21" fill="#6EE7B7" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">FREE 3-MIN CHEEK SWAB • NON-SURGICAL</text>
    </g>

    <!-- Primary Add to Calendar CTA -->
    <g transform="translate(28, 255)">
      <rect x="0" y="0" width="376" height="48" rx="18" fill="url(#heartGrad)"/>
      <text x="188" y="29" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" letter-spacing="0.5">+ ADD TO CALENDAR (APPLE / GOOGLE)</text>
    </g>

    <!-- 1-Tap RSVP Button -->
    <g transform="translate(28, 315)">
      <rect x="0" y="0" width="376" height="44" rx="16" fill="rgba(16,185,129,0.18)" stroke="rgba(16,185,129,0.4)"/>
      <text x="188" y="27" fill="#A7F3D0" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Count Me In! (1-Tap RSVP)</text>
    </g>
  </g>
  `
  }

  <!-- Bottom Brand Footer Dock -->
  <g transform="translate(24, 680)">
    <text x="216" y="16" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-size="10" text-anchor="middle">• UC Berkeley MDes • my.nmdp.org • Be The Match •</text>
  </g>
</svg>`;

  fs.writeFileSync(svgPath, svgContent);
}

console.log('All SVG frames written. Compiling GIF with ffmpeg...');

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const gifOutputPath = path.join(publicDir, 'invitation-interaction.gif');

// Use ffmpeg with a color palette for rich gradients and smooth animation
execSync(`ffmpeg -y -framerate 12 -i /tmp/frames_clean/frame_%04d.svg -vf "fps=12,scale=400:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" "${gifOutputPath}"`);

console.log('GIF generated successfully at:', gifOutputPath);
