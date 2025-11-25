import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'ta';

interface ThemeContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language | null;
    return stored || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
  };

  return (
    <ThemeContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
