import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artsDir = path.join(__dirname, 'public', 'Arts');
const galleryPath = path.join(__dirname, 'public', 'gallery.json');

// Ensure directories exist safely
if (!fs.existsSync(artsDir)) {
  fs.mkdirSync(artsDir, { recursive: true });
}

const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.png', '.jpg', '.jpeg', '.png'];

try {
  const files = fs.readdirSync(artsDir);
  const gallery = [];
  
  function formatTitle(filename) {
    const nameWithoutExt = path.parse(filename).name;
    // Replace underscores/hyphens with space and nicely capitalize for visual breathing room
    return nameWithoutExt
      .replace(/[_-]+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // Sort files alphabetically to keep order predictable and elegant
  files.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  let index = 1;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ALLOWED_EXTS.includes(ext) && !file.startsWith('.')) {
      gallery.push({
        id: String(index++),
        title: formatTitle(file),
        description: "Obra de arte original",
        category: "Curated Art",
        src: `/Arts/${file}`
      });
    }
  }

  fs.writeFileSync(galleryPath, JSON.stringify(gallery, null, 2), 'utf-8');
  console.log(`[FrameLab System] Auto-registered ${gallery.length} artworks into public/gallery.json!`);
} catch (e) {
  console.error('[FrameLab System] Error auto-generating gallery database:', e);
}
