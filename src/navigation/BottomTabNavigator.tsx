/**
 * BottomTabNavigator Component
 * 
 * The main bottom tab navigator that provides primary navigation for the app.
 * Uses custom tab bar with neomorphic design.
 * 
 * Used by: AppNavigator (top level navigation)
 * 
 * Features:
 * - 4 main tabs: Home, Market, Chat, Account
 * - Custom TabBar component with neomorphic styling
 * - Smooth transitions between tabs
 * - Preserves state across tab switches
 * 
 * Navigation Structure:
 * - Home: HomeScreen (user dashboard/welcome)
 * - Market: MarketScreen (dashboards with dropdown selector)
 * - Chat: ChatScreen (AI chat interface)
 * - Account: AccountScreen (user profile and settings)
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/navigation/TabBar';
import HomeScreen from '../screens/HomeScreen';
import MarketScreen from '../screens/MarketScreen';
import ChatScreen from '../screens/ChatScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Market"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Market" component={MarketScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

