const TEXT_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.txt', '.map', '.rsc', '.meta']);

export function isTextFile(file: string): boolean {
  const dot = file.lastIndexOf('.');
  return dot !== -1 && TEXT_EXTENSIONS.has(file.slice(dot).toLowerCase());
}

export function parseForbidden(args: string[]): string[] {
  return args
    .filter((arg) => arg.startsWith('--forbidden='))
    .map((arg) => arg.slice('--forbidden='.length))
    .filter((value) => value !== '');
}

export function findForbidden(text: string, forbidden: string[]): string[] {
  const lower = text.toLowerCase();
  return forbidden.filter((f) => lower.includes(f.toLowerCase()));
}
