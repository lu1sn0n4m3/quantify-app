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
// NEO-BRUTALIST "ONYX / PAPER" (Professional)
// ============================================
export const colors = {
  // Foundations
  screenBg:  '#F5F5F4', // paper-warm, not pure white
  cardBg:    '#FFFFFF',
  ink:       '#0B0B0B', // nearly-black, crisp on light
  inkMuted:  '#4B5563', // subdued body/captions
  border:    '#0B0B0B', // bold outlines for brutalist feel
  shadow:    '#0B0B0B', // use low blur + offset, not opacity soup
  white:     '#FFFFFF',

  // Brand neutrals (primary interaction states stay neutral)
  primary:   '#111111', // buttons/links default: black-on-paper
  secondary: '#1F2937', // hover/pressed/dark text on light chips

  // Semantics (serious, not candy)
  success:   '#16A34A',
  warning:   '#DC2626',

  // Pastel tertiary accents (for tags, badges, empty-state art)
  pastelBlue:   '#A7C7E7',
  pastelMint:   '#BEE6D3',
  pastelLilac:  '#D9C8FF',
  pastelBlush:  '#F7C5CC',
  pastelMaize:  '#F6E7A1',
};
