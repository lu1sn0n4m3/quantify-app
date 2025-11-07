/**
 * AccountScreen Component
 * 
 * The account screen that displays user profile and account settings.
 * Currently shows user information and a sign out button.
 * 
 * Used by: BottomTabNavigator
 * 
 * Features:
 * - User profile information
 * - Sign out functionality
 * - Placeholder for future account features
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { SignOutButton } from '../components/core';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function AccountScreen() {
  const { user } = useUser();

  const displayName = user?.firstName || user?.username || 'User';
  const email = user?.emailAddresses[0]?.emailAddress || '';

  return (
    <>
      {/* Fixed header */}
      <SafeAreaView style={styles.fixedHeaderContainer} edges={['top']} pointerEvents="box-none">
        <ScreenHeader title="Account" />
      </SafeAreaView>

      {/* Main content */}
      <ScreenLayout contentStyle={styles.contentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* Account Options Placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.optionCard}>
              <Text style={styles.optionText}>Profile Settings</Text>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </View>
            <View style={styles.optionCard}>
              <Text style={styles.optionText}>Notifications</Text>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </View>
            <View style={styles.optionCard}>
              <Text style={styles.optionText}>Privacy</Text>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </View>
          </View>

          {/* Sign Out Section */}
          <View style={styles.signOutSection}>
            <SignOutButton />
          </View>
        </ScrollView>
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
    backgroundColor: colors.headerBg,
  },
  contentContainer: {
    paddingTop: 90,
    paddingBottom: 28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 },
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    ...typography.heading,
    fontSize: 36,
    color: colors.white,
    fontWeight: '600',
  },
  userName: {
    ...typography.heading,
    fontSize: 24,
    color: colors.ink,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userEmail: {
    ...typography.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  optionCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    ...typography.body,
    fontSize: 16,
    color: colors.ink,
    fontWeight: '500',
  },
  comingSoon: {
    ...typography.body,
    fontSize: 12,
    color: colors.inkMuted,
    fontStyle: 'italic',
  },
  signOutSection: {
    marginTop: 32,
    alignItems: 'center',
  },
});

