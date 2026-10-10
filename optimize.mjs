import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'public', 'images', 'custom-gallery');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    if (file.match(/\.(png|jpe?g)$/i)) {
      const inputPath = path.join(inputDir, file);
      const outputName = file.replace(/\.[^/.]+$/, "") + ".webp";
      const outputPath = path.join(outputDir, outputName);
      
      console.log(`Optimizing ${file}...`);
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Saved ${outputName}`);
    }
  }
}

optimizeImages().catch(console.error);
