import { createContext, useState } from 'react';

// Étape 1 : créer le contexte, une seule fois, en dehors de tout composant
export const ThemeContext = createContext(null);

// Étape 2 : le fournisseur garde l'état et le partage avec tous ses enfants
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
