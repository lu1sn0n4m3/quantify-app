/**
 * TotalBalanceCard Widget
 * 
 * A finance widget card that displays the user's total balance with a line chart visualization.
 * 
 * NEW ARCHITECTURE:
 * - Widget defines its payload type (TotalBalanceCardPayload)
 * - Widget generates title from payload
 * - Widget defines pages for condensed view (single page)
 * - Widget defines expanded view (completely separate layout)
 * - NeoCard handles all pagination, page indicator, and expand button
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NeoCard } from '../base/NeoCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { currency } from '../../utils/format';
import { WidgetProps } from './widgetRegistry';

/**
 * TotalBalanceCard Payload Type
 * Defines the JSON structure expected from the API
 */
export type TotalBalanceCardPayload = {
  balance: number;
  summary?: string; // Optional summary text for expanded view
};

/**
 * Generate title from payload
 */
const getTitle = (data: TotalBalanceCardPayload): string => {
  return 'Total Balance';
};

/**
 * Generate chart path from balance data
 * For now, uses a simple curve - in future could use historical data from payload
 */
const generateChartPath = (): string => {
  return 'M0,100 C60,70 120,110 180,80 240,50 300,100 300,100';
};

/**
 * Render condensed view (single page)
 */
const renderCondensedPages = (data: TotalBalanceCardPayload): React.ReactElement[] => {
  return [
    <View key="main" style={styles.pageInner}>
      <Text style={styles.value}>{currency(data.balance)}</Text>
      <Svg viewBox="0 0 300 140" style={styles.chart}>
        <Path 
          d={generateChartPath()} 
          stroke={colors.ink} 
          strokeWidth={3} 
          fill="none" 
        />
      </Svg>
    </View>
  ];
};

/**
 * Render expanded view (completely separate layout)
 */
const renderExpandedView = (data: TotalBalanceCardPayload): React.ReactElement => {
  return (
    <View style={styles.expandedContent}>
      <View style={styles.expandedSection}>
        <Text style={styles.value}>{currency(data.balance)}</Text>
        <Svg viewBox="0 0 300 140" style={[styles.chart, styles.chartExpanded]}>
          <Path 
            d={generateChartPath()} 
            stroke={colors.ink} 
            strokeWidth={3} 
            fill="none" 
          />
        </Svg>
      </View>
      
      {data.summary && (
        <>
          <View style={styles.divider} />
          <View style={styles.expandedSection}>
            <Text style={styles.summary}>{data.summary}</Text>
            <Text style={styles.expandedText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel dolor eget massa viverra convallis. Integer ac lacinia nisl. Nulla facilisi. Cras imperdiet nunc a nibh tristique, vitae tempus magna consequat. Morbi id gravida nibh. Aliquam erat volutpat.
            </Text>
            <Text style={styles.expandedText}>
              Vivamus vulputate viverra sapien, ac feugiat magna congue vitae. Fusce porttitor semper enim. Praesent at odio eget libero auctor hendrerit. Sed ultricies, leo id interdum porttitor, ipsum lorem eleifend neque, at iaculis purus nisl id erat.
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

/**
 * TotalBalanceCard Component
 */
export const TotalBalanceCard: React.FC<WidgetProps<TotalBalanceCardPayload>> = ({ 
  data,
  onExpand, 
  expanded = false,
}) => {
  const title = getTitle(data);
  const condensedPages = renderCondensedPages(data);
  const expandedViewContent = renderExpandedView(data);

  return (
    <NeoCard
      title={title}
      onExpand={onExpand}
      expanded={expanded}
      condensedPages={expanded ? [] : condensedPages}
      expandedView={expandedViewContent}
    />
  );
};

const styles = StyleSheet.create({
  pageInner: {
    width: '100%',
    paddingHorizontal: 14,
  },
  value: { 
    ...typography.valueLarge,
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
    // Expanded view layout
  },
  expandedSection: {
    width: '100%',
  },
  divider: {
    height: 2,
    backgroundColor: colors.ink,
    marginVertical: 16,
    opacity: 0.3,
    marginHorizontal: 14,
    alignSelf: 'stretch',
  },
  summary: {
    ...typography.body,
    color: colors.ink,
    marginBottom: 12,
    fontWeight: '600',
  },
  expandedText: {
    ...typography.body,
    color: colors.ink,
    lineHeight: 20,
    marginBottom: 12,
  },
});
