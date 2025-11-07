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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { currency } from '../../utils/format';
import type { WidgetBuilder } from './widgetRegistry';
import { sharedWidgetStyles } from './sharedWidgetStyles';

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
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export const buildTotalBalanceCard: WidgetBuilder<TotalBalanceCardPayload> = (data) => {
  return {
    title: getTitle(data),
    condensedPages: renderCondensedPages(data),
    expandedContent: renderExpandedView(data),
  };
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
    width: '100%',
  },
  expandedSection: {
    ...sharedWidgetStyles.expandedSection,
  },
  summary: {
    ...typography.body,
    color: colors.inkMuted,
    marginBottom: 16,
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  divider: {
    ...sharedWidgetStyles.divider,
  },
});
