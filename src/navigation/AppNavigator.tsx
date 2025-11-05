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
import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SignOutButton } from '../components/base/SignOutButton';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import dashboardsConfig from '../config/dashboards.json';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const [dashboardsExpanded, setDashboardsExpanded] = useState(true);

  const toggleDashboards = () => {
    setDashboardsExpanded(!dashboardsExpanded);
  };

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
        
        {/* Home */}
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Home')}
          labelStyle={[
            styles.drawerItemLabel,
            props.state.routes[props.state.index].name === 'Home' 
              ? styles.drawerItemLabelActive
              : styles.drawerItemLabelInactive
          ]}
          style={[
            styles.drawerItem,
            props.state.routes[props.state.index].name === 'Home' && styles.drawerItemActive
          ]}
          activeBackgroundColor={colors.surface}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.inkMuted}
          focused={props.state.routes[props.state.index].name === 'Home'}
        />

        {/* Dashboards Section (Collapsible) */}
        <DrawerItem
          label={() => (
            <View style={styles.drawerItemRow}>
              <Text style={styles.drawerItemLabel}>Dashboards</Text>
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

        {/* Chat */}
        <DrawerItem
          label="Chat"
          onPress={() => props.navigation.navigate('Chat')}
          labelStyle={[
            styles.drawerItemLabel,
            props.state.routes[props.state.index].name === 'Chat' 
              ? styles.drawerItemLabelActive
              : styles.drawerItemLabelInactive
          ]}
          style={[
            styles.drawerItem,
            props.state.routes[props.state.index].name === 'Chat' && styles.drawerItemActive
          ]}
          activeBackgroundColor={colors.surface}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.inkMuted}
          focused={props.state.routes[props.state.index].name === 'Chat'}
        />
      </DrawerContentScrollView>
      
      {/* Sign out button at the bottom */}
      <View style={styles.signOutContainer}>
        <SignOutButton />
      </View>
    </View>
  );
}

export function AppNavigator() {
  // Find the default dashboard
  const defaultDashboard = dashboardsConfig.dashboards.find(d => d.isDefault) || dashboardsConfig.dashboards[0];
  
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName={defaultDashboard.id}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: colors.screenBg,
            width: 300,
          },
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ drawerLabel: () => null, drawerItemStyle: { display: 'none' } }}
        />
        
        {/* Dynamically create a screen for each dashboard */}
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
        
        <Drawer.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{ drawerLabel: () => null, drawerItemStyle: { display: 'none' } }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  drawer: {
    flex: 1,
    backgroundColor: colors.screenBg,
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
