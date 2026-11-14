import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { Component, Suspense } from 'react';
import { router, Tabs } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import OnboardingScreen from '../components/OnboardingScreen';
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
      <ActivityIndicator size="large" color={theme.text} />
      <Text style={[styles.loadingText, { color: theme.text }]}>
        Loading offline DIY library...
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
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
        },
        tabBarActiveTintColor: '#FF7043',
        tabBarInactiveTintColor: 'gray',
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            {profile && (
              <Pressable
                onPress={() => router.push('/scrol')}
                style={styles.profileBadge}
              >
                <Text style={styles.profileBadgeText}>
                  {profile.avatarEmoji} {profile.name} ({profile.age})
                </Text>
              </Pressable>
            )}
            <Pressable onPress={toggleTheme} style={styles.themeToggle}>
              <Text>{scheme === 'light' ? '☀️' : '🌙'}</Text>
            </Pressable>
          </View>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerTitle: 'IdeaNook' }} />
      <Tabs.Screen name="flat" options={{ title: 'Explore', headerTitle: 'Explore Projects' }} />
      <Tabs.Screen name="scrol" options={{ title: 'Profile', headerTitle: 'My Profile' }} />
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
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Checking child profile...
        </Text>
      </View>
    );
  }

  // On first start: if no profile exists, ask for name, age, and gender
  if (!profile) {
    return <OnboardingScreen onComplete={saveProfile} isFirstTime={true} />;
  }

  return <Navigation />;
}

export default function RootLayout() {
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
    fontSize: 15,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 15,
  },
  profileBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFEBE5',
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D84315',
  },
  themeToggle: {
    padding: 4,
  },
});
