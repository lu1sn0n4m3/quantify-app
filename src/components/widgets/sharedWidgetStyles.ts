/**
 * Shared Widget Styles
 * 
 * Common styles used across multiple widget components to reduce duplication.
 * Import these styles and merge with component-specific styles.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const sharedWidgetStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.ink,
    marginVertical: 32,
    opacity: 0.15,
    marginHorizontal: 0,
    alignSelf: 'stretch',
  },
  expandedSection: {
    width: '100%',
    paddingTop: 8,
  },
  expandedContent: {
    // Empty style - can be removed or used for future common properties
  },
});

