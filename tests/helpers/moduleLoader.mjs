import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import babel from '@babel/core';

const require = createRequire(import.meta.url);
const PROJECT_ROOT = path.resolve(import.meta.dirname, '../..');

function createReactNativeStub(React) {
  const makeHost = (tag) => {
    const Comp = ({ children, ...props }) => {
      const cleanProps = {};
      for (const [k, v] of Object.entries(props)) {
        if (
          typeof v === 'string' ||
          typeof v === 'number' ||
          typeof v === 'boolean'
        ) {
          cleanProps[k] = v;
        }
      }
      return React.createElement(tag, cleanProps, children);
    };
    Comp.displayName = tag;
    return Comp;
  };

  return {
    Platform: { OS: 'android', select: (map) => map.android ?? map.default },
    StyleSheet: {
      hairlineWidth: 1,
      absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
      create: (styles) => styles,
    },
    Appearance: {
      setColorScheme: () => {},
      getColorScheme: () => 'light',
    },
    processColor: (v) => v,
    ActivityIndicator: makeHost('rn-activity-indicator'),
    Image: makeHost('rn-image'),
    KeyboardAvoidingView: makeHost('rn-keyboard-avoiding-view'),
    Modal: ({ visible = true, children, ...rest }) =>
      visible ? React.createElement('rn-modal', { visible }, children) : null,
    Pressable: ({ children, style, ...rest }) => {
      const resolvedStyle =
        typeof style === 'function' ? style({ pressed: false }) : style;
      return React.createElement(
        'rn-pressable',
        {
          accessibilityRole: rest.accessibilityRole,
          accessibilityLabel: rest.accessibilityLabel,
          'data-has-style': Boolean(resolvedStyle),
        },
        children
      );
    },
    ScrollView: makeHost('rn-scroll-view'),
    FlatList: ({ data = [], renderItem, ListHeaderComponent, ListFooterComponent, ListEmptyComponent }) => {
      const children = [];
      if (ListHeaderComponent) children.push(ListHeaderComponent);
      if (data.length === 0 && ListEmptyComponent) {
        children.push(ListEmptyComponent);
      } else {
        data.forEach((item, index) => {
          children.push(
            React.createElement(React.Fragment, { key: index }, renderItem({ item, index }))
          );
        });
      }
      if (ListFooterComponent) children.push(ListFooterComponent);
      return React.createElement('rn-flat-list', null, ...children);
    },
    Text: makeHost('rn-text'),
    TextInput: makeHost('rn-text-input'),
    View: makeHost('rn-view'),
    Animated: {
      Value: class AnimatedValue {
        constructor(v) {
          this.value = v;
        }
        setValue(v) {
          this.value = v;
        }
        interpolate() {
          return 0;
        }
      },
      View: makeHost('rn-animated-view'),
      multiply: (a) => a,
      delay: () => ({ start: (cb) => cb?.({ finished: true }), stop: () => {} }),
      timing: () => ({ start: (cb) => cb?.({ finished: true }), stop: () => {} }),
      spring: () => ({ start: (cb) => cb?.({ finished: true }), stop: () => {} }),
      sequence: () => ({ start: (cb) => cb?.({ finished: true }), stop: () => {} }),
      parallel: () => ({ start: (cb) => cb?.({ finished: true }), stop: () => {} }),
    },
    Easing: {
      out: (fn) => fn,
      in: (fn) => fn,
      inOut: (fn) => fn,
      quad: (t) => t,
    },
    Alert: {
      alert: () => {
        throw new Error('Alert.alert should not be used; use ConfirmDialog instead.');
      },
    },
  };
}

/**
 * Loads an Expo/React Native JS/JSX module inside Node by transforming ES modules + JSX
 * with Babel and providing lightweight deterministic stubs for native-only modules.
 */
