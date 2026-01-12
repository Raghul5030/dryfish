import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'public', 'Fresh Fish');
const outputDir = path.join(__dirname, 'public', 'Fresh Fish', 'optimized');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading input directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.match(/\.(png|jpg|jpeg)$/i)) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));

            sharp(inputPath)
                .resize(800) // Resize to max width 800px (maintain aspect ratio)
                .webp({ quality: 80 }) // Convert to WebP with 80% quality
                .toFile(outputPath)
                .then(info => {
                    console.log(`Optimized: ${file} -> ${path.basename(outputPath)} (${info.size} bytes)`);
                })
                .catch(err => {
                    console.error(`Error processing ${file}:`, err);
                });
        }
    });
});
