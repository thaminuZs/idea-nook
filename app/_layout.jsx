import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { Component, Suspense } from 'react';
import { useFonts } from 'expo-font';
import { router, Tabs } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import OnboardingScreen from '../components/OnboardingScreen';
import { Fonts } from '../constants/Colors';
import { ProfileProvider, useProfile } from '../contexts/ProfileContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { DATABASE_NAME, initializeDatabase } from '../db';

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

const Navigation = () => {
  const { theme, scheme, toggleTheme } = useTheme();
  const { profile } = useProfile();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: Fonts.extraBold,
          fontSize: 18,
          color: theme.text,
        },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.bold,
          fontSize: 11,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
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
                <Text style={styles.profileBadgeEmoji}>{profile.avatarEmoji}</Text>
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
              <Text style={styles.themeToggleIcon}>
                {scheme === 'light' ? '🌙' : '☀️'}
              </Text>
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
          tabBarIcon: () => <Text style={styles.tabIcon}>✨</Text>,
        }}
      />
      <Tabs.Screen
        name="flat"
        options={{
          title: 'Explore',
          headerTitle: 'Explore',
          tabBarIcon: () => <Text style={styles.tabIcon}>🧭</Text>,
        }}
      />
      <Tabs.Screen
        name="scrol"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
          tabBarIcon: () => <Text style={styles.tabIcon}>👤</Text>,
        }}
      />
      <Tabs.Screen
        name="guide/[id]"
        options={{
          href: null,
          title: 'DIY Guide',
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
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
  profileBadgeEmoji: {
    fontSize: 14,
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
  themeToggleIcon: {
    fontSize: 15,
  },
  tabIcon: {
    fontSize: 18,
  },
});
