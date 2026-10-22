export interface Repo {
  name: string;
  description: string;
  htmlUrl: string;
  stargazersCount: number;
  language: string | null;
  pushedAt: string;
}

export async function fetchRepos(username: string): Promise<{ repos: Repo[]; failed: boolean }> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return { repos: [], failed: true };
    const raw = (await res.json()) as any[];
    return {
      failed: false,
      // Repo tanpa isi bukan proyek: buang yang ukurannya 0.
      repos: raw
        .filter((r) => (r.size ?? 0) > 0)
        .slice(0, 6)
        .map((r) => ({
        name: r.name,
        description: r.description ?? '',
        htmlUrl: r.html_url,
        stargazersCount: r.stargazers_count ?? 0,
        language: r.language ?? null,
        pushedAt: r.pushed_at,
      })),
    };
  } catch {
    return { repos: [], failed: true };
  }
}
