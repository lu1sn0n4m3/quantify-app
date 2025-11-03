/**
 * AuthScreen Component
 * 
 * The authentication screen displayed when the user is not signed in. Handles OAuth sign-in
 * via Apple using Clerk's authentication system. Features neobrutalist styling with welcome
 * messaging and a prominent sign-in button.
 * 
 * Used by: App.tsx (displayed when SignedOut condition is true)
 * 
 * Features:
 * - Apple OAuth authentication flow
 * - Welcome message and branding
 * - Error handling for authentication failures
 * - Neobrutalist design consistent with app theme
 * 
 * Note: Currently configured for Apple OAuth. Can be changed to Google or other providers
 * by modifying the strategy parameter in useOAuth hook.
 */
import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { ScreenLayout } from '../components/layout/ScreenLayout';

export default function AuthScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  async function handleSignIn() {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        Alert.alert('Sign-in failed');
      }
    } catch (err: any) {
      console.error('OAuth error', err);
      Alert.alert('Error', err?.message || 'Unknown error');
    }
  }

  return (
    <ScreenLayout>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>QuantiFy</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome to QuantiFy</Text>
          <Text style={styles.subtitle}>Your personal finance dashboard</Text>
          
          <Pressable style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Continue with Apple</Text>
          </Pressable>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    padding: 18,
    borderBottomWidth: 4,
    borderBottomColor: colors.ink,
    alignItems: 'center',
  },
  logo: {
    ...typography.headingMedium,
    color: colors.ink,
  },
  divider: {
    height: 4,
    backgroundColor: colors.ink,
  },
  welcomeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    ...typography.headingLarge,
    color: colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.change,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.ink,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: colors.ink,
    minWidth: 240,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  buttonText: {
    ...typography.change,
    color: colors.screenBg,
  },
});
