/**
 * TabBarButton Component
 * 
 * Individual tab button for the bottom tab navigator.
 * Features neomorphic design with active state indicator.
 * 
 * Used by: TabBar component
 * 
 * Props:
 * - label: Display text for the tab
 * - icon: Unicode emoji icon
 * - isActive: Whether this tab is currently selected
 * - onPress: Callback when tab is pressed
 */
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { TabIconProps } from '../svg/TabIcons';

type IconComponent = React.ComponentType<TabIconProps>;

export type TabBarButtonProps = {
  label: string;
  Icon: IconComponent;
  isActive: boolean;
  onPress: () => void;
};

export const TabBarButton: React.FC<TabBarButtonProps> = ({
  label,
  Icon,
  isActive,
  onPress,
}) => {
  const iconColor = isActive ? colors.ink : colors.inkMuted;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Icon color={iconColor} size={24} />
        </View>
        <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
        {isActive && <View style={styles.activeIndicator} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 44, // Ensure minimum touch target
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    marginBottom: 4,
  },
  label: {
    ...typography.body,
    fontSize: 11,
    color: colors.inkMuted,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.ink,
    fontWeight: '600',
  },
  activeIndicator: {
    marginTop: 6,
    width: 40,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
    alignSelf: 'center',
  },
});

