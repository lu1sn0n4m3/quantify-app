/**
 * NeoSidebarButton Component
 * 
 * A hamburger menu button component with neobrutalist styling that displays three horizontal
 * lines. Used in the header of all screens to toggle the drawer navigation menu.
 * 
 * Used by: ScreenHeader (layout component)
 * 
 * Props:
 * - onPress: Callback function executed when the button is pressed (typically opens drawer)
 * - style: Additional styles to apply to the button
 * - testID: Test identifier for automated testing
 */
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
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
  return (
    <Pressable 
      onPress={onPress} 
      hitSlop={10} 
      testID={testID}
      style={[styles.button, style]}
    >
      <View style={styles.container}>
        {[0, 1, 2].map(i => (
          <View 
            key={i} 
            style={styles.line}
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  container: {
    gap: 4,
  },
  line: {
    width: 20,
    height: 3,
    backgroundColor: colors.screenBg,
    borderRadius: 2,
  },
});

