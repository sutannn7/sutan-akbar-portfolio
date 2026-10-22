import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Slot foto profil. Kalau file-nya belum ada, tampilkan monogram inisial
 * (bukan gambar tiruan) supaya halaman tetap utuh.
 */
export function ProfileAvatar({
  src,
  name,
  className = 'h-24 w-24',
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  const fileExists = src ? existsSync(join(process.cwd(), 'public', src)) : false;

  if (!fileExists) {
    return (
      <div
        className={`flex ${className} items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-2xl font-bold text-primary`}
        aria-hidden="true"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${className} rounded-full border border-border object-cover`}
    />
  );
}
