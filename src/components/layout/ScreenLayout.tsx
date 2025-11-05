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
import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { BackgroundTexture } from '../base/BackgroundTexture';

type ScreenLayoutProps = {
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
};

export const ScreenLayout: React.FC<PropsWithChildren<ScreenLayoutProps>> = ({
  children,
  contentStyle,
  containerStyle,
}) => {
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <BackgroundTexture />
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
  scrollContent: {
    paddingBottom: 100,
    position: 'relative',
    zIndex: 1,
  },
});

