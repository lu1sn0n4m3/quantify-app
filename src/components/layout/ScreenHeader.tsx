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
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, LinearGradient, Stop } from 'react-native-svg';
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
  
  // Generate unique ID for SVG patterns to avoid conflicts
  const headerId = useRef(Math.random().toString(36).substring(2, 11)).current;

  return (
    <View style={styles.headerContainer}>
      {/* Modern Gradient Background - Darker edges, lighter center */}
      <View style={styles.gradientOverlay} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id={`headerGradient-${headerId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#E8F4F8" stopOpacity="0.18" />
              <Stop offset="25%" stopColor="#F0F8FA" stopOpacity="0.12" />
              <Stop offset="50%" stopColor="#F8FCFD" stopOpacity="0.08" />
              <Stop offset="75%" stopColor="#F0F8FA" stopOpacity="0.12" />
              <Stop offset="100%" stopColor="#E8F4F8" stopOpacity="0.18" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#headerGradient-${headerId})`} />
        </Svg>
      </View>
      
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
        <Text style={styles.headerTitle} pointerEvents="none">{title}</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Header Stripe Separator */}
      <View style={styles.headerStripe} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.screenBg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 1,
  },
  headerStripe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E5E5',
    zIndex: 100, // Very high z-index to ensure it's on top
  },
  headerTitle: {
    ...typography.heading,
    fontSize: 22,
    color: colors.ink,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    letterSpacing: -0.4,
    fontWeight: '500',
    fontFamily: 'Helvetica',
  },
  placeholder: {
    width: 44,
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

