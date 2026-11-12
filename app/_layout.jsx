import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { Component, Suspense } from 'react';
import { Tabs } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
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
  const {theme, scheme, toggleTheme} = useTheme();

  return (
    <Tabs screenOptions={{
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      tabBarStyle: {
        backgroundColor: theme.background,
      },
      tabBarActiveTintColor: theme.text,
      tabBarInactiveTintColor: 'gray',
      headerRight: () => (
        <Pressable onPress={toggleTheme} style={{marginRight: 15}}>
          <Text>{scheme === 'light' ? '☀️' : '🌙'}</Text>
        </Pressable>
      )
    }}>
      <Tabs.Screen name='index' options={{title: 'Home Page', headerTitle: 'Home'}}/>
      <Tabs.Screen name='flat' options={{title: 'Flat Page', headerTitle: 'Flat'}}/>
      <Tabs.Screen name='scrol' options={{title: 'Scroll Page', headerTitle: 'Sroll'}}/>
    </Tabs>
  )
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
            <Navigation />
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
});
