/**
 * Color Palette
 * 
 * Central color palette for the entire application using neobrutalist design principles.
 * 
 * To switch color schemes:
 * 1. Uncomment the scheme you want to use
 * 2. Comment out the currently active scheme
 * 
 * Available schemes: default, ocean, sunset, forest, midnight
 */

// ============================================
// DEFAULT SCHEME (Yellow) - Currently Active
// ============================================
// export const colors = {
//   screenBg: '#FBBF24',
//   cardBg: '#F3F4F6',
//   ink: '#111827',
//   shadow: '#9CA3AF',
//   warning: '#EF4444',
//   success: '#10B981',
//   white: '#FFFFFF',
// };

// ============================================
// OCEAN SCHEME (Blue)
// ============================================
// export const colors = {
//   screenBg: '#3B82F6',
//   cardBg: '#DBEAFE',
//   ink: '#1E3A8A',
//   shadow: '#60A5FA',
//   warning: '#DC2626',
//   success: '#059669',
//   white: '#FFFFFF',
// };

// ============================================
// SUNSET SCHEME (Orange)
// ============================================
// export const colors = {
//   screenBg: '#FB923C',
//   cardBg: '#FED7AA',
//   ink: '#7C2D12',
//   shadow: '#FDBA74',
//   warning: '#DC2626',
//   success: '#15803D',
//   white: '#FFFFFF',
// };

// ============================================
// FOREST SCHEME (Green)
// ============================================
// export const colors = {
//   screenBg: '#22C55E',
//   cardBg: '#DCFCE7',
//   ink: '#14532D',
//   shadow: '#86EFAC',
//   warning: '#EF4444',
//   success: '#047857',
//   white: '#FFFFFF',
// };

// ============================================
// MODERN NEO-BRUTALIST "ONYX / PAPER" (Premium)
// ============================================
export const colors = {
  // Foundations - Refined with subtle warmth
  screenBg:  '#FAFAF9', // warmer paper with slight beige tint
  cardBg:    '#FFFFFF',
  cardBgElevated: '#FEFEFE', // subtle tint for depth
  ink:       '#0A0A0A', // deeper black for premium feel
  inkMuted:  '#525252', // refined muted for better hierarchy
  inkLight:  '#737373', // lighter text for tertiary info
  border:    '#0A0A0A', // bold outlines for brutalist feel
  borderLight: '#E5E5E5', // subtle borders for depth
  shadow:    '#0A0A0A', // primary shadow color
  shadowSecondary: '#1F1F1F', // secondary shadow layer
  white:     '#FFFFFF',

  // Brand neutrals (refined for premium feel)
  primary:   '#0A0A0A', // buttons/links default: black-on-paper
  secondary: '#1A1A1A', // hover/pressed states
  tertiary:  '#2A2A2A', // subtle highlights

  // Semantics (refined colors)
  success:   '#15803D', // deeper, more professional green
  successLight: '#16A34A', // brighter for highlights
  warning:   '#DC2626',
  warningLight: '#EF4444', // brighter for highlights

  // Accent colors (subtle but modern)
  accent:    '#6366F1', // subtle indigo for premium feel
  accentLight: '#818CF8',
  
  // Pastel tertiary accents (refined for modern use)
  pastelBlue:   '#DBEAFE',
  pastelMint:   '#D1FAE5',
  pastelLilac:  '#E9D5FF',
  pastelBlush:  '#FCE7F3',
  pastelMaize:  '#FEF3C7',
  
  // Surface colors for depth
  surface:   '#F9FAFB',
  surfaceElevated: '#FFFFFF',
  overlay:   'rgba(0, 0, 0, 0.4)', // for blur overlays
};
