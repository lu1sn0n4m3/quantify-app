/**
 * BackgroundTexture Component
 * 
 * Reusable background texture pattern with dots and gradient overlay.
 * Used to reduce duplication across ScreenLayout and DashboardScreen.
 */
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../theme/colors';

export const BackgroundTexture: React.FC = () => {
  const textureId = useRef(Math.random().toString(36).substring(2, 11)).current;

  return (
    <View style={styles.textureOverlay} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id={`texturePattern-${textureId}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <Circle cx="5" cy="5" r="0.7" fill={colors.ink} opacity="0.05" />
          </Pattern>
          <LinearGradient id={`textureGradient-${textureId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.pastelBlue} stopOpacity="0.12" />
            <Stop offset="50%" stopColor={colors.pastelMint} stopOpacity="0.08" />
            <Stop offset="100%" stopColor={colors.pastelBlush} stopOpacity="0.10" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#texturePattern-${textureId})`} />
        <Rect width="100%" height="100%" fill={`url(#textureGradient-${textureId})`} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  textureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});

