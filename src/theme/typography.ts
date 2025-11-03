/**
 * Typography Theme
 * 
 * Centralized typography configuration for consistent fonts across all widgets.
 * Currently using Helvetica for testing - can be changed to custom fonts.
 * 
 * Usage:
 * import { typography } from '../../theme/typography';
 * 
 * <Text style={typography.heading}>Title</Text>
 * <Text style={typography.body}>Body text</Text>
 */

export const typography = {
  // Font family - set to Helvetica for testing
  fontFamily: {
    regular: 'Helvetica', // Test font - change to your custom font name when ready
    medium: 'Helvetica',
    bold: 'Helvetica-Bold',
    heavy: 'Helvetica-Bold',
  },

  // Font sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
    xxxl: 32,
  },

  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Predefined text styles for common use cases
  heading: {
    fontSize: 18,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  headingLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  headingMedium: {
    fontSize: 28,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  headingSmall: {
    fontSize: 24,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'Helvetica',
  },

  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'Helvetica',
  },

  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'Helvetica',
  },

  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    fontFamily: 'Helvetica',
  },

  value: {
    fontSize: 16,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  valueLarge: {
    fontSize: 24,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  valueXLarge: {
    fontSize: 28,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  valueXXLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },

  change: {
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: 'Helvetica-Bold',
  },

  metricLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    fontFamily: 'Helvetica',
  },

  metricValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
  },
};

