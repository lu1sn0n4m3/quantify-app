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
          strokeWidth={1.5} 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"
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
            {data.summary && <Text style={styles.summary}>{data.summary}</Text>}
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
    paddingHorizontal: 0,
  },
  value: { 
    ...typography.valueXXLarge,
    color: colors.ink,
    marginBottom: 24,
    letterSpacing: -0.8,
  },
  chart: { 
    height: 140, 
    width: '100%',
    marginTop: 8,
  },
  chartExpanded: {
    marginBottom: 24,
    marginTop: 16,
  },
  expandedContent: {
    // Expanded view layout
  },
  expandedSection: {
    width: '100%',
    paddingTop: 8,
  },
  summary: {
    ...typography.body,
    color: colors.inkMuted,
    marginBottom: 16,
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  expandedText: {
    ...typography.body,
    color: colors.inkMuted,
    lineHeight: 24,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ink,
    marginVertical: 32,
    opacity: 0.15,
    marginHorizontal: 0,
    alignSelf: 'stretch',
  },
});
