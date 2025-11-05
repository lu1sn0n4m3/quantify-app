/**
 * ScreenHeader Component
 * 
 * A reusable header component that appears on all screens with consistent styling.
 * Can show either a sidebar toggle button or a close button depending on the mode.
 * 
 * Used by: All screen components (WidgetScreen, HomeScreen, ChatScreen)
 * 
 * Features:
 * - Sidebar toggle button that opens drawer navigation (default mode)
 * - Close button for modal/expanded views (when onClose is provided)
 * - Centered "QuantiFy" branding
 * - Consistent neobrutalist styling
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NeoSidebarButton } from '../base/NeoSidebarButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import dashboardsConfig from '../../config/dashboards.json';

type ScreenHeaderProps = {
  onClose?: () => void; // If provided, shows close button instead of sidebar button
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ onClose }) => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Find dashboard name from route
  const dashboard = dashboardsConfig.dashboards.find(d => d.id === route.name);
  const title = dashboard ? dashboard.name : 'QuantiFy';

  return (
    <>
      <View style={styles.header}>
        {onClose ? (
          // Close button for expanded/modal views
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        ) : (
          // Sidebar button for normal views
          <NeoSidebarButton onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
    backgroundColor: colors.screenBg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    ...typography.heading,
    fontSize: 22,
    color: colors.ink,
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.4,
    fontWeight: '500',
    fontFamily: 'Helvetica',
  },
  placeholder: {
    width: 44,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ink,
    opacity: 0.9,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardBg,
    borderWidth: 1.5,
    borderColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  closeButtonText: {
    ...typography.heading,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 22,
    fontWeight: '700',
  },
});

