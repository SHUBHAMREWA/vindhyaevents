const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');
const faviconPath = path.join(rootDir, 'src', 'app', 'favicon.ico');
const sourcePath = path.join(__dirname, 'assets', 'riwaj-logo-source.jpg');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Badge Icon SVG (96x96 / 72x72) - High-contrast silhouette on transparent background
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

// Cuts the round logo out of its square photo background.
async function buildRoundLogo() {
  const { width } = await sharp(sourcePath).metadata();
  const center = width / 2;
  const mask = Buffer.from(
    `<svg width="${width}" height="${width}"><circle cx="${center}" cy="${center}" r="${center - 2}" fill="#fff"/></svg>`
  );
  return sharp(sourcePath)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

// Burgundy taken from the logo itself, for icons that must be fully opaque.
async function sampleLogoBackground() {
  const { data } = await sharp(sourcePath)
    .extract({ left: 500, top: 150, width: 80, height: 40 })
    .resize(1, 1)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2], alpha: 1 };
}

function resizeLogo(logo, size) {
  return sharp(logo)
    .resize(size, size, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5 })
    .png({ compressionLevel: 9 });
}

// Square opaque icon with the logo centered, filling `scale` of the width.
async function buildOpaqueIcon(logo, background, size, scale) {
  const logoSize = Math.round(size * scale);
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: await resizeLogo(logo, logoSize).toBuffer() }])
    .png({ compressionLevel: 9 });
}

// An ICO file is a small directory header followed by embedded PNG images.
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

async function generate() {
  console.log('Generating logo, favicon and PWA icons...');

  const logo = await buildRoundLogo();
  const background = await sampleLogoBackground();

  // Site logo used in the navbar and footer
  await resizeLogo(logo, 256).toFile(path.join(publicDir, 'riwaj-logo.png'));
  console.log('✓ riwaj-logo.png generated');

  // Favicon
  const faviconImages = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      size,
      data: await resizeLogo(logo, size).toBuffer(),
    }))
  );
  fs.writeFileSync(faviconPath, buildIco(faviconImages));
  console.log('✓ favicon.ico generated');

  // App icons with transparent corners
  for (const size of [192, 512]) {
    await resizeLogo(logo, size).toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`✓ icon-${size}x${size}.png generated`);
  }

  // Apple touch icon: iOS paints transparency black, so it must be opaque
  const appleIcon = await buildOpaqueIcon(logo, background, 180, 0.94);
  await appleIcon.toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png generated');

  // Maskable icons: the logo stays inside the central 80% safe zone
  for (const size of [192, 512]) {
    const maskableIcon = await buildOpaqueIcon(logo, background, size, 0.8);
    await maskableIcon.toFile(path.join(iconsDir, `icon-maskable-${size}x${size}.png`));
    console.log(`✓ icon-maskable-${size}x${size}.png generated`);
  }

  // Notification badges
  for (const size of [96, 72]) {
    await sharp(Buffer.from(badgeIconSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `badge-${size}x${size}.png`));
    console.log(`✓ badge-${size}x${size}.png generated`);
  }

  fs.writeFileSync(path.join(iconsDir, 'badge.svg'), badgeIconSvg);
  console.log('All icons generated successfully!');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
