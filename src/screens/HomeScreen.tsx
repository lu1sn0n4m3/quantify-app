/**
 * HomeScreen Component
 * 
 * The home screen that displays a personalized greeting to the authenticated user.
 * Currently shows a "Coming Soon" message as a placeholder for future features.
 * 
 * Used by: AppNavigator (drawer navigation)
 * 
 * Features:
 * - Sidebar toggle button to open drawer navigation
 * - Centered "QuantiFy" header title
 * - Personalized greeting with user's first name or email
 * - Coming soon placeholder message
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <>
      {/* Fixed header */}
      <SafeAreaView style={styles.fixedHeaderContainer} edges={['top']} pointerEvents="box-none">
        <ScreenHeader />
      </SafeAreaView>

      {/* Main content */}
      <ScreenLayout contentStyle={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.greeting}>
            Hello, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </Text>
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>
              Exciting features are on the way!
            </Text>
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  fixedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: colors.screenBg,
  },
  contentContainer: {
    paddingTop: 90,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 400,
  },
  greeting: {
    ...typography.change,
    fontSize: 20,
    color: colors.ink,
    marginBottom: 32,
  },
  comingSoonCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 4,
    borderColor: colors.ink,
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
  comingSoonText: {
    ...typography.headingMedium,
    color: colors.ink,
    marginBottom: 12,
  },
  comingSoonSubtext: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.ink,
    opacity: 0.7,
    textAlign: 'center',
  },
});
