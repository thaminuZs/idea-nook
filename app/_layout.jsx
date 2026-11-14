import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { Component, Suspense, useMemo } from 'react';
import { useFonts } from 'expo-font';
import {
  DarkTheme,
  DefaultTheme,
  router,
  Tabs,
  ThemeProvider as NavigationThemeProvider,
} from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import AppIcon from '../components/AppIcon';
import OnboardingScreen from '../components/OnboardingScreen';
import { Fonts } from '../constants/Colors';
import { ProfileProvider, useProfile } from '../contexts/ProfileContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { DATABASE_NAME, initializeDatabase } from '../db';

const VISIBLE_TABS = {
  index: { label: 'For You', icon: 'star-four-points' },
  flat: { label: 'Explore', icon: 'compass-outline' },
  scrol: { label: 'Profile', icon: 'account-circle-outline' },
};

class DatabaseErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not open offline database</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'Unexpected SQLite initialization error.'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function DatabaseLoadingFallback() {
  const { theme } = useTheme();

  return (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.loadingText, { color: theme.textMuted }]}>
        Loading your DIY library...
      </Text>
    </View>
  );
}

function CustomBottomTabBar({ state, emitter, navigateToTab, insets }) {
  const { theme } = useTheme();

  const currentRoute = state.routes[state.index];
  if (currentRoute?.name === 'guide/[id]') {
    return null;
  }

  const bottomPadding =
    Platform.OS === 'ios' ? Math.max(insets?.bottom || 0, 12) : 6;

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      <View style={styles.tabBarRow} role="tablist">
        {state.routes.map((route, index) => {
          const tabMeta = VISIBLE_TABS[route.name];
          if (!tabMeta) {
            return null;
          }

          const isFocused = state.index === index;
          const color = isFocused ? theme.primary : theme.textMuted;

          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={tabMeta.label}
            >
              <View
                style={[
                  styles.tabIconPill,
                  isFocused && { backgroundColor: theme.primarySoft },
                ]}
              >
                <AppIcon name={tabMeta.icon} size={20} color={color} />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color,
                    fontFamily: isFocused ? Fonts.extraBold : Fonts.semiBold,
                  },
                ]}
              >
                {tabMeta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const Navigation = () => {
  const { theme, scheme, toggleTheme } = useTheme();
  const { profile } = useProfile();

  const navigationTheme = useMemo(() => {
    const baseTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      dark: scheme === 'dark',
      colors: {
        ...baseTheme.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.surface,
        text: theme.text,
        border: theme.border,
        notification: theme.primary,
      },
    };
  }, [scheme, theme]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <View style={[styles.navRoot, { backgroundColor: theme.surface }]}>
        <StatusBar
          style={scheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={theme.surface}
        />
        <Tabs
          tabBar={(props) => <CustomBottomTabBar {...props} />}
          screenOptions={{
            sceneStyle: {
              backgroundColor: theme.background,
            },
            headerStyle: {
              backgroundColor: theme.surface,
              borderBottomColor: theme.border,
              borderBottomWidth: StyleSheet.hairlineWidth,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: Fonts.extraBold,
              fontSize: 18,
              color: theme.text,
            },
            headerTintColor: theme.text,
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                {profile && (
                  <Pressable
                    onPress={() => router.push('/scrol')}
                    style={[
                      styles.profileBadge,
                      { backgroundColor: theme.surfaceSubtle },
                    ]}
                  >
                    <AppIcon name={profile.avatarEmoji} size={15} color={theme.primary} />
                    <Text style={[styles.profileBadgeText, { color: theme.text }]}>
                      {profile.name}
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={toggleTheme}
                  style={[
                    styles.themeToggle,
                    { backgroundColor: theme.surfaceSubtle },
                  ]}
                >
                  <AppIcon
                    name={scheme === 'light' ? 'weather-night' : 'weather-sunny'}
                    size={18}
                    color={theme.text}
                  />
                </Pressable>
              </View>
            ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'For You',
              headerTitle: 'IdeaNook',
            }}
          />
          <Tabs.Screen
            name="flat"
            options={{
              title: 'Explore',
              headerTitle: 'Explore',
            }}
          />
          <Tabs.Screen
            name="scrol"
            options={{
              title: 'Profile',
              headerTitle: 'Profile',
            }}
          />
          <Tabs.Screen
            name="guide/[id]"
            options={{
              href: null,
              title: 'DIY Guide',
              headerShown: false,
            }}
          />
        </Tabs>
      </View>
    </NavigationThemeProvider>
  );
};

function RootApp() {
  const { profile, loading, saveProfile } = useProfile();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!profile) {
    return <OnboardingScreen onComplete={saveProfile} isFirstTime={true} />;
  }

  return <Navigation />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular: require('../assets/fonts/Montserrat-Regular.ttf'),
    Montserrat_500Medium: require('../assets/fonts/Montserrat-Medium.ttf'),
    Montserrat_600SemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    Montserrat_700Bold: require('../assets/fonts/Montserrat-Bold.ttf'),
    Montserrat_800ExtraBold: require('../assets/fonts/Montserrat-ExtraBold.ttf'),
    MaterialCommunityIcons: require('../assets/fonts/MaterialCommunityIcons.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <DatabaseErrorBoundary>
        <Suspense fallback={<DatabaseLoadingFallback />}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            onInit={initializeDatabase}
            useSuspense
          >
            <ProfileProvider>
              <RootApp />
            </ProfileProvider>
          </SQLiteProvider>
        </Suspense>
      </DatabaseErrorBoundary>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  navRoot: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#64748B',
    textAlign: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
  },
  profileBadgeText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  themeToggle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    paddingTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 3,
  },
  tabIconPill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    width: '100%',
    includeFontPadding: false,
  },
});
