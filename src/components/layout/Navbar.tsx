'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { usePreloadState } from '@/components/ui/arc-preloader-hero';
import { NAV_ITEMS } from '@/data/navigation';

function Clock() {
    const [time, setTime] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            setTime(`${h}:${m}:${s}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <span className="font-mono text-xl md:text-2xl font-black opacity-0">00:00:00</span>;

    return (
        <span className="font-mono text-xl md:text-2xl font-black text-gradient tracking-widest hover:tracking-[0.2em] transition-all duration-300">
            {time}
        </span>
    );
}

export function Navbar() {
    const t = useTranslations('navigation');
    const locale = useLocale();
    const { resolvedTheme } = useTheme();
    const pathname = usePathname();
    const { scrollY } = useScroll();

    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Consume preload state directly from context
    const { isPreloading: isPreloadActive } = usePreloadState();

    const isDark = resolvedTheme === 'dark';

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        if (isMenuOpen) return; // Don't hide navbar when menu is open

        const direction = latest > lastScrollY ? 'down' : 'up';
        setIsScrolled(latest > 50);

        if (direction === 'down' && latest > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        setLastScrollY(latest);
    });

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    // Tulis cookie locale (hanya write — baca locale lewat useLocale / i18n provider,
    // jangan pernah baca document.cookie langsung) lalu me-refresh agar SSR ambil nilai baru.
    const toggleLocale = useCallback(() => {
        const nextLocale = locale === 'id' ? 'en' : 'id';
        document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
        window.location.reload();
    }, [locale]);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleHomeClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        closeMenu();
    }, [pathname, closeMenu]);

    const navLinks = NAV_ITEMS.filter((item) => item.href !== '/contact');

    // Animation variants
    const navVariants = {
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
    };

    const menuVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const linkClass = (href: string) =>
        cn(
            'relative px-5 py-2 text-sm font-bold transition-all duration-300 rounded-full group',
            pathname === href ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'
        );

    return (
        <>
            <motion.nav
                variants={navVariants}
                initial="hidden"
                animate={!isPreloadActive && (isVisible || isMenuOpen) ? 'visible' : 'hidden'}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed top-0 left-0 right-0 z-[100]"
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-4 md:py-6">
                    <motion.div
                        className={cn(
                            'flex items-center justify-between transition-all duration-500 rounded-full',
                            isScrolled ? 'glass-strong px-6 py-3' : 'py-2'
                        )}
                        layout
                    >
                        {/* Make the Clock a Link to Home */}
                        <Link href="/" className="relative group min-w-[120px]" onClick={handleHomeClick}>
                            <Clock />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleHomeClick}
                                    className={linkClass(item.href)}
                                >
                                    <span className="relative z-10">{t(item.labelKey)}</span>
                                </Link>
                            ))}

                            {/* CTA kanan: mari terhubung → kontak */}
                            <Link
                                href="/contact"
                                onClick={handleHomeClick}
                                className={cn(
                                    'relative px-5 py-2 text-sm font-bold transition-all duration-300 rounded-full group',
                                    pathname === '/contact' ? 'text-foreground bg-muted' : 'text-[#D1FF4D] border border-[#D1FF4D]/50 hover:border-[#D1FF4D] hover:text-[#D1FF4D]'
                                )}
                            >
                                <span className="relative z-10">{t('contact')}</span>
                            </Link>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleLocale}
                                className="p-2 md:p-2.5 rounded-full bg-muted/80 hover:bg-muted transition-colors flex items-center gap-2"
                                aria-label="Toggle language"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-xs md:text-sm font-medium">
                                    {locale === 'id' ? t('languageEn') : t('languageId')}
                                </span>
                            </motion.button>

                            {mounted && <AnimatedThemeToggler />}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMenu}
                                className="p-2 md:p-2.5 rounded-full bg-muted/80 hover:bg-muted transition-colors lg:hidden"
                                aria-label="Toggle menu"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={isMenuOpen ? 'close' : 'menu'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[90] lg:hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-background"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        <div className="relative flex flex-col items-center justify-center h-full overflow-y-auto py-20">
                            <nav className="flex flex-col items-center gap-6">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={item.href === '/' ? handleHomeClick : closeMenu}
                                        className={cn(
                                            'text-3xl font-bold text-muted-foreground hover:text-foreground transition-colors',
                                            pathname === item.href ? 'text-foreground' : ''
                                        )}
                                    >
                                        {t(item.labelKey)}
                                    </Link>
                                ))}
                            </nav>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-4 mt-12"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleLocale}
                                    className="px-6 py-3 rounded-full glass-card text-sm font-medium hover:bg-muted/50 transition-colors flex items-center gap-2"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>
                                        {locale === 'id' ? t('languageEn') : t('languageId')}
                                    </span>
                                </motion.button>
                                {mounted && (
                                    <AnimatedThemeToggler
                                        className="px-6 py-6 glass-card text-sm font-medium hover:bg-muted/50 flex items-center gap-2"
                                    />
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
