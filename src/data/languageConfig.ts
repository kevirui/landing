import type { Language } from '@custom-types/index';

export const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'pt'];

export const STATIC_PATHS = SUPPORTED_LANGUAGES.map(lang => ({
  params: { lang },
}));
