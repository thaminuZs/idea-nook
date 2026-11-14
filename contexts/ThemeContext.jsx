import { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, Platform, processColor } from 'react-native';
import { requireOptionalNativeModule } from 'expo';
import { Colors } from '../constants/Colors';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [scheme, setScheme] = useState('light');

  function toggleTheme() {
    setScheme((s) => (s === 'light' ? 'dark' : 'light'));
  }

  const theme = Colors[scheme];

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof document !== 'undefined') {
        document.documentElement.style.backgroundColor = theme.surface;
        document.body.style.backgroundColor = theme.surface;
        document.body.style.margin = '0';
      }
      return;
    }

    try {
      Appearance.setColorScheme?.(scheme);
    } catch {
      // Ignore if host environment disallows Appearance override
    }

    try {
      const parsedColor = processColor(theme.surface);
      const ExpoSystemUI = requireOptionalNativeModule('ExpoSystemUI');
      if (ExpoSystemUI?.setBackgroundColorAsync && parsedColor != null) {
        ExpoSystemUI.setBackgroundColorAsync(parsedColor).catch(() => {});
      }
    } catch {
      // Optional native module not present
    }

    if (Platform.OS === 'android') {
      try {
        const parsedColor = processColor(theme.surface);
        const ExpoNavigationBar = requireOptionalNativeModule('ExpoNavigationBar');
        if (ExpoNavigationBar?.setBackgroundColorAsync && parsedColor != null) {
          ExpoNavigationBar.setBackgroundColorAsync(parsedColor).catch(() => {});
        }
        if (ExpoNavigationBar?.setBorderColorAsync && parsedColor != null) {
          ExpoNavigationBar.setBorderColorAsync(parsedColor).catch(() => {});
        }
        if (ExpoNavigationBar?.setButtonStyleAsync) {
          ExpoNavigationBar.setButtonStyleAsync(scheme === 'dark' ? 'light' : 'dark').catch(() => {});
        }
      } catch {
        // Optional native module not present
      }
    }
  }, [scheme, theme.surface]);

  return (
    <ThemeContext.Provider value={{ theme, scheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
