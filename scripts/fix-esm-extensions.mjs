import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = new URL('../dist/esm', import.meta.url).pathname;

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.js')) fix(full);
  }
};

const REL = /(from\s+['"]|import\s*\(\s*['"])(\.{1,2}\/[^'"]+)(['"])/g;

const fix = (file) => {
  const src = readFileSync(file, 'utf8');
  const out = src.replace(REL, (_m, pre, spec, post) => {
    if (spec.endsWith('.js') || spec.endsWith('.mjs') || spec.endsWith('.json')) return `${pre}${spec}${post}`;
    const abs = resolve(dirname(file), spec);
    if (existsSync(abs) && statSync(abs).isDirectory()) return `${pre}${spec}/index.js${post}`;
    return `${pre}${spec}.js${post}`;
  });
  if (out !== src) writeFileSync(file, out);
};

walk(ROOT);
