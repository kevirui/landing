import { defaultLocale, locales } from './config.js';

export function getLocaleFromPath(pathname) {
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const segments = pathname.split('/');
    return segments[1];
  }

  return defaultLocale;
}

export function removeLocaleFromPath(pathname, locale) {
  if (pathname.startsWith(`/${locale}`)) {
    return pathname.replace(`/${locale}`, '') || '/';
  }
  return pathname;
}
