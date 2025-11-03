/**
 * SignOutButton Component
 * 
 * A button component that handles user sign-out functionality using Clerk authentication.
 * Displays "Sign out" text with neobrutalist styling (red warning color, bold borders, shadows).
 * When pressed, it calls Clerk's signOut() function which automatically redirects to the
 * AuthScreen via the SignedIn/SignedOut components in App.tsx.
 * 
 * Used by: HomeScreen
 * 
 * Features:
 * - Integrates with Clerk authentication
 * - Error handling for sign-out failures
 * - Neobrutalist styling consistent with app design
 */
import React from 'react';
import { useClerk } from '@clerk/clerk-expo';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Clerk will automatically handle navigation via SignedIn/SignedOut components
      // No need for router navigation in this setup
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error('Sign out error:', JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Text style={styles.text}>Sign out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.warning,
    borderWidth: 3,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // Center the button in its container
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  text: {
    ...typography.heading,
    fontSize: 14,
    color: colors.white,
  },
});

