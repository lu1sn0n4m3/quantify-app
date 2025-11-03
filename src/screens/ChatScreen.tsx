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
import { typography } from '../theme/typography';

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
    ...typography.headingSmall,
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.ink,
    fontWeight: '600',
  },
});
