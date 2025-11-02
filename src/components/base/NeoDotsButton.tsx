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
 * - horizontal: Boolean to display dots horizontally (true) or vertically (false)
 * - style: Additional styles to apply to the button
 * - testID: Test identifier for automated testing
 */
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { 
  onPress?: () => void; 
  size?: number; 
  horizontal?: boolean; 
  style?: any; 
  testID?: string;
};

export const NeoDotsButton: React.FC<Props> = ({ 
  onPress, 
  size = 4, 
  horizontal = true, 
  style, 
  testID 
}) => {
  return (
    <Pressable 
      onPress={onPress} 
      hitSlop={10} 
      testID={testID}
      style={[styles.button, style]}
    >
      <View style={{ flexDirection: horizontal ? 'row' : 'column', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <View 
            key={i} 
            style={{ 
              width: size, 
              height: size, 
              borderRadius: size / 2, 
              backgroundColor: colors.screenBg 
            }} 
          />
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.ink,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
});

