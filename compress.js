const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR  = './images';
const OUTPUT_DIR = './images-compressed';
const QUALITY    = 92;
const MAX_WIDTH  = 1800;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const files = fs.readdirSync(INPUT_DIR).filter(f =>
  /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(f)
);

console.log(`\nFound ${files.length} images. Compressing...\n`);

let done = 0;

files.forEach(file => {
  const inputPath  = path.join(INPUT_DIR, file);
  const nameNoExt  = path.parse(file).name;
  const outputPath = path.join(OUTPUT_DIR, nameNoExt + '.webp');

  sharp(inputPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outputPath)
    .then(info => {
      const originalSize  = (fs.statSync(inputPath).size  / 1024).toFixed(0);
      const compressedSize = (info.size / 1024).toFixed(0);
      const saving = (((originalSize - compressedSize) / originalSize) * 100).toFixed(0);
      console.log(`✓ ${file.padEnd(35)} ${originalSize}KB → ${compressedSize}KB  (${saving}% smaller)`);
      done++;
      if (done === files.length) {
        console.log(`\nDone. Compressed images saved to /${OUTPUT_DIR}`);
      }
    })
    .catch(err => console.error(`✗ ${file}: ${err.message}`));
});