/**
 * NeoDotsButton Component
 * 
 * A small button component displaying three dots (horizontally or vertically) with
 * neobrutalist styling. Used as an expand/action button, typically shown in the top-right
 * corner of cards to trigger expansion or additional actions.
 * 
 * Used by: NeoCard (for expand functionality)
 * 
 * Props:
 * - onPress: Callback function executed when the button is pressed
 * - size: Size of each dot (default: 4)
 * - expanded: Boolean to rotate dots 90 degrees when expanded
 * - style: Additional styles to apply to the button
 * - testID: Test identifier for automated testing
 */
import React from 'react';
import { Pressable, View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { 
  onPress?: () => void; 
  size?: number; 
  expanded?: boolean;
  style?: any; 
  testID?: string;
};

export const NeoDotsButton: React.FC<Props> = ({ 
  onPress, 
  size = 4, 
  expanded = false,
  style, 
  testID 
}) => {
  const rotation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotation, {
      toValue: expanded ? 90 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotateStyle = {
    transform: [{ rotate: rotation.interpolate({
      inputRange: [0, 90],
      outputRange: ['0deg', '90deg']
    })}]
  };

  // Calculate container size to accommodate both horizontal and vertical orientations
  // Horizontal: 3 dots + 2 gaps = 3*size + 2*4
  // Vertical: same height as horizontal width
  const containerSize = size * 3 + 8; // 3 dots + 2 gaps (4px each)

  return (
    <Pressable 
      onPress={onPress} 
      hitSlop={10} 
      testID={testID}
      style={[styles.button, style]}
    >
      <View style={[styles.container, { width: containerSize, height: containerSize }]}>
        <Animated.View style={[styles.dotsContainer, rotateStyle]}>
          {[0, 1, 2].map(i => (
            <View 
              key={i} 
              style={{ 
                width: size, 
                height: size, 
                borderRadius: size / 2, 
                backgroundColor: colors.ink 
              }} 
            />
          ))}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    // No background, border, padding, or shadow - just the dots
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

