import { defaultLocale, locales } from './config.js';
import esTranslations from './locales/es.json';
import enTranslations from './locales/en.json';
import ptTranslations from './locales/pt.json';

const translations = {
  es: esTranslations,
  en: enTranslations,
  pt: ptTranslations,
};

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

export function getTranslations(locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale];
}

export function t(key, locale = defaultLocale) {
  const localeTranslations =
    translations[locale] || translations[defaultLocale];
  return localeTranslations[key] || key;
}
