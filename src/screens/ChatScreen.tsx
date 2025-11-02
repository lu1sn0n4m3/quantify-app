/**
 * ChatScreen Component
 * 
 * A placeholder screen for future chat functionality. Currently displays a "Coming soon"
 * message. Maintains consistent header styling with other screens including sidebar toggle.
 * 
 * Used by: AppNavigator (drawer navigation)
 * 
 * Features:
 * - Sidebar toggle button to open drawer navigation
 * - Centered "QuantiFy" header title
 * - Placeholder content for future chat implementation
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/colors';

export default function ChatScreen() {
  return (
    <ScreenLayout>
      <ScreenHeader />
      
      <View style={styles.content}>
        <Text style={styles.title}>Chat Screen</Text>
        <Text style={styles.subtitle}>Coming soon...</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.ink,
    fontWeight: '600',
  },
});
