/**
 * NeoSidebarButton Component
 * 
 * A hamburger menu button component with neobrutalist styling that displays three horizontal
 * black lines. When the drawer is open, the lines animate to rotate 90 degrees (vertical).
 * 
 * Used by: ScreenHeader (layout component)
 * 
 * Props:
 * - onPress: Callback function executed when the button is pressed (typically opens drawer)
 * - style: Additional styles to apply to the button
 * - testID: Test identifier for automated testing
 */
import React, { useEffect, useRef } from 'react';
import { Pressable, View, StyleSheet, Animated } from 'react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { colors } from '../../theme/colors';

type Props = { 
  onPress?: () => void; 
  style?: any; 
  testID?: string;
};

export const NeoSidebarButton: React.FC<Props> = ({ 
  onPress, 
  style, 
  testID 
}) => {
  const drawerStatus = useDrawerStatus();
  const isOpen = drawerStatus === 'open';
  
  // Animation values for each line (rotation and translation)
  const line1Rotation = useRef(new Animated.Value(0)).current;
  const line2Rotation = useRef(new Animated.Value(0)).current;
  const line3Rotation = useRef(new Animated.Value(0)).current;
  const line1TranslateX = useRef(new Animated.Value(0)).current;
  const line2TranslateX = useRef(new Animated.Value(0)).current;
  const line3TranslateX = useRef(new Animated.Value(0)).current;
  const line1TranslateY = useRef(new Animated.Value(0)).current;
  const line2TranslateY = useRef(new Animated.Value(0)).current;
  const line3TranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const targetRotation = isOpen ? 90 : 0;
    // When vertical, translate lines horizontally to space them
    const targetTranslateX = isOpen ? [-6, 0, 6] : [0, 0, 0];
    // When vertical, center all lines vertically (container center is at 10)
    const targetTranslateY = isOpen ? [6, 1, -4] : [0, 0, 0];
    
    // Helper to create spring animation with consistent config
    const createSpring = (value: Animated.Value, toValue: number) =>
      Animated.spring(value, {
        toValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      });
    
    Animated.parallel([
      createSpring(line1Rotation, targetRotation),
      createSpring(line2Rotation, targetRotation),
      createSpring(line3Rotation, targetRotation),
      createSpring(line1TranslateX, targetTranslateX[0]),
      createSpring(line2TranslateX, targetTranslateX[1]),
      createSpring(line3TranslateX, targetTranslateX[2]),
      createSpring(line1TranslateY, targetTranslateY[0]),
      createSpring(line2TranslateY, targetTranslateY[1]),
      createSpring(line3TranslateY, targetTranslateY[2]),
    ]).start();
  }, [isOpen, line1Rotation, line2Rotation, line3Rotation, line1TranslateX, line2TranslateX, line3TranslateX, line1TranslateY, line2TranslateY, line3TranslateY]);

  return (
    <Pressable 
      onPress={onPress} 
      hitSlop={10} 
      testID={testID}
      style={[styles.button, style]}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.line,
            styles.line1,
            {
              transform: [
                { translateX: line1TranslateX },
                { translateY: line1TranslateY },
                { rotate: line1Rotation.interpolate({
                  inputRange: [0, 90],
                  outputRange: ['0deg', '90deg']
                })}
              ]
            }
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            styles.line2,
            {
              transform: [
                { translateX: line2TranslateX },
                { translateY: line2TranslateY },
                { rotate: line2Rotation.interpolate({
                  inputRange: [0, 90],
                  outputRange: ['0deg', '90deg']
                })}
              ]
            }
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            styles.line3,
            {
              transform: [
                { translateX: line3TranslateX },
                { translateY: line3TranslateY },
                { rotate: line3Rotation.interpolate({
                  inputRange: [0, 90],
                  outputRange: ['0deg', '90deg']
                })}
              ]
            }
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: colors.white,
    borderRadius: 1,
    position: 'absolute',
  },
  line1: {
    top: 4,
  },
  line2: {
    top: 9,
  },
  line3: {
    top: 14,
  },
});

