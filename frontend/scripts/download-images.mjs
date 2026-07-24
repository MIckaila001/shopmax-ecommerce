/**
 * Script pour telecharger toutes les images Unsplash en local.
 * Version amelioree avec timeout long et reprise sur erreur.
 *
 * Usage: node scripts/download-images.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "..", "public", "images");

// Liste des images a telecharger
// (nom local) -> (URL Unsplash)
const IMAGES = {
  // Hero
  "hero/main.jpg":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",

  // Categories
  "categories/electronique.jpg":
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80",
  "categories/mode-homme.jpg":
    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80",
  "categories/mode-femme.jpg":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "categories/maison-cuisine.jpg":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "categories/beaute-sante.jpg":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
  "categories/sport-loisirs.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",

  // Produits
  "products/iphone-15-pro.jpg":
    "https://images.unsplash.com/photo-1592286927505-1def25115558?w=600&q=80",
  "products/samsung-s24-ultra.jpg":
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
  "products/xiaomi-14-pro.jpg":
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  "products/sony-wh1000xm5.jpg":
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
  "products/airpods-pro-2.jpg":
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80",
  "products/sac-a-dos.jpg":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  "products/galaxy-watch-6.jpg":
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
  "products/nike-air-max-plus.jpg":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "products/veste-cuir.jpg":
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  "products/adidas-ultraboost.jpg":
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
};

/**
 * Telecharge une image avec timeout long (30s) et retry
 */
function downloadImage(url, dest, retries = 3) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;

    const request = protocol.get(
      url,
      {
        timeout: 30000, // 30 secondes (au lieu de 3)
        headers: {
          "User-Agent": "Mozilla/5.0 (ShopMax Image Downloader)",
        },
      },
      (response) => {
        // Suivre les redirections
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          return downloadImage(response.headers.location, dest, retries - 1)
            .then(resolve)
            .catch(reject);
        }

        if (response.statusCode !== 200) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          return reject(new Error(`HTTP ${response.statusCode}`));
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });
      }
    );

    request.on("timeout", () => {
      request.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(new Error("Timeout (30s)"));
    });

    request.on("error", (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

/**
 * Main avec retry global
 */
async function main() {
  console.log("===========================================");
  console.log("   Telechargement des images ShopMax");
  console.log("===========================================");
  console.log();
  console.log("Dossier destination :");
  console.log("  " + PUBLIC_DIR);
  console.log();
  console.log("Nombre d'images : " + Object.keys(IMAGES).length);
  console.log();

  // Cree le dossier public/images
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const entries = Object.entries(IMAGES);
  let success = 0;
  let failed = 0;
  const failedList = [];

  for (let i = 0; i < entries.length; i++) {
    const [filename, url] = entries[i];
    const dest = path.join(PUBLIC_DIR, filename);
    const shortName = filename.padEnd(35);
    const progress = `[${i + 1}/${entries.length}]`;

    try {
      process.stdout.write(`  ${progress} ${shortName} ... `);
      await downloadImage(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`OK (${Math.round(size / 1024)} KB)`);
      success++;
    } catch (err) {
      console.log(`ERREUR (${err.message})`);
      failed++;
      failedList.push(filename);

      // Retry une fois apres 2s
      if (failedList.length <= 3) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          process.stdout.write(`         (nouvelle tentative) ... `);
          await downloadImage(url, dest);
          const size = fs.statSync(dest).size;
          console.log(`OK (${Math.round(size / 1024)} KB)`);
          success++;
          failed--;
          failedList.pop();
        } catch (err2) {
          console.log(`ERREUR (${err2.message})`);
        }
      }
    }
  }

  console.log();
  console.log("===========================================");
  console.log(`   Resultat : ${success} OK, ${failed} ERREUR`);
  console.log("===========================================");

  if (failed > 0) {
    console.log();
    console.log("Images non telechargees :");
    failedList.forEach((f) => console.log("  - " + f));
    console.log();
    console.log("Solutions :");
    console.log("  1. Verifiez votre connexion internet");
    console.log("  2. Reessayez : node scripts/download-images.mjs");
    console.log("  3. Utilisez un VPN si Unsplash est bloque");
    console.log("     (le site fonctionne avec les SVG en attendant)");
  } else {
    console.log();
    console.log("Toutes les images sont pretes !");
    console.log("Relancez start-dev.bat pour les voir.");
  }
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
