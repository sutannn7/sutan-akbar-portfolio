import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { findUnreachable, resolveImport } from '../../scripts/find-unreachable.mjs';

const root = path.resolve('repo');
const srcRoot = path.join(root, 'src');
const importer = path.join(srcRoot, 'app', 'page.tsx');

function fileSet(...relativePaths: string[]) {
  return new Set(relativePaths.map((file) => path.normalize(path.join(root, file))));
}

describe('resolveImport', () => {
  it('resolves @/ aliases to src/ using native path separators', () => {
    const files = fileSet('src/components/ui/button.tsx');

    expect(resolveImport('@/components/ui/button', importer, srcRoot, files)).toBe(
      path.normalize(path.join(root, 'src/components/ui/button.tsx')),
    );
  });

  it('resolves relative imports against the importing file', () => {
    const files = fileSet('src/app/foo.tsx');

    expect(resolveImport('./foo', importer, srcRoot, files)).toBe(
      path.normalize(path.join(root, 'src/app/foo.tsx')),
    );
  });

  it('resolves a directory to its index.ts', () => {
    const files = fileSet('src/app/sections/index.ts');

    expect(resolveImport('./sections', importer, srcRoot, files)).toBe(
      path.normalize(path.join(root, 'src/app/sections/index.ts')),
    );
  });

  it('ignores bare package imports', () => {
    expect(resolveImport('react', importer, srcRoot, fileSet())).toBeNull();
  });
});

describe('findUnreachable', () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const tempRoot of tempRoots.splice(0)) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('walks entries, static imports, dynamic imports and proxy imports', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'find-unreachable-'));
    tempRoots.push(tempRoot);

    const write = (relativePath: string, contents: string) => {
      const file = path.join(tempRoot, relativePath);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, contents);
    };

    write('src/app/page.tsx', "import { used } from '@/lib/used';\nconst lazy = import('@/lib/lazy');\n");
    write('src/lib/used.ts', 'export const used = 1;\n');
    write('src/lib/lazy.ts', 'export const lazy = 1;\n');
    write('src/proxy.ts', "import { helper } from './lib/helper';\n");
    write('src/lib/helper.ts', 'export const helper = 1;\n');
    write('src/lib/orphan.ts', 'export const orphan = 1;\n');

    const result = findUnreachable(tempRoot);

    expect(result.reachable).toEqual(
      [
        'src/app/page.tsx',
        'src/lib/helper.ts',
        'src/lib/lazy.ts',
        'src/lib/used.ts',
        'src/proxy.ts',
      ].map((file) => path.normalize(path.join(tempRoot, file))),
    );
    expect(result.unreachable).toEqual([path.normalize(path.join(tempRoot, 'src/lib/orphan.ts'))]);
  });
});
