/**
 * AppNavigator Component
 * 
 * The main navigation component that sets up the navigation hierarchy for the authenticated app.
 * Uses a combination of bottom tab navigation (primary) and drawer navigation (secondary).
 * 
 * Used by: App.tsx (wrapped in SignedIn component)
 * 
 * Features:
 * - Bottom tab navigation as primary navigation (Home, Market, Chat, Account)
 * - Drawer navigation as secondary/convenience navigation (accessible via hamburger menu)
 * - Neobrutalist styling throughout
 * - Dashboard selection in Market tab with dropdown
 * - Sign out button at the bottom of the drawer
 * 
 * Navigation Structure:
 * - NavigationContainer
 *   - Drawer Navigator (side menu - accessible from all screens)
 *     - BottomTabNavigator (main navigation)
 *       - Home Tab
 *       - Market Tab (with dashboard selector)
 *       - Chat Tab
 *       - Account Tab
 *     - Individual Dashboard Screens (accessible from drawer)
 */
import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { SignOutButton, BackgroundTexture } from '../components/core';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { BottomTabNavigator } from './BottomTabNavigator';
import DashboardScreen from '../screens/DashboardScreen';
import dashboardsConfig from '../config/dashboards.json';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const [dashboardsExpanded, setDashboardsExpanded] = useState(true);

  const toggleDashboards = () => {
    setDashboardsExpanded(!dashboardsExpanded);
  };

  return (
    <View style={styles.drawerContainer}>
      <BackgroundTexture />
      <DrawerContentScrollView 
        {...props}
        contentContainerStyle={styles.drawerContent}
        style={styles.drawer}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>QuantiFy</Text>
        </View>
        
        {/* Main Navigation - Link to tabs */}
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Home' })}
          labelStyle={styles.drawerItemLabel}
          style={styles.drawerItem}
          activeBackgroundColor={colors.surface}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.inkMuted}
        />

        <DrawerItem
          label="Market"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Market' })}
          labelStyle={styles.drawerItemLabel}
          style={styles.drawerItem}
          activeBackgroundColor={colors.surface}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.inkMuted}
        />

        <DrawerItem
          label="Chat"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Chat' })}
          labelStyle={styles.drawerItemLabel}
          style={styles.drawerItem}
          activeBackgroundColor={colors.surface}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.inkMuted}
        />

        <DrawerItem
          label="Account"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Account' })}
          labelStyle={styles.drawerItemLabel}
          style={styles.drawerItem}
          activeBackgroundColor={colors.surface}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.inkMuted}
        />

        {/* Dashboards Section (Collapsible) - Quick access */}
        <DrawerItem
          label={() => (
            <View style={styles.drawerItemRow}>
              <Text style={styles.drawerItemLabel}>Quick Access</Text>
              <Text style={styles.arrow}>{dashboardsExpanded ? '▼' : '▶'}</Text>
            </View>
          )}
          onPress={toggleDashboards}
          labelStyle={styles.drawerItemLabel}
          style={styles.drawerItem}
          activeBackgroundColor={colors.surface}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.ink}
        />

        {dashboardsExpanded && dashboardsConfig.dashboards.map((dashboard, index) => {
          const isFocused = props.state.routes[props.state.index].name === dashboard.id;
          const isLast = index === dashboardsConfig.dashboards.length - 1;
          return (
            <DrawerItem
              key={dashboard.id}
              label={dashboard.name}
              onPress={() => props.navigation.navigate(dashboard.id)}
              labelStyle={[
                styles.dashboardItemLabel,
                isFocused ? styles.dashboardItemLabelActive : styles.dashboardItemLabelInactive
              ]}
              style={[
                styles.dashboardItem,
                isLast && styles.dashboardItemLast,
                isFocused && styles.dashboardItemActive
              ]}
              activeTintColor={colors.ink}
              inactiveTintColor={colors.inkMuted}
              focused={false}
              pressColor={colors.surface}
            />
          );
        })}
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
    <View style={styles.navigatorContainer}>
      <BackgroundTexture />
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="MainTabs"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: 'transparent',
              width: 300,
            },
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Main bottom tab navigator - Primary navigation */}
          <Drawer.Screen
            name="MainTabs"
            component={BottomTabNavigator}
            options={{ drawerLabel: () => null, drawerItemStyle: { display: 'none' } }}
          />

          {/* Individual dashboard screens - Accessible from drawer for quick access */}
          {dashboardsConfig.dashboards.map((dashboard) => (
            <Drawer.Screen
              key={dashboard.id}
              name={dashboard.id}
              component={DashboardScreen}
              initialParams={{ dashboardId: dashboard.id }}
              options={{
                title: dashboard.name,
                drawerLabel: () => null,
                drawerItemStyle: { display: 'none' }
              }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  navigatorContainer: {
    flex: 1,
    backgroundColor: colors.screenBg,
    position: 'relative',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.screenBg,
    position: 'relative',
  },
  drawer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  drawerContent: {
    paddingTop: 70,
    paddingBottom: 100, // Add padding to account for absolutely positioned sign out button
    flexGrow: 1,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 1,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
    marginBottom: 24,
  },
  drawerTitle: {
    ...typography.heading,
    fontSize: 20,
    color: colors.ink,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  drawerItem: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginHorizontal: 20,
    paddingLeft: 20,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 10, 10, 0.15)',
    borderLeftWidth: 0,
    minHeight: 22,
  },
  drawerItemActive: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: 17, // Adjust to account for border
  },
  drawerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  arrow: {
    fontSize: 12,
    color: colors.inkMuted,
    marginLeft: 12,
    fontWeight: '300',
  },
  drawerItemLabel: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  drawerItemLabelActive: {
    color: colors.ink,
    fontWeight: '600',
  },
  drawerItemLabelInactive: {
    color: colors.inkMuted,
    fontWeight: '400',
  },
  drawerItemNoBorder: {
    borderBottomWidth: 0,
  },
  dashboardItem: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginHorizontal: 20,
    paddingLeft: 40,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 10, 10, 0.15)',
    borderLeftWidth: 0,
    minHeight: 21,
  },
  dashboardItemActive: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: 37, // Adjust to account for border
  },
  dashboardItemLast: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 10, 10, 0.15)',
    paddingBottom: 2,
  },
  dashboardItemLabel: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 17,
    letterSpacing: 0.1,
  },
  dashboardItemLabelActive: {
    color: colors.ink,
    fontWeight: '600',
  },
  dashboardItemLabelInactive: {
    color: colors.inkMuted,
    fontWeight: '400',
  },
  signOutContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(10, 10, 10, 0.15)',
    position: 'absolute',
    bottom: 20, // Position from bottom with offset to move it higher
    left: 0,
    right: 0,
    backgroundColor: colors.screenBg,
  },
});
