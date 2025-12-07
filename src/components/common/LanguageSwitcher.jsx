import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

function getInitialLocale() {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const locale = path.split('/')[1];
    if (['es', 'en', 'pt'].includes(locale)) {
      return locale;
    }
  }
  return 'es';
}

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
];

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState(getInitialLocale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Sincronizar el idioma cuando cambia la URL
    const handleLocationChange = () => {
      const newLocale = getInitialLocale();
      if (newLocale !== currentLocale) {
        setCurrentLocale(newLocale);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleLocationChange);
      return () => window.removeEventListener('popstate', handleLocationChange);
    }
  }, [currentLocale]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const changeLanguage = locale => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const pathWithoutLocale = currentPath.replace(/^\/(es|en|pt)/, '') || '/';
      const newPath = `/${locale}${pathWithoutLocale}`;
      setIsOpen(false);
      window.location.assign(newPath);
    }
  };

  const currentLang =
    languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-transparent border-2 border-white rounded-full text-white font-medium hover:bg-white/10 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-green-900 text-xs sm:text-sm"
        aria-label="Cambiar idioma"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className="uppercase hidden sm:inline">{currentLang.code}</span>
        <span className="uppercase sm:hidden">{currentLang.code}</span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                currentLocale === language.code
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col">
                <span className="uppercase font-medium text-xs sm:text-sm">{language.code}</span>
                <span className="text-xs text-gray-500 hidden sm:block">{language.name}</span>
              </div>
              {currentLocale === language.code && (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
