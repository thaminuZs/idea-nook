import { createContext, useContext, useState } from 'react';
import { Colors } from '../constants/Colors';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [scheme, setScheme] = useState('light');

  function toggleTheme() {
    setScheme((s) => s === 'light' ? 'dark' : 'light');
  }

  const theme = Colors[scheme];

  return (
    <ThemeContext.Provider value={{theme, scheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);