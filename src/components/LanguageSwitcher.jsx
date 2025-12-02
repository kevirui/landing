import { useState, useEffect } from 'react';

function getInitialLocale() {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const locale = path.split('/')[1];
    if (['es', 'en'].includes(locale)) {
      return locale;
    }
  }
  return 'es';
}

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState(getInitialLocale);

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

  const changeLanguage = locale => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const pathWithoutLocale = currentPath.replace(/^\/(es|en)/, '') || '/';
      const newPath = `/${locale}${pathWithoutLocale}`;
      window.location.href = newPath;
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded ${
          currentLocale === 'es'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded ${
          currentLocale === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}
