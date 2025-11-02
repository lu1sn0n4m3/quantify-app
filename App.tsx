/**
 * App Component (Root)
 * 
 * The root component of the application that sets up authentication and routing.
 * Uses Clerk for authentication management, conditionally rendering either the
 * authenticated app (AppNavigator) or the authentication screen (AuthScreen) based
 * on the user's signed-in state.
 * 
 * Features:
 * - ClerkProvider wrapper for authentication context
 * - SignedIn/SignedOut conditional rendering
 * - Secure token caching using Expo SecureStore
 * - Environment variable for Clerk publishable key
 * 
 * Flow:
 * - If user is signed in: Renders AppNavigator (drawer navigation with screens)
 * - If user is signed out: Renders AuthScreen (sign-in interface)
 * 
 * Note: Requires EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable
 */
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from './src/auth/tokenCache';
import { AppNavigator } from './src/navigation/AppNavigator';
import AuthScreen from './src/screens/AuthScreen';
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@env';

export default function App() {
  return (
    <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SignedIn>
        <AppNavigator />
      </SignedIn>

      <SignedOut>
        <AuthScreen />
      </SignedOut>
    </ClerkProvider>
  );
}
