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
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import dashboardsConfig from '../config/dashboards.json';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const [dashboardsExpanded, setDashboardsExpanded] = useState(true);
  
  // Debug: Log to verify dashboards are loaded
  console.log('Dashboards loaded:', dashboardsConfig.dashboards.length);
  console.log('Current route:', props.state.routes[props.state.index].name);

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
        
        {/* Home */}
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Home')}
          labelStyle={styles.drawerItemLabel}
          style={styles.drawerItem}
          activeBackgroundColor={colors.screenBg}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.ink}
          focused={props.state.routes[props.state.index].name === 'Home'}
        />

        {/* Dashboards Section (Collapsible) */}
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => setDashboardsExpanded(!dashboardsExpanded)}
        >
          <Text style={styles.sectionHeaderText}>
            {dashboardsExpanded ? '▼' : '▶'} Dashboards
          </Text>
        </TouchableOpacity>

        {dashboardsExpanded && dashboardsConfig.dashboards.map((dashboard) => {
          const isFocused = props.state.routes[props.state.index].name === dashboard.id;
          return (
            <DrawerItem
              key={dashboard.id}
              label={dashboard.name}
              onPress={() => props.navigation.navigate(dashboard.id)}
              labelStyle={[
                styles.dashboardItemLabel,
                isFocused && { fontWeight: '800', color: colors.pastelLilac }
              ]}
              style={styles.dashboardItem}
              activeTintColor={colors.ink}
              inactiveTintColor={colors.ink}
              focused={false}
            />
          );
        })}

        {/* Chat */}
        <DrawerItem
          label="Chat"
          onPress={() => props.navigation.navigate('Chat')}
          labelStyle={styles.drawerItemLabel}
          style={styles.drawerItem}
          activeBackgroundColor={colors.screenBg}
          activeTintColor={colors.ink}
          inactiveTintColor={colors.ink}
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
            backgroundColor: colors.cardBg,
            width: 280,
          },
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
    backgroundColor: colors.cardBg,
  },
  drawer: {
    flex:0,
    backgroundColor: colors.cardBg,
  },
  drawerContent: {
    paddingTop: 50,
  },
  drawerHeader: {
    padding: 18,
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
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerItem: {
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 4,
    paddingLeft: 12,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: -16,
    color: colors.ink,
  },
  dashboardItem: {
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 2,
    paddingLeft: 24,
  },
  dashboardItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: -16,
    color: colors.ink,
  },
  signOutContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },
});
