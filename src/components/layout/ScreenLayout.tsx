/**
 * ScreenLayout Component
 * 
 * A reusable layout wrapper component that provides consistent screen structure with
 * SafeAreaView and ScrollView. Handles default styling for all screens in the app.
 * 
 * Used by: All screen components (WidgetScreen, HomeScreen, ChatScreen, AuthScreen)
 * 
 * Props:
 * - children: Content to be displayed inside the scrollable area
 * - contentStyle: Optional custom styles for the scroll content container
 * - containerStyle: Optional custom styles for the SafeAreaView container
 * 
 * Default Styles:
 * - Textured background with subtle pattern
 * - Bottom padding for scroll content
 * - Full flex layout
 */
import React, { PropsWithChildren, useRef } from 'react';
import { ScrollView, StyleSheet, ViewStyle, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, LinearGradient, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

type ScreenLayoutProps = {
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
};

export const ScreenLayout: React.FC<PropsWithChildren<ScreenLayoutProps>> = ({
  children,
  contentStyle,
  containerStyle,
}) => {
  // Generate unique ID for SVG patterns to avoid conflicts
  const layoutId = useRef(Math.random().toString(36).substring(2, 11)).current;

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      {/* Background Texture */}
      <View style={styles.textureOverlay} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <Pattern id={`layoutPattern-${layoutId}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <Circle cx="5" cy="5" r="0.7" fill={colors.ink} opacity="0.05" />
            </Pattern>
            <LinearGradient id={`layoutGradient-${layoutId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.pastelBlue} stopOpacity="0.12" />
              <Stop offset="50%" stopColor={colors.pastelMint} stopOpacity="0.08" />
              <Stop offset="100%" stopColor={colors.pastelBlush} stopOpacity="0.10" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#layoutPattern-${layoutId})`} />
          <Rect width="100%" height="100%" fill={`url(#layoutGradient-${layoutId})`} />
        </Svg>
      </View>
      
      <ScrollView contentContainerStyle={[styles.scrollContent, contentStyle]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBgElevated || colors.surface,
    position: 'relative',
  },
  textureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  scrollContent: {
    paddingBottom: 100,
    position: 'relative',
    zIndex: 1,
  },
});

