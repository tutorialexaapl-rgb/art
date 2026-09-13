import { readdir, stat } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const SIZE_THRESHOLD = 300 * 1024; // 300 KB
const MAX_WIDTH = 1920;
const QUALITY = 80;

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) return null;

  const s = await stat(filePath);
  if (s.size < SIZE_THRESHOLD) return null;

  const originalSize = s.size;
  const relPath = relative(publicDir, filePath);

  let image = sharp(filePath, { failOn: 'none' });
  const metadata = await image.metadata();

  if (metadata.width && metadata.width > MAX_WIDTH) {
    image = image.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === '.png') {
    await image.png({ quality: QUALITY, compressionLevel: 9, effort: 10 }).toFile(filePath + '.tmp');
  } else if (ext === '.jpg' || ext === '.jpeg') {
    await image.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(filePath + '.tmp');
  } else if (ext === '.webp') {
    await image.webp({ quality: QUALITY }).toFile(filePath + '.tmp');
  }

  const { rename } = await import('node:fs/promises');
  await rename(filePath + '.tmp', filePath);

  const newSize = (await stat(filePath)).size;
  return { relPath, originalSize, newSize };
}

async function main() {
  console.log('[optimize-images] Skanowanie folderu public/...');
  let totalOriginal = 0;
  let totalNew = 0;
  let processed = 0;

  for await (const filePath of walk(publicDir)) {
    const result = await optimizeImage(filePath);
    if (result) {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      processed++;
      console.log(
        `[optimize-images] ${result.relPath}: ${formatBytes(result.originalSize)} -> ${formatBytes(result.newSize)}`
      );
    }
  }

  if (processed === 0) {
    console.log('[optimize-images] Wszystkie obrazy już zoptymalizowane — brak plików do przetworzenia.');
  } else {
    const saved = totalOriginal - totalNew;
    const pct = ((saved / totalOriginal) * 100).toFixed(1);
    console.log(
      `[optimize-images] Podsumowanie: ${processed} plików, ${formatBytes(totalOriginal)} -> ${formatBytes(totalNew)}, oszczędność ${formatBytes(saved)} (${pct}%)`
    );
  }
}

main().catch((err) => {
  console.error('[optimize-images] Błąd:', err);
  process.exit(1);
});
