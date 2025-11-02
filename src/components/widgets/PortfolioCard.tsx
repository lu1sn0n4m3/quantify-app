/**
 * PortfolioCard Widget
 * 
 * Example widget showing portfolio performance. Demonstrates the standardized
 * dual-view pattern and how easy it is to add new widgets to the modular system.
 * 
 * Used by: WidgetScreen (via widgetRegistry)
 * 
 * SMALL VERSION (expanded = false):
 * - Portfolio value and gain percentage
 * - Quick stats in a compact row layout
 * 
 * EXPANDED VERSION (expanded = true):
 * - Same as small version PLUS:
 * - Performance summary
 * - Detailed sector breakdown
 * - Additional insights
 * 
 * To add this widget: Just create the component, add to widgetRegistry.ts, done!
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NeoCard } from '../base/NeoCard';
import { colors } from '../../theme/colors';
import { currency } from '../../utils/format';
import { WidgetProps } from './widgetRegistry';

export const PortfolioCard: React.FC<WidgetProps> = ({ 
  onExpand, 
  expanded = false,
}) => {
  return (
    <NeoCard 
      title="Portfolio Performance" 
      onExpand={onExpand}
    >
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Value</Text>
          <Text style={styles.statValue}>{currency(45200)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Gain</Text>
          <Text style={[styles.statValue, styles.positive]}>+12.5%</Text>
        </View>
      </View>
      
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.summary}>
            Your portfolio has shown strong performance this quarter.
          </Text>
          <Text style={styles.expandedText}>
            Top performers: Tech sector (+18%), Healthcare (+14%). Your diversified 
            strategy is working well with balanced exposure across multiple sectors.
          </Text>
        </View>
      )}
    </NeoCard>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.ink,
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.ink,
  },
  positive: {
    color: '#16a34a',
  },
  expandedContent: {
    marginTop: 16,
  },
  summary: {
    color: colors.ink,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  expandedText: {
    color: colors.ink,
    lineHeight: 20,
    marginBottom: 12,
    fontSize: 14,
  },
});

