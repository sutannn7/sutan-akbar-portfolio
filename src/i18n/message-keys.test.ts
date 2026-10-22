import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import id from '../../messages/id.json';
import en from '../../messages/en.json';

// src/components/projects/ProjectPageContent.tsx — rewritten in Task 9; its section keys are added there.
const EXCLUDED = ['src/components/projects/ProjectPageContent.tsx'];

const root = process.cwd();

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (entry.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) {
      out.push(full.slice(root.length + 1).split('\\').join('/'));
    }
  }
  return out;
}

function flatKeys(o: any, prefix = ''): string[] {
  return Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatKeys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

const idKeys = new Set(flatKeys(id));
const enKeys = new Set(flatKeys(en));

// --- scan one file -----------------------------------------------------------

// const t = useTranslations('ns')  /  const t = await getTranslations('ns')
const BIND_PLAIN = /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\s*\(\s*(['"])(.*?)\2\s*\)/gs;
// const { t } = useTranslations('ns')
const BIND_DESTRUCT = /const\s*\{\s*([^}]*?)\s*\}\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\s*\(\s*(['"])(.*?)\2\s*\)/gs;
// const t = useTranslations()  (unscoped)
const BIND_NONE = /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?useTranslations\s*\(\s*\)/gs;
const BIND_NONE_DESTRUCT = /const\s*\{\s*([^}]*?)\s*\}\s*=\s*(?:await\s+)?useTranslations\s*\(\s*\)/gs;

const ARRAY_DECL = /^(?:const|let|var)\s+(\w+)\s*=\s*\[([^\]]*)\]\s*;?\s*$/gm;
const LITERAL = /^(['"])(.*?)\1$/;
const MAP_CALL = /(\w+)\s*\.\s*map\s*\(\s*\(([^)]*)\)\s*/gs;

function scanFile(path: string, content: string): string[] {
  const offenses: string[] = [];

  const bindings = new Map<string, Set<string | null>>(); // variable -> namespaces (null = unscoped)
  const bind = (name: string, ns: string | null) => {
    if (!bindings.has(name)) bindings.set(name, new Set());
    bindings.get(name)!.add(ns);
  };

  for (const m of content.matchAll(BIND_PLAIN)) bind(m[1], m[3]);
  for (const m of content.matchAll(BIND_DESTRUCT))
    for (const name of m[1].split(',').map((s) => s.trim()).filter(Boolean)) bind(name, m[3]);
  for (const m of content.matchAll(BIND_NONE)) bind(m[1], null);
  for (const m of content.matchAll(BIND_NONE_DESTRUCT))
    for (const name of m[1].split(',').map((s) => s.trim()).filter(Boolean)) bind(name, null);

  // module-level arrays of string literals, e.g. const marqueeKeys = ['0',..'5']
  const moduleArrays = new Map<string, string[]>();
  for (const m of content.matchAll(ARRAY_DECL)) {
    const values = m[2].split(',').map((s) => s.trim()).filter(Boolean);
    const literals = values.map((v) => { const mm = LITERAL.exec(v); return mm ? mm[2] : null; });
    if (literals.every((v) => v !== null)) moduleArrays.set(m[1], literals as string[]);
  }

  // loop variables bound to iteration over a module-level string array:
  //   marqueeKeys.map((key, i) => ...)  ->  key -> marqueeKeys
  const loopVar = new Map<string, string>();
  for (const m of content.matchAll(MAP_CALL)) {
    const arrayName = m[1];
    const params = m[2].split(',').map((s) => s.trim()).filter(Boolean);
    for (const p of params) loopVar.set(p, arrayName);
  }

  const resolve = (name: string, key: string): string[] => {
    const nsSet = bindings.get(name);
    if (!nsSet) return [];
    return [...nsSet].map((ns) => (ns === null ? key : `${ns}.${key}`));
  };

  const present = (path: string) => idKeys.has(path) && enKeys.has(path);

  for (const [name, nsSet] of bindings) {
    if (!nsSet) continue;
    const callRe = new RegExp(`\\b${name}\\s*(\\.\\s*rich)?\\s*\\(\\s*(['\"])(.*?)\\2\\s*\\)`, 'gs');
    for (const m of content.matchAll(callRe)) {
      const key = m[3];
      const attempted = resolve(name, key);
      if (attempted.some(present)) continue;
      offenses.push(`${path}: ${name}('${key}') -> ${attempted.join(' | ') || '(unbound)'} missing in messages/id.json and messages/en.json`);
    }
    // variable keys: t(ident) where ident iterates a module-level string array
    const varCallRe = new RegExp(`\\b${name}\\s*(\\.\\s*rich)?\\s*\\(\\s*([A-Za-z$_][\w$]*)\\s*\\)`, 'gs');
    for (const m of content.matchAll(varCallRe)) {
      const ident = m[2];
      const arrayName = loopVar.get(ident);
      if (!arrayName) continue;
      const literals = moduleArrays.get(arrayName);
      if (!literals) continue;
      for (const lit of literals) {
        const attempted = resolve(name, lit);
        if (attempted.some(present)) continue;
        offenses.push(`${path}: ${name}('${ident}') via module array ${arrayName} -> ${attempted.join(' | ')} missing in messages/id.json and messages/en.json`);
      }
    }
  }

  return offenses;
}

describe('message-keys', () => {
  it('every statically resolvable t(...) call exists in both message files', () => {
    const files = sourceFiles(join(root, 'src')).sort().filter((f) => !EXCLUDED.includes(f));

    const offenses: string[] = [];
    for (const file of files) {
      const full = join(root, file);
      const content = readFileSync(full, 'utf8');
      offenses.push(...scanFile(file, content));
    }

    if (offenses.length) {
      console.log('MESSAGE-KEY OFFENSES:');
      for (const o of offenses) console.log('  ' + o);
    }
    expect(offenses).toEqual([]);
  });
});
