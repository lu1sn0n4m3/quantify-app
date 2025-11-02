/**
 * TotalBalanceCard Widget
 * 
 * A finance widget card that displays the user's total balance with a line chart visualization.
 * Demonstrates the standardized dual-view pattern with small and expanded versions.
 * 
 * Used by: WidgetScreen (via widgetRegistry)
 * 
 * SMALL VERSION (expanded = false):
 * - Main balance value
 * - Simple line chart visualization
 * 
 * EXPANDED VERSION (expanded = true):
 * - Same as small version PLUS:
 * - Summary insight text
 * - Detailed analysis paragraphs
 * - Additional context and information
 * 
 * Widget Structure:
 * Built using NeoCard base component, which provides the standardized container,
 * styling, and expand functionality. Uses the standardized WidgetProps interface.
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NeoCard } from '../base/NeoCard';
import { colors } from '../../theme/colors';
import { currency } from '../../utils/format';
import { WidgetProps } from './widgetRegistry';

export const TotalBalanceCard: React.FC<WidgetProps> = ({ 
  onExpand, 
  expanded = false,
}) => {
  return (
    <NeoCard 
      title="Total Balance" 
      onExpand={onExpand}
    >
      <Text style={styles.value}>{currency(128450)}</Text>
      <Svg viewBox="0 0 300 140" style={[styles.chart, expanded && styles.chartExpanded]}>
        <Path 
          d="M0,100 C60,70 120,110 180,80 240,50 300,100 300,100" 
          stroke={colors.ink} 
          strokeWidth={3} 
          fill="none" 
        />
      </Svg>
      
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.summary}>
            Steady monthly growth driven by tech and energy sectors.
          </Text>
          <Text style={styles.expandedText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel dolor eget massa viverra convallis. Integer ac lacinia nisl. Nulla facilisi. Cras imperdiet nunc a nibh tristique, vitae tempus magna consequat. Morbi id gravida nibh. Aliquam erat volutpat.
          </Text>
          <Text style={styles.expandedText}>
            Vivamus vulputate viverra sapien, ac feugiat magna congue vitae. Fusce porttitor semper enim. Praesent at odio eget libero auctor hendrerit. Sed ultricies, leo id interdum porttitor, ipsum lorem eleifend neque, at iaculis purus nisl id erat.
          </Text>
        </View>
      )}
    </NeoCard>
  );
};

const styles = StyleSheet.create({
  value: { 
    fontWeight: '800', 
    fontSize: 24, 
    color: colors.ink,
    marginBottom: 8,
  },
  chart: { 
    height: 120, 
    width: '100%',
  },
  chartExpanded: {
    marginBottom: 12,
  },
  expandedContent: {
    marginTop: 8,
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

