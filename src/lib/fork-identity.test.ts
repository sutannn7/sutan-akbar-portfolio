import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Identity from the repository this portfolio was forked from. It must never
// reappear in the shipped source or public assets.
export const FORBIDDEN_FORK_IDENTITY = [
  /arfazrll/i,
  /arfazrllworkspace/i,
  /syahrilarfianalmazril/i,
];

// Two files are allowed to contain those words:
// - this file, which declares the patterns above
// - verify-build.test.ts, which uses the word as an intentional test fixture
export const ALLOWED_FORK_MENTIONS = [
  'src/lib/fork-identity.test.ts',
  'src/lib/verify-build.test.ts',
];

const SCANNED_EXTENSIONS = ['.ts', '.tsx', '.svg', '.json', '.md'];

function sourceFiles(dir: string, root: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full, root));
    else if (entry.isFile() && SCANNED_EXTENSIONS.some((ext) => full.endsWith(ext))) {
      out.push(full.slice(root.length + 1).split('\\').join('/'));
    }
  }
  return out;
}

describe('identitas fork', () => {
  it('tidak ada jejak identitas fork di src/ dan public/', () => {
    const root = process.cwd();
    const files = [
      ...sourceFiles(join(root, 'src'), root),
      ...sourceFiles(join(root, 'public'), root),
    ].filter((file) => !ALLOWED_FORK_MENTIONS.includes(file));

    const offenders: string[] = [];
    for (const file of files) {
      const content = readFileSync(join(root, file), 'utf8');
      for (const pattern of FORBIDDEN_FORK_IDENTITY) {
        if (pattern.test(content)) offenders.push(`${file}: ${pattern}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
