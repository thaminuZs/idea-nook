import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useTheme } from '../contexts/ThemeContext';
import { getDashboardStats, getGuides } from '../db';

const Home = () => {
  const db = useSQLiteContext();
  const { theme, scheme } = useTheme();
  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadDatabasePreview() {
        try {
          setError(null);
          const [guideRows, dashboardStats] = await Promise.all([
            getGuides(db),
            getDashboardStats(db),
          ]);
          if (isActive) {
            setGuides(guideRows);
            setStats(dashboardStats);
          }
        } catch (err) {
          if (isActive) {
            setError(err?.message || 'Failed to read SQLite database.');
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      loadDatabasePreview();

      return () => {
        isActive = false;
      };
    }, [db])
  );

  const cardBackground = scheme === 'dark' ? '#161616' : '#F6F7FB';
  const borderColor = scheme === 'dark' ? '#2A2A2A' : '#E3E6EE';
  const mutedText = scheme === 'dark' ? '#B0B6C2' : '#5A6270';

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={guides}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={require('./../assets/icon.png')} style={styles.logo} />
            <View>
              <Text style={[styles.title, { color: theme.text }]}>IdeaNook Offline DB</Text>
              <Text style={[styles.subtitle, { color: mutedText }]}>
                SQLite ready • {stats?.totalGuides ?? 0} DIY guides • {stats?.totalStars ?? 0} stars
              </Text>
            </View>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View
          style={[
            styles.card,
            { backgroundColor: cardBackground, borderColor },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: item.accentColor }]}>
            <Text style={styles.emoji}>{item.iconEmoji}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.cardMeta, { color: mutedText }]}>
              {item.category} • Ages {item.minAge}–{item.maxAge} • {item.estimatedMinutes} min •{' '}
              {item.totalSteps} steps
            </Text>
          </View>
        </View>
      )}
    />
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 15,
    textAlign: 'center',
  },
});