export function createAppModuleLoader({
  sqliteGuide = null,
  profile = { id: 1, name: 'Maya', age: 8, gender: 'girl', avatarEmoji: 'star-four-points' },
  scheme = 'light',
  routes = [],
} = {}) {
  const React = require('react');
  const cache = new Map();

  const colorsMod = loadRawFile(path.join(PROJECT_ROOT, 'constants/Colors.js'));

  const customMocks = {
    react: React,
    'react-native': createReactNativeStub(React),
    '@expo/vector-icons': {
      MaterialCommunityIcons: ({ name, size, color }) =>
        React.createElement('rn-vector-icon', { 'data-icon': name, size, color }),
    },
    'expo-sqlite': {
      useSQLiteContext: () => ({
        __mock: true,
        getGuide: () => sqliteGuide,
      }),
      SQLiteProvider: ({ children }) => children,
    },
    'expo-router': {
      router: { push: () => {}, replace: () => {}, back: () => {}, canGoBack: () => false },
      useFocusEffect: () => {},
      useLocalSearchParams: () => ({}),
      Tabs: Object.assign(({ children }) => children, { Screen: () => null }),
      ThemeProvider: ({ children }) => children,
      DefaultTheme: { colors: {} },
      DarkTheme: { colors: {} },
      routes,
    },
    'expo-font': { useFonts: () => [true, null] },
    'expo-status-bar': { StatusBar: () => null },
    expo: { requireOptionalNativeModule: () => null },
  };

  function resolveModulePath(fromDir, spec) {
    if (!spec.startsWith('.')) return null;
    const base = path.resolve(fromDir, spec);
    const candidates = [
      base,
      `${base}.js`,
      `${base}.jsx`,
      path.join(base, 'index.js'),
      path.join(base, 'index.jsx'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        return c;
      }
    }
    throw new Error(`Cannot resolve ${spec} from ${fromDir}`);
  }

  function loadRawFile(absPath) {
    const normalized = path.normalize(absPath);
    if (cache.has(normalized)) {
      return cache.get(normalized).exports;
    }

    if (/\.(png|jpg|jpeg|webp|ttf|otf)$/i.test(normalized)) {
      return normalized;
    }

    // Intercept db/index.js for synchronous component rendering tests if sqliteGuide provided
    if (
      sqliteGuide &&
      normalized === path.normalize(path.join(PROJECT_ROOT, 'db/index.js'))
    ) {
      const dbMock = {
        ...loadRawFileUncached(path.join(PROJECT_ROOT, 'db/seed.js')),
        getGuideById: async () => sqliteGuide,
        seedInitialGuides: async () => false,
        toggleFavorite: async () => !sqliteGuide.isFavorite,
        toggleMaterialChecked: async () => null,
        resetGuideMaterials: async () => {},
        toggleStepCompleted: async () => null,
        resetGuideProgress: async () => {},
      };
      cache.set(normalized, { exports: dbMock });
      return dbMock;
    }

    const exportsObj = loadRawFileUncached(normalized);
    return exportsObj;
  }

  function loadRawFileUncached(normalized) {
    const mod = { exports: {} };
    cache.set(normalized, mod);

    // Provide deterministic theme/profile context hooks when requested
    if (normalized === path.normalize(path.join(PROJECT_ROOT, 'contexts/ThemeContext.jsx'))) {
      mod.exports = {
        useTheme: () => ({
          theme: colorsMod.Colors[scheme],
          scheme,
          toggleTheme: () => {},
        }),
        ThemeProvider: ({ children }) => children,
      };
      return mod.exports;
    }

    if (normalized === path.normalize(path.join(PROJECT_ROOT, 'contexts/ProfileContext.jsx'))) {
      mod.exports = {
        useProfile: () => ({
          profile,
          loading: false,
          error: null,
          saveProfile: async () => profile,
          clearProfile: async () => {},
          refreshProfile: async () => profile,
        }),
        ProfileProvider: ({ children }) => children,
      };
      return mod.exports;
    }

    const src = fs.readFileSync(normalized, 'utf8');
    const transformed = babel.transformSync(src, {
      filename: normalized,
      plugins: [
        ['@babel/plugin-transform-react-jsx', { runtime: 'classic' }],
        '@babel/plugin-transform-modules-commonjs',
      ],
    });

    const localDir = path.dirname(normalized);
    const localRequire = (spec) => {
      if (Object.prototype.hasOwnProperty.call(customMocks, spec)) {
        return customMocks[spec];
      }
      const target = resolveModulePath(localDir, spec);
      if (target) {
        return loadRawFile(target);
      }
      return require(spec);
    };

    const fn = vm.runInThisContext(
      `(function(exports, require, module, __filename, __dirname) {\n${transformed.code}\n})`,
      { filename: normalized }
    );
    fn(mod.exports, localRequire, mod, normalized, localDir);
    return mod.exports;
  }

  return {
    load(relPath) {
      return loadRawFile(path.join(PROJECT_ROOT, relPath));
    },
    React,
  };
}
