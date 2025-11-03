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
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ink,
    opacity: 0.3,
  },
  dotActive: {
    opacity: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

