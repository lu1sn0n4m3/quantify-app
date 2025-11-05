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

  // Font sizes (refined for better hierarchy)
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    display: 36,
  },

  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Predefined text styles for common use cases (with improved spacing)
  heading: {
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.3,
    lineHeight: 24,
  },

  headingLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.5,
    lineHeight: 40,
  },

  headingMedium: {
    fontSize: 28,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.4,
    lineHeight: 36,
  },

  headingSmall: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.3,
    lineHeight: 32,
  },

  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'Helvetica',
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'Helvetica',
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'Helvetica',
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    fontFamily: 'Helvetica',
    letterSpacing: 0.2,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },

  value: {
    fontSize: 16,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.2,
    lineHeight: 22,
  },

  valueLarge: {
    fontSize: 24,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.3,
    lineHeight: 32,
  },

  valueXLarge: {
    fontSize: 28,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.4,
    lineHeight: 36,
  },

  valueXXLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.5,
    lineHeight: 40,
  },

  change: {
    fontSize: 16,
    fontWeight: '700' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.2,
    lineHeight: 22,
  },

  metricLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    fontFamily: 'Helvetica',
    letterSpacing: 0.3,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
  },

  metricValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
};

