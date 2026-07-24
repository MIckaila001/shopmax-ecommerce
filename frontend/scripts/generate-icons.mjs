/**
 * Genere toutes les icones PWA a partir d'un SVG
 * Usage: node scripts/generate-icons.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ICONS_DIR = path.join(__dirname, "..", "public", "icons");
const SCREENSHOTS_DIR = path.join(__dirname, "..", "public", "screenshots");

// SVG de l'icone ShopMax (logo + texte)
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5B400"/>
      <stop offset="100%" stop-color="#D49E00"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#g)"/>
  <text x="256" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="200" font-weight="900" fill="#0A0A0A" text-anchor="middle">SM</text>
</svg>`;

const SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

function generateIcon(size) {
  // SVG simple base64 (sans sharp pour eviter les deps)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="100" fill="#F5B400"/>
    <text x="256" y="320" font-family="system-ui, sans-serif" font-size="200" font-weight="900" fill="#0A0A0A" text-anchor="middle">SM</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function main() {
  console.log("===========================================");
  console.log("   Generation des icones PWA");
  console.log("===========================================");
  console.log();

  // Creer le dossier
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // Sauvegarder le SVG source
  fs.writeFileSync(path.join(ICONS_DIR, "icon.svg"), ICON_SVG);
  console.log("[OK] icon.svg sauvegarde");

  // Pour chaque taille, creer un fichier SVG (les navigateurs modernes acceptent SVG)
  // En production, tu devrais convertir en PNG avec sharp ou un outil tiers
  for (const size of SIZES) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="100" fill="#F5B400"/>
      <text x="256" y="320" font-family="system-ui, sans-serif" font-size="200" font-weight="900" fill="#0A0A0A" text-anchor="middle">SM</text>
    </svg>`;
    fs.writeFileSync(path.join(ICONS_DIR, `icon-${size}x${size}.svg`), svg);
  }
  console.log(`[OK] ${SIZES.length} icones SVG creees dans public/icons/`);
  console.log();
  console.log("NOTE : Pour la production, convertis les SVG en PNG avec :");
  console.log("  - https://www.pwabuilder.com/imageGenerator");
  console.log("  - ou npm install sharp && node scripts/convert-to-png.mjs");
}

main();
