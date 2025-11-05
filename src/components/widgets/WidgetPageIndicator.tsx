/**
 * WidgetPageIndicator Component
 * 
 * A reusable pagination indicator for widgets that support horizontal paging.
 * Displays dots to show current page position and total pages.
 * 
 * Usage:
 * ```tsx
 * <WidgetPageIndicator currentPage={currentPage} totalPages={3} />
 * ```
 * 
 * Used by: Widgets that implement horizontal pagination (e.g., StockPriceCard)
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type WidgetPageIndicatorProps = {
  currentPage: number;  // Zero-indexed current page
  totalPages: number;   // Total number of pages
};

export const WidgetPageIndicator: React.FC<WidgetPageIndicatorProps> = ({
  currentPage,
  totalPages,
}) => {
  if (totalPages <= 1) return null; // Don't show if only one page

  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentPage && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.ink,
    opacity: 0.2,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  dotActive: {
    opacity: 0.9,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: colors.accent,
    // Subtle shadow for modern depth
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});

