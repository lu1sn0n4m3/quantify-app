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
import React, { PropsWithChildren, useMemo } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { BackgroundTexture } from '../core';

type ScreenLayoutProps = {
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
};

export const ScreenLayout: React.FC<PropsWithChildren<ScreenLayoutProps>> = ({
  children,
  contentStyle,
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();

  const computedContentStyle = useMemo(() => {
    const DEFAULT_PADDING_BOTTOM = 24;
    const flattenedContentStyle = StyleSheet.flatten(contentStyle) || {};
    const providedPaddingBottom = typeof flattenedContentStyle.paddingBottom === 'number' ? flattenedContentStyle.paddingBottom : undefined;
    const hasCustomPadding = providedPaddingBottom !== undefined;
    const basePaddingBottom = hasCustomPadding ? providedPaddingBottom : DEFAULT_PADDING_BOTTOM;

    return [
      styles.scrollContent,
      contentStyle,
      {
        paddingBottom: basePaddingBottom + (hasCustomPadding ? 0 : insets.bottom),
      },
    ];
  }, [contentStyle, insets.bottom]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, containerStyle]}>
      <BackgroundTexture />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={computedContentStyle}
        contentInsetAdjustmentBehavior="never"
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBg,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    position: 'relative',
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

