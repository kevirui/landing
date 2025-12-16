import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLocaleFromPath,
  removeLocaleFromPath,
  getTranslations,
  t,
} from './utils.js';

describe('i18n utilities', () => {
  describe('getLocaleFromPath', () => {
    it('should extract locale from path', () => {
      expect(getLocaleFromPath('/es/about')).toBe('es');
      expect(getLocaleFromPath('/en/contact')).toBe('en');
      expect(getLocaleFromPath('/pt/services')).toBe('pt');
    });

    it('should handle locale-only paths', () => {
      expect(getLocaleFromPath('/es')).toBe('es');
      expect(getLocaleFromPath('/en')).toBe('en');
      expect(getLocaleFromPath('/pt')).toBe('pt');
    });

    it('should return default locale for paths without locale', () => {
      expect(getLocaleFromPath('/')).toBe('es');
      expect(getLocaleFromPath('/about')).toBe('es');
      expect(getLocaleFromPath('/invalid/path')).toBe('es');
    });

    it('should handle trailing slashes', () => {
      expect(getLocaleFromPath('/es/')).toBe('es');
      expect(getLocaleFromPath('/en/about/')).toBe('en');
    });
  });

  describe('removeLocaleFromPath', () => {
    it('should remove locale from path', () => {
      expect(removeLocaleFromPath('/es/about', 'es')).toBe('/about');
      expect(removeLocaleFromPath('/en/contact', 'en')).toBe('/contact');
      expect(removeLocaleFromPath('/pt/services', 'pt')).toBe('/services');
    });

    it('should return root path when removing locale from locale-only path', () => {
      expect(removeLocaleFromPath('/es', 'es')).toBe('/');
      expect(removeLocaleFromPath('/en', 'en')).toBe('/');
    });

    it('should not modify path if locale does not match', () => {
      expect(removeLocaleFromPath('/es/about', 'en')).toBe('/es/about');
      expect(removeLocaleFromPath('/about', 'es')).toBe('/about');
    });

    it('should handle nested paths', () => {
      expect(removeLocaleFromPath('/es/blog/post', 'es')).toBe('/blog/post');
    });
  });

  describe('getTranslations', () => {
    it('should return translations for valid locale', () => {
      const esTranslations = getTranslations('es');
      expect(esTranslations).toBeDefined();
      expect(typeof esTranslations).toBe('object');
    });

    it('should return translations for en locale', () => {
      const enTranslations = getTranslations('en');
      expect(enTranslations).toBeDefined();
      expect(typeof enTranslations).toBe('object');
    });

    it('should return translations for pt locale', () => {
      const ptTranslations = getTranslations('pt');
      expect(ptTranslations).toBeDefined();
      expect(typeof ptTranslations).toBe('object');
    });

    it('should default to es when no locale provided', () => {
      const defaultTranslations = getTranslations();
      const esTranslations = getTranslations('es');
      expect(defaultTranslations).toEqual(esTranslations);
    });

    it('should fall back to default locale for invalid locale', () => {
      const invalidTranslations = getTranslations('invalid');
      const defaultTranslations = getTranslations('es');
      expect(invalidTranslations).toEqual(defaultTranslations);
    });
  });

  describe('t (translation function)', () => {
    it('should return translation for existing key in default locale', () => {
      const result = t('nav.home');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return translation for specific locale', () => {
      const esResult = t('nav.home', 'es');
      const enResult = t('nav.home', 'en');
      expect(esResult).toBeDefined();
      expect(enResult).toBeDefined();
      expect(typeof esResult).toBe('string');
      expect(typeof enResult).toBe('string');
    });

    it('should return key if translation not found', () => {
      const nonExistentKey = 'non.existent.key';
      expect(t(nonExistentKey)).toBe(nonExistentKey);
    });

    it('should fall back to default locale for invalid locale', () => {
      const result = t('nav.home', 'invalid');
      const defaultResult = t('nav.home', 'es');
      expect(result).toBe(defaultResult);
    });
  });
});
