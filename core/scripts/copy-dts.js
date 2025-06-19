import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const typesDir = join(__dirname, '../dist/types');
const distDir = join(__dirname, '../dist');

function createIndexDts(subdir) {
  const refDir = `../types/${subdir}/index.js`;
  const destDir = join(distDir, subdir);
  const dest = join(destDir, 'index.d.ts');
  if (!existsSync(dest)) {
    mkdirSync(destDir, { recursive: true });
    writeFileSync(dest, `export * from '${refDir}';`);
    console.log(`Created ${dest}`);
  }
  // Create root typings file
  const typings = join(distDir, 'index.d.ts');
  if (!existsSync(typings)){
    writeFileSync(typings, "export * from './types/index.js';");
    console.log(`Created ${typings}`);
  }
}

// List your subpaths here:
['Utils', 'Diagnostics', 'Dom', 'Parser'].forEach(createIndexDts);