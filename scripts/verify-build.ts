import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findForbidden, isTextFile, parseForbidden } from '../src/lib/verify-build.ts';

const forbidden = parseForbidden(process.argv.slice(2));

const serverDir = '.next/server/app';
if (!existsSync(serverDir)) {
  console.log('no build output - jalankan npm run build dulu');
  process.exit(0);
}

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

const files = [serverDir, '.next/static'].filter(existsSync).flatMap(listFiles);
let failed = false;

for (const file of files) {
  if (!isTextFile(file)) continue;
  let text: string;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  for (const match of findForbidden(text, forbidden)) {
    console.error(`${file}: ${match}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('no forbidden strings found');
