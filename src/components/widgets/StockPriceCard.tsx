/**
 * StockPriceCard Widget
 * 
 * A finance widget that displays stock price information with a price chart.
 * 
 * NEW ARCHITECTURE:
 * - Widget defines its payload type (StockPriceCardPayload)
 * - Widget generates title from payload (ticker + name)
 * - Widget defines pages for condensed view
 * - Widget defines expanded view (completely separate layout)
 * - NeoCard handles all pagination, page indicator, and expand button
 * 
 * PAYLOAD STRUCTURE:
 * {
 *   ticker: string,           // e.g., "AAPL"
 *   name: string,             // e.g., "Apple Inc."
 *   prices: {                 // Dict with date keys and price values
 *     "2024-01-01": 145.50,
 *     "2024-01-02": 146.20,
 *     ...
 *   },
 *   financial_ratios: {       // Dict with ratio names and values
 *     "P/E Ratio": 28.45,
 *     "Market Cap": "$2.89T",
 *     ...
 *   },
 *   summary: string           // Text summarizing the data
 * }
 * 
 * CONDENSED VIEW PAGES:
 * - Page 1: Current price, price change, price chart
 * - Page 2: Financial ratios grid
 * - Page 3: Analysis summary text
 * 
 * EXPANDED VIEW:
 * - All content in vertical scroll
 * - Can have richer charts, more detailed visualizations
 * - Completely separate layout from condensed view
 */
import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { PriceChart } from '../core';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import type { WidgetBuilder } from './widgetRegistry';
import { sharedWidgetStyles } from './sharedWidgetStyles';

/**
 * StockPriceCard Payload Type
 * Defines the JSON structure expected from the API
 */
export type StockPriceCardPayload = {
  ticker: string;
  name: string;
  prices: Record<string, number>; // Date -> Price mapping
  financial_ratios: Record<string, string | number>; // Ratio name -> Value mapping
  summary: string;
};

/**
 * Generate title from payload (e.g., "AAPL - Apple Inc.")
 */
const getTitle = (data: StockPriceCardPayload): string => {
  return `${data.ticker} - ${data.name}`;
};

/**
 * Convert prices dict to array for charting
 * Returns array of prices sorted by date
 */
const getPriceArray = (prices: Record<string, number>): number[] => {
  const sortedDates = Object.keys(prices).sort();
  return sortedDates.map(date => prices[date]);
};

/**
 * Calculate price change from prices dict
 */
const getPriceChange = (prices: Record<string, number>): { 
  current: number; 
  previous: number; 
  change: number; 
  changePercent: string;
  isPositive: boolean;
} => {
  const priceArray = getPriceArray(prices);
  if (priceArray.length === 0) {
    return { current: 0, previous: 0, change: 0, changePercent: '0.00', isPositive: true };
  }
  const current = priceArray[priceArray.length - 1];
  const previous = priceArray[0];
  const change = current - previous;
  const changePercent = ((change / previous) * 100).toFixed(2);
  return {
    current,
    previous,
    change,
    changePercent,
    isPositive: change >= 0,
  };
};

/**
 * Generate SVG path for price chart (condensed view)
 */
