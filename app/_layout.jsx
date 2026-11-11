import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

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
    <Navigation />
  </ThemeProvider>
  )
}

const styles = StyleSheet.create({})