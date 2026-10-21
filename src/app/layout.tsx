import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display, Alex_Brush } from 'next/font/google';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider, I18nProvider, SmoothScrollProvider } from '@/providers';

import '@/styles/globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const signature = Alex_Brush({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-signature',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Sutan Akbar — Frontend Engineer',
        template: '%s | Sutan Akbar',
    },
    description: 'Frontend Engineer dari Palembang. Antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.',
    keywords: ['frontend engineer', 'react', 'nextjs', 'tailwind', 'palembang'],
    authors: [{ name: 'Sutan Akbar Dwi Nugraha' }],
    creator: 'Sutan Akbar Dwi Nugraha',
    metadataBase: new URL('https://sutan-akbar.vercel.app'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://sutan-akbar.vercel.app',
        title: 'Sutan Akbar — Frontend Engineer',
        description: 'Frontend Engineer dari Palembang. Antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.',
        siteName: 'Sutan Akbar',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sutan Akbar — Frontend Engineer',
        description: 'Frontend Engineer dari Palembang. Antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.',
        creator: '@sutannn7',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.svg',
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#FAFAFB' },
        { media: '(prefers-color-scheme: dark)', color: '#08080C' },
    ],
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
};

import { ThemeAwareClickSpark } from '@/components/ui/ThemeAwareClickSpark';
import { ConditionalNavigation } from '@/components/layout/ConditionalNavigation';
import { ArcPreloaderWrapper } from '@/components/layout/ArcPreloaderWrapper';
import { ChatBot } from '@/components/layout/ChatBot';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} ${signature.variable} font-sans relative`}>
                <ThemeProvider>
                    <I18nProvider locale={locale} messages={messages}>
                        <SmoothScrollProvider>
                            <ThemeAwareClickSpark>
                                <ArcPreloaderWrapper>
                                    <ConditionalNavigation>
                                        {children}
                                    </ConditionalNavigation>
                                </ArcPreloaderWrapper>
                                <ChatBot headless />
                            </ThemeAwareClickSpark>
                        </SmoothScrollProvider>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
