import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { Locale } from '@/lib/locale';

export default async function AboutPage() {
    const locale = (await getLocale()) as Locale;
    const t = await getTranslations('about');
    const { bio, links, location } = portfolioData.personal;

    return (
        <main className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-24">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                {t('leadIn.aboutMe')}
            </h1>

            <section className="mb-12">
                {bio[locale].split('\n\n').map((paragraph, i) => (
                    <p key={i} className="leading-relaxed text-muted-foreground mb-6 text-lg md:text-xl">
                        {paragraph}
                    </p>
                ))}
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-foreground mb-4">{t('contact.hero.title')}</h2>
                <ul className="flex flex-col gap-3">
                    {links.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.url}
                                target={link.url.startsWith('http') ? '_blank' : undefined}
                                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-primary hover:underline transition-colors"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-foreground mb-4">Lokasi</h2>
                <a
                    href={`https://www.google.com/maps/place/${encodeURIComponent(location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline transition-colors"
                >
                    {location}
                </a>
            </section>
        </main>
    );
}
