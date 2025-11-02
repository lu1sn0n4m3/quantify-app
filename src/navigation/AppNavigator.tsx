/**
 * AppNavigator Component
 * 
 * The main navigation component that sets up drawer navigation for the authenticated app.
 * Uses React Navigation's drawer navigator with custom styling to match the neobrutalist
 * design theme. Manages navigation between Home, Widgets, and Chat screens.
 * 
 * Used by: App.tsx (wrapped in SignedIn component)
 * 
 * Features:
 * - Custom drawer content with "QuantiFy" branding
 * - Neobrutalist styling for drawer and menu items
 * - Three main screens: Home, Widgets, Chat
 * - Sign out button at the bottom of the drawer
 * - No default header (headerShown: false) - screens manage their own headers
 * 
 * Navigation Structure:
 * - Drawer Navigator (side menu)
 *   - Home Screen
 *   - Widgets Screen (initial route)
 *   - Chat Screen
 *   - Sign Out (at bottom)
 */
import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { SignOutButton } from '../components/base/SignOutButton';
import { colors } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import WidgetScreen from '../screens/WidgetScreen';
import ChatScreen from '../screens/ChatScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView 
        {...props}
        contentContainerStyle={styles.drawerContent}
        style={styles.drawer}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>QuantiFy</Text>
        </View>
        <View style={styles.divider} />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* Sign out button at the bottom */}
      <View style={styles.signOutContainer}>
        <SignOutButton />
      </View>
    </View>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Widgets"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: colors.cardBg,
            width: 280,
          },
          drawerActiveTintColor: colors.ink,
          drawerInactiveTintColor: colors.ink,
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '700',
            marginLeft: -16,
          },
          drawerItemStyle: {
            backgroundColor: colors.cardBg,
            borderRadius: 8,
            marginHorizontal: 12,
            marginVertical: 4,
            paddingLeft: 12,
          },
          drawerActiveBackgroundColor: colors.screenBg,
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Widgets" component={WidgetScreen} />
        <Drawer.Screen name="Chat" component={ChatScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },
  drawer: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },
  drawerContent: {
    paddingTop: 20,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 4,
    borderBottomColor: colors.ink,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },
  divider: {
    height: 4,
    backgroundColor: colors.ink,
    marginBottom: 8,
  },
  signOutContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },
});
