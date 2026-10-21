import { getRequestConfig } from 'next-intl/server';
import { resolveLocale } from '@/lib/locale';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const locale = resolveLocale(cookieStore.get('locale')?.value);

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
        timeZone: 'Asia/Jakarta'
    };
});
