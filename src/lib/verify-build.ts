export function findForbidden(text: string, forbidden: string[]): string[] {
  const lower = text.toLowerCase();
  return forbidden.filter((f) => lower.includes(f.toLowerCase()));
}