const generatePriceChartPath = (prices: Record<string, number>): string => {
  const priceArray = getPriceArray(prices);
  if (priceArray.length < 2) return '';
  
  const width = 300;
  const height = 120;
  const padding = 10;
  const max = Math.max(...priceArray);
  const min = Math.min(...priceArray);
  const range = max - min || 1;
  
  const points = priceArray.map((price, index) => {
    const x = (index / (priceArray.length - 1)) * width;
    const y = height - padding - ((price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });
  
  return `M ${points.join(' L ')}`;
};

/**
 * Render Page 1: Price Chart
 */
const renderPricePage = (data: StockPriceCardPayload): React.ReactElement => {
  const priceInfo = getPriceChange(data.prices);
  const chartPath = generatePriceChartPath(data.prices);
  
  return (
    <View style={styles.pageInner}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${priceInfo.current.toFixed(2)}</Text>
        <Text style={[styles.change, priceInfo.isPositive ? styles.positive : styles.negative]}>
          {priceInfo.isPositive ? '+' : ''}{priceInfo.changePercent}%
        </Text>
      </View>
      <View style={styles.chartArea}>
        <Svg viewBox="0 0 300 120" style={styles.chart}>
          <Path 
            d={chartPath} 
            stroke={priceInfo.isPositive ? colors.successLight : colors.warning} 
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round" 
            fill="none" 
          />
        </Svg>
      </View>
    </View>
  );
};

/**
 * Render Page 2: Financial Ratios
 */
const renderRatiosPage = (
  data: StockPriceCardPayload
): React.ReactElement => {
  const ratios = Object.entries(data.financial_ratios);
  
  return (
    <View style={styles.pageInner}>
      <Text style={styles.sectionTitleCompact}>Financial Ratios</Text>
      <View style={styles.ratiosGrid}>
        {ratios.map(([label, value], index) => (
          <View key={index} style={styles.ratioItem}>
            <Text style={styles.ratioLabel}>{label}</Text>
            <Text style={styles.ratioValue}>{String(value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * Render Page 3: Analysis Summary
 */
const renderSummaryPage = (data: StockPriceCardPayload, isCondensed: boolean = false): React.ReactElement => {
  return (
    <View style={styles.pageInner}>
      <Text style={styles.sectionTitleCompact}>Analysis Summary</Text>
      {isCondensed ? (
        <ScrollView 
          style={styles.summaryContainerCondensed}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <Text style={styles.summaryText}>{data.summary}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.summaryText}>{data.summary}</Text>
      )}
    </View>
  );
};

/**
 * Render condensed view pages
 */
const renderCondensedPages = (
  data: StockPriceCardPayload
): React.ReactElement[] => {
  return [
    renderPricePage(data),
    renderRatiosPage(data),
    renderSummaryPage(data, true),
  ];
};

/**
 * Render expanded view with detailed price chart
 */
const renderExpandedView = (data: StockPriceCardPayload): React.ReactElement => {
  const priceInfo = getPriceChange(data.prices);
  const priceArray = getPriceArray(data.prices);
  
  // Calculate additional metrics
  const highestPrice = Math.max(...priceArray);
  const lowestPrice = Math.min(...priceArray);
  const avgPrice = priceArray.reduce((a, b) => a + b, 0) / priceArray.length;
  const volatility = priceArray.length > 1 
    ? Math.sqrt(priceArray.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / priceArray.length)
    : 0;
  
  return (
    <View style={styles.expandedContent}>
      {/* Detailed Price Chart Section */}
      <View style={styles.expandedSection}>
        <View style={styles.expandedHeader}>
          <View>
            <Text style={styles.expandedPrice}>${priceInfo.current.toFixed(2)}</Text>
            <Text style={[styles.expandedChange, priceInfo.isPositive ? styles.positive : styles.negative]}>
              {priceInfo.isPositive ? '+' : ''}{priceInfo.changePercent}% 
              ({priceInfo.isPositive ? '+' : ''}${priceInfo.change.toFixed(2)})
            </Text>
          </View>
        </View>
        
        {/* Modern Price Chart */}
        <View style={styles.detailedChartContainer}>
          <PriceChart 
            prices={data.prices} 
            isPositive={priceInfo.isPositive}
            height={200}
          />
        </View>
        
        {/* Additional Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>High</Text>
            <Text style={styles.metricValue}>${highestPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Low</Text>
            <Text style={styles.metricValue}>${lowestPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Average</Text>
            <Text style={styles.metricValue}>${avgPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Volatility</Text>
            <Text style={styles.metricValue}>${volatility.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {/* Financial Ratios Section */}
      <View style={styles.expandedSection}>
        <Text style={styles.sectionTitle}>Financial Ratios</Text>
        <View style={styles.expandedRatiosGrid}>
          {Object.entries(data.financial_ratios).map(([label, value], index) => (
            <View key={index} style={styles.expandedRatioItem}>
              <Text style={styles.ratioLabel}>{label}</Text>
              <Text style={styles.ratioValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {/* Summary Section */}
      <View style={[styles.expandedSection, styles.summarySectionExpanded]}>
        {renderSummaryPage(data, false)}
      </View>
    </View>
  );
};

export const buildStockPriceCard: WidgetBuilder<StockPriceCardPayload> = (data) => {
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    gap: 16,
  },
  price: { 
    ...typography.valueXLarge,
    color: colors.ink,
  },
  change: {
    ...typography.change,
  },
  positive: {
    color: colors.successLight,
  },
  negative: {
    color: colors.warning,
  },
  chartArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 4,
  },
  chart: { 
    height: 120, 
    width: '100%',
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.ink,
    marginBottom: 20,
    fontSize: 18,
    letterSpacing: -0.4,
  },
  sectionTitleCompact: {
    ...typography.heading,
    color: colors.ink,
    marginBottom: 12,
    fontSize: 18,
    letterSpacing: -0.4,
  },
  ratiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  ratioItem: {
    width: '31%',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ratioLabel: {
    ...typography.metricLabel,
    color: colors.inkMuted,
    marginBottom: 4,
    opacity: 1,
    fontSize: 10,
  },
  ratioValue: {
    ...typography.value,
    color: colors.ink,
    letterSpacing: -0.3,
    fontSize: 13,
  },
  summaryContainerCondensed: {
    alignSelf: 'center',
    width: '100%',
    maxHeight: 180,
  },
  summaryText: {
    ...typography.body,
    color: colors.inkMuted,
    lineHeight: 24,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  expandedContent: {
    width: '100%',
  },
  expandedSection: {
    ...sharedWidgetStyles.expandedSection,
  },
  expandedHeader: {
    marginBottom: 12,
  },
  expandedPrice: {
    ...typography.headingLarge,
    color: colors.ink,
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  expandedChange: {
    ...typography.change,
  },
  detailedChartContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  detailedChart: {
    width: '100%',
    aspectRatio: 1.75, // Maintain chart proportions
    minHeight: 180,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metricItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  metricLabel: {
    ...typography.metricLabel,
    color: colors.inkMuted,
    marginBottom: 4,
    opacity: 1,
    fontSize: 10,
  },
  metricValue: {
    ...typography.metricValue,
    color: colors.ink,
    letterSpacing: -0.3,
    fontSize: 13,
  },
  expandedRatiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expandedRatioItem: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  divider: {
    ...sharedWidgetStyles.divider,
  },
  summarySectionExpanded: {
    paddingBottom: 32,
  },
});
