const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Standard App Icon SVG (512x512)
const appIconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#be123c"/>
      <stop offset="40%" stop-color="#9f1239"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background with subtle luxury border -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="14" y="14" width="484" height="484" rx="100" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.6"/>
  <rect x="24" y="24" width="464" height="464" rx="90" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="6,6" stroke-opacity="0.4"/>

  <!-- Ornate Arch / Floral Garland -->
  <g filter="url(#shadow)">
    <!-- Royal Crown / Crest at top -->
    <path d="M256 90 L275 130 L315 110 L295 150 L256 142 L217 150 L197 110 L237 130 Z" fill="url(#goldGrad)"/>
    <circle cx="256" cy="82" r="6" fill="#fef08a"/>
    <circle cx="195" cy="104" r="5" fill="#fef08a"/>
    <circle cx="317" cy="104" r="5" fill="#fef08a"/>

    <!-- Mandap Arch Curves -->
    <path d="M120 340 C120 190, 392 190, 392 340" fill="none" stroke="url(#goldGrad)" stroke-width="5" stroke-linecap="round"/>
    <path d="M140 340 C140 215, 372 215, 372 340" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.7"/>

    <!-- Central Royal Monogram 'R' -->
    <text x="256" y="295" font-family="'Playfair Display', Georgia, serif" font-size="160" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle">R</text>

    <!-- Sparkles / Stars -->
    <path d="M165 195 Q175 195 175 185 Q175 195 185 195 Q175 195 175 205 Q175 195 165 195 Z" fill="#fef08a"/>
    <path d="M327 195 Q337 195 337 185 Q337 195 347 195 Q337 195 337 205 Q337 195 327 195 Z" fill="#fef08a"/>

    <!-- Brand Name Text -->
    <text x="256" y="375" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="bold" letter-spacing="8" fill="#ffffff" text-anchor="middle">RIWAJ</text>
    <text x="256" y="415" font-family="system-ui, sans-serif" font-size="16" font-weight="600" letter-spacing="6" fill="#fef08a" text-anchor="middle">VINDHYA EVENTS</text>
  </g>
</svg>
`;

// 2. Maskable Icon SVG (512x512) - Content stays inside safe zone (padding 18%)
const maskableIconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#be123c"/>
      <stop offset="50%" stop-color="#9f1239"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>
    <linearGradient id="goldGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>

  <!-- Full background bleed for maskable -->
  <rect width="512" height="512" fill="url(#bgGradMask)"/>

  <!-- Safe Area Content: Center within 380x380 box -->
  <g transform="translate(256, 256) scale(0.78) translate(-256, -256)">
    <!-- Royal Crown -->
    <path d="M256 100 L275 140 L315 120 L295 160 L256 152 L217 160 L197 120 L237 140 Z" fill="url(#goldGradMask)"/>
    <circle cx="256" cy="92" r="6" fill="#fef08a"/>
    <circle cx="195" cy="114" r="5" fill="#fef08a"/>
    <circle cx="317" cy="114" r="5" fill="#fef08a"/>

    <!-- Mandap Arch -->
    <path d="M120 340 C120 200, 392 200, 392 340" fill="none" stroke="url(#goldGradMask)" stroke-width="6" stroke-linecap="round"/>

    <!-- Central Monogram -->
    <text x="256" y="295" font-family="'Playfair Display', Georgia, serif" font-size="155" font-weight="bold" fill="url(#goldGradMask)" text-anchor="middle">R</text>

    <!-- Text -->
    <text x="256" y="375" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="bold" letter-spacing="8" fill="#ffffff" text-anchor="middle">RIWAJ</text>
    <text x="256" y="415" font-family="system-ui, sans-serif" font-size="16" font-weight="600" letter-spacing="6" fill="#fef08a" text-anchor="middle">VINDHYA EVENTS</text>
  </g>
</svg>
`;

// 3. Badge Icon SVG (96x96 / 72x72) - High-contrast silhouette on transparent background
const badgeIconSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
  </defs>
  <!-- Transparent background for notification badge -->
  <g fill="url(#badgeGold)">
    <!-- Crown -->
    <path d="M48 14 L53 23 L62 18 L58 27 L48 25 L38 27 L34 18 L43 23 Z"/>
    <circle cx="48" cy="12" r="2"/>
    <circle cx="33" cy="16" r="1.5"/>
    <circle cx="63" cy="16" r="1.5"/>
    <!-- Heart & Rings Arch -->
    <path d="M22 66 C22 36, 74 36, 74 66" fill="none" stroke="url(#badgeGold)" stroke-width="3" stroke-linecap="round"/>
    <text x="48" y="58" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold" text-anchor="middle" fill="url(#badgeGold)">R</text>
    <circle cx="48" cy="74" r="3" fill="url(#badgeGold)"/>
  </g>
</svg>
`;

async function generate() {
  console.log('Generating PWA icons...');

  // 512x512 App Icon
  await sharp(Buffer.from(appIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));
  console.log('✓ icon-512x512.png generated');

  // 192x192 App Icon
  await sharp(Buffer.from(appIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));
  console.log('✓ icon-192x192.png generated');

  // 180x180 Apple Touch Icon
  await sharp(Buffer.from(appIconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png generated');

  // 512x512 Maskable Icon
  await sharp(Buffer.from(maskableIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));
  console.log('✓ icon-maskable-512x512.png generated');

  // 192x192 Maskable Icon
  await sharp(Buffer.from(maskableIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-192x192.png'));
  console.log('✓ icon-maskable-192x192.png generated');

  // 96x96 Badge Icon (User requested badge icon)
  await sharp(Buffer.from(badgeIconSvg))
    .resize(96, 96)
    .png()
    .toFile(path.join(iconsDir, 'badge-96x96.png'));
  console.log('✓ badge-96x96.png generated');

  // 72x72 Badge Icon
  await sharp(Buffer.from(badgeIconSvg))
    .resize(72, 72)
    .png()
    .toFile(path.join(iconsDir, 'badge-72x72.png'));
  console.log('✓ badge-72x72.png generated');

  // Save SVG source as well for vector crispness
  fs.writeFileSync(path.join(iconsDir, 'icon.svg'), appIconSvg);
  fs.writeFileSync(path.join(iconsDir, 'badge.svg'), badgeIconSvg);
  console.log('All PWA icons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
