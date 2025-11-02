/**
 * Token Cache
 * 
 * Provides secure token storage functionality for Clerk authentication using Expo SecureStore.
 * Implements the token cache interface required by Clerk to store and retrieve authentication
 * tokens securely on the device.
 * 
 * Used by: App.tsx (passed to ClerkProvider)
 * 
 * Features:
 * - Secure token storage using Expo SecureStore
 * - Async get/set operations for token management
 * - Required by Clerk for persistent authentication sessions
 * 
 * Note: SecureStore encrypts data and stores it securely in the device's keychain/keystore.
 */
import * as SecureStore from 'expo-secure-store';

export const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};
