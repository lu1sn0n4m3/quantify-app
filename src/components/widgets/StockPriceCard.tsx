/**
 * StockPriceCard Widget
 * 
 * A finance widget that displays stock price information with a price chart.
 * Shows simulated stock data with price movement visualization. In expanded view,
 * displays detailed financial ratios and analysis summary.
 * 
 * Used by: WidgetScreen (via widgetRegistry)
 * 
 * SMALL VERSION (expanded = false):
 * - Stock ticker and current price
 * - Price change percentage
 * - Mini price chart
 * 
 * EXPANDED VERSION (expanded = true):
 * - Same as small version PLUS:
 * - Financial ratios (P/E, Market Cap, etc.)
 * - Detailed summary analysis
 * 
 * Note: Data is currently simulated for demonstration purposes.
 */
import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { NeoCard } from '../base/NeoCard';
import { colors } from '../../theme/colors';
import { WidgetProps } from './widgetRegistry';

// Simulate stock price data
const generatePriceData = () => {
  const basePrice = 145.50;
  const points = 20;
  let currentPrice = basePrice;
  const prices = [currentPrice];
  
  for (let i = 1; i < points; i++) {
    const change = (Math.random() - 0.48) * 5; // Slight upward bias
    currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice + change));
    prices.push(currentPrice);
  }
  
  return prices;
};

export const StockPriceCard: React.FC<WidgetProps> = ({ 
  onExpand, 
  expanded = false,
}) => {
  // Generate stable price data using useMemo
  const priceData = useMemo(() => generatePriceData(), []);
  const currentPrice = priceData[priceData.length - 1];
  const previousPrice = priceData[0];
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;
  
  // Convert price data to SVG path
  const generatePath = () => {
    const width = 300;
    const height = 120;
    const padding = 10;
    const max = Math.max(...priceData);
    const min = Math.min(...priceData);
    const range = max - min;
    
    const points = priceData.map((price, index) => {
      const x = (index / (priceData.length - 1)) * width;
      const y = height - padding - ((price - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <NeoCard 
      title="AAPL - Apple Inc." 
      onExpand={onExpand}
    >
      {/* Current Price */}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
        <Text style={[styles.change, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? '+' : ''}{priceChangePercent}%
        </Text>
      </View>

      {/* Price Chart */}
      <Svg viewBox="0 0 300 120" style={[styles.chart, expanded && styles.chartExpanded]}>
        <Path 
          d={generatePath()} 
          stroke={isPositive ? '#16a34a' : '#dc2626'} 
          strokeWidth={3} 
          fill="none" 
        />
      </Svg>
      
      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Financial Ratios</Text>
          
          <View style={styles.ratiosGrid}>
            <View style={styles.ratioItem}>
              <Text style={styles.ratioLabel}>P/E Ratio</Text>
              <Text style={styles.ratioValue}>28.45</Text>
            </View>
            <View style={styles.ratioItem}>
              <Text style={styles.ratioLabel}>Market Cap</Text>
              <Text style={styles.ratioValue}>$2.89T</Text>
            </View>
            <View style={styles.ratioItem}>
              <Text style={styles.ratioLabel}>Dividend Yield</Text>
              <Text style={styles.ratioValue}>0.52%</Text>
            </View>
            <View style={styles.ratioItem}>
              <Text style={styles.ratioLabel}>52 Week High</Text>
              <Text style={styles.ratioValue}>$198.23</Text>
            </View>
            <View style={styles.ratioItem}>
              <Text style={styles.ratioLabel}>52 Week Low</Text>
              <Text style={styles.ratioValue}>$124.17</Text>
            </View>
            <View style={styles.ratioItem}>
              <Text style={styles.ratioLabel}>Volume</Text>
              <Text style={styles.ratioValue}>58.3M</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Analysis Summary</Text>
          <Text style={styles.summaryText}>
            Apple continues to show strong performance in the tech sector, with solid fundamentals 
            and consistent revenue growth. The stock is trading near its historical average P/E ratio, 
            suggesting fair valuation. Recent product launches and expanding services revenue provide 
            positive momentum for long-term growth.
          </Text>
          <Text style={styles.summaryText}>
            Market sentiment remains bullish with strong institutional support. Consider the company's 
            innovation pipeline and ecosystem strength as key factors in maintaining competitive advantage.
          </Text>
        </View>
      )}
    </NeoCard>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    gap: 12,
  },
  price: { 
    fontWeight: '800', 
    fontSize: 28, 
    color: colors.ink,
  },
  change: {
    fontSize: 18,
    fontWeight: '700',
  },
  positive: {
    color: '#16a34a',
  },
  negative: {
    color: '#dc2626',
  },
  chart: { 
    height: 120, 
    width: '100%',
    marginTop: 4,
  },
  chartExpanded: {
    marginBottom: 16,
  },
  expandedContent: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
  },
  ratiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  ratioItem: {
    width: '47%',
    backgroundColor: colors.screenBg,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  ratioLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
    opacity: 0.7,
    marginBottom: 4,
  },
  ratioValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  divider: {
    height: 2,
    backgroundColor: colors.ink,
    marginVertical: 16,
    opacity: 0.3,
  },
  summaryText: {
    color: colors.ink,
    lineHeight: 20,
    marginBottom: 12,
    fontSize: 14,
  },
});

