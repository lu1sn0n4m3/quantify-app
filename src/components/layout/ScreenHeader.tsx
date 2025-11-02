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
    padding: 18,
    borderBottomWidth: 4,
    borderBottomColor: colors.ink,
    backgroundColor: colors.screenBg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  divider: {
    height: 4,
    backgroundColor: colors.ink,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.cardBg,
    borderWidth: 3,
    borderColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 20,
  },
});

