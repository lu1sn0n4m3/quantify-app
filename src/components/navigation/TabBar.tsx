/**
 * TabBar Component
 * 
 * Custom bottom tab bar that displays navigation tabs at the bottom of the screen.
 * Features neomorphic design with subtle shadows and borders.
 * 
 * Used by: BottomTabNavigator
 * 
 * Features:
 * - 4 tabs: Home, Market, Chat, Account
 * - Active state with purple accent indicator
 * - Safe area insets for devices with notches
 * - Proper shadow and border styling
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabBarButton } from './TabBarButton';
import { colors } from '../../theme/colors';

const TAB_CONFIG = [
  { key: 'Home', label: 'Home', icon: '🏠' },
  { key: 'Market', label: 'Market', icon: '📊' },
  { key: 'Chat', label: 'Chat', icon: '💬' },
  { key: 'Account', label: 'Account', icon: '👤' },
];

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {TAB_CONFIG.map((tab, index) => {
          const isActive = state.index === index;
          
          return (
            <TabBarButton
              key={tab.key}
              label={tab.label}
              icon={tab.icon}
              isActive={isActive}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[index].key,
                  canPreventDefault: true,
                });

                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(state.routes[index].name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

