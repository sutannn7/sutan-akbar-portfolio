import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { fetchRepos } from '@/lib/github';
import { formatDate } from '@/lib/utils';

export default async function GitHubRepos() {
  const t = await getTranslations('projects');
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'sutannn7';
  const { repos, failed } = await fetchRepos(username);

  // Jaringan mati atau GitHub tidak merespons: jangan pernah render section kosong.
  if (failed || repos.length === 0) {
    return (
      <section id="github" className="relative py-20 lg:py-32 bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('githubRepos')}</h2>
          <p className="text-muted-foreground mb-8">{t('githubUnavailable')}</p>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-accent/50 transition"
          >
            {t('viewProfile')}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="github" className="relative py-20 lg:py-32 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('githubRepos')}</h2>
        <p className="text-muted-foreground mb-12">
          Repositori yang paling diperbarui.{' '}
          <a
            href={`https://github.com/${username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Lihat semua di GitHub →
          </a>
        </p>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <li key={repo.name} className="border rounded-xl p-6 bg-card text-card-foreground">
              <h3 className="text-lg font-bold mb-1">
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.name}
                </a>
              </h3>
              {repo.description && (
                <p className="text-sm text-muted-foreground mb-4">{repo.description}</p>
              )}
              <div className="flex flex-wrap gap-2 text-xs mb-4">
                {repo.language && (
                  <span className="border border-border/50 px-2 py-0.5 rounded">{repo.language}</span>
                )}
                <span className="border border-border/50 px-2 py-0.5 rounded">{formatDate(repo.pushedAt)}</span>
                <span className="ml-auto font-mono text-primary">{repo.stargazersCount}★</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
