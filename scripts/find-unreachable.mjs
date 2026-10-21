import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IMPORT_RE = /(?:from\s+|import\s*\(|require\s*\(|import\s+)['"]([^'"]+)['"]/g;

export function collectSourceFiles(srcRoot) {
  const files = [];

  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(path.normalize(entryPath));
      }
    }
  };

  walk(srcRoot);
  return files.sort();
}

export function resolveImport(specifier, importer, srcRoot, files) {
  let target;

  if (specifier.startsWith('@/')) {
    target = path.join(srcRoot, specifier.slice(2));
  } else if (specifier.startsWith('.')) {
    target = path.resolve(path.dirname(importer), specifier);
  } else {
    return null;
  }

  const candidates = [
    target,
    ...EXTENSIONS.map((extension) => target + extension),
    path.join(target, 'index.ts'),
    path.join(target, 'index.tsx'),
  ];

  return candidates.find((candidate) => files.has(path.normalize(candidate))) ?? null;
}

export function findUnreachable(root) {
  const srcRoot = path.join(root, 'src');
  const allFiles = collectSourceFiles(srcRoot);
  const files = new Set(allFiles);
  const entries = allFiles.filter(
    (file) => file === path.join(srcRoot, 'proxy.ts') || file.startsWith(path.join(srcRoot, 'app') + path.sep),
  );

  const reached = new Set(entries);
  const queue = [...entries];

  while (queue.length > 0) {
    const file = queue.shift();
    const contents = fs.readFileSync(file, 'utf8');

    for (const match of contents.matchAll(IMPORT_RE)) {
      const resolved = resolveImport(match[1], file, srcRoot, files);
      if (resolved && !reached.has(resolved)) {
        reached.add(resolved);
        queue.push(resolved);
      }
    }
  }

  return {
    reachable: allFiles.filter((file) => reached.has(file)),
    unreachable: allFiles.filter((file) => !reached.has(file)),
  };
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { reachable, unreachable } = findUnreachable(root);
  const toDisplayPath = (file) => path.relative(root, file).split(path.sep).join('/');

  console.log(`Total files: ${reachable.length + unreachable.length}`);
  console.log(`Reachable: ${reachable.length}`);
  console.log(`Unreachable: ${unreachable.length}`);
  console.log('\nUnreachable files:');
  for (const file of unreachable) {
    console.log(`  ${toDisplayPath(file)}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
