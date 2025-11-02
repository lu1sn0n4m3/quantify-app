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
import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, View, Pressable, Modal, Dimensions } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
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
  // State for P/E Ratio popup
  const [showPePopup, setShowPePopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Generate stable price data using useMemo
  const priceData = useMemo(() => generatePriceData(), []);
  const currentPrice = priceData[priceData.length - 1];
  const previousPrice = priceData[0];
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  // Generate P/E ratio data for last 4 quarters
  const peRatioData = useMemo(() => {
    return [26.8, 27.2, 28.1, 28.45]; // Q1, Q2, Q3, Q4 (current)
  }, []);

  // Handle P/E Ratio box press
  const handlePeRatioPressIn = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const popupWidth = 180;
    const popupHeight = 140;
    
    const x = Math.max(10, Math.min(pageX - popupWidth / 2, screenWidth - popupWidth - 10));
    const y = Math.max(10, pageY - popupHeight - 80);
    
    setPopupPosition({ x, y });
    setShowPePopup(true);
  };

  const handlePeRatioPressOut = () => {
    setShowPePopup(false);
  };

  // Generate P/E ratio chart path
  const generatePeRatioChartPath = () => {
    const width = 160;
    const height = 80;
    const padding = 10;
    const max = Math.max(...peRatioData);
    const min = Math.min(...peRatioData);
    const range = max - min || 1; // Avoid division by zero
    
    const points = peRatioData.map((value, index) => {
      const x = padding + (index / (peRatioData.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };
  
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
    <>
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
            <Pressable
              style={styles.ratioItem}
              onPressIn={handlePeRatioPressIn}
              onPressOut={handlePeRatioPressOut}
            >
              <Text style={styles.ratioLabel}>P/E Ratio</Text>
              <Text style={styles.ratioValue}>28.45</Text>
            </Pressable>
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
    
    {/* P/E Ratio Popup Modal */}
    <Modal
      visible={showPePopup}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowPePopup(false)}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View
          style={[
            styles.pePopup,
            {
              left: popupPosition.x,
              top: popupPosition.y,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.popupTitle}>P/E Ratio (Last 4 Quarters)</Text>
          <Svg viewBox="0 0 160 80" style={styles.popupChart}>
            <Path
              d={generatePeRatioChartPath()}
              stroke={colors.ink}
              strokeWidth={2}
              fill="none"
            />
            {/* Add dots at data points */}
            {peRatioData.map((value, index) => {
              const width = 160;
              const height = 80;
              const padding = 10;
              const max = Math.max(...peRatioData);
              const min = Math.min(...peRatioData);
              const range = max - min || 1;
              const x = padding + (index / (peRatioData.length - 1)) * (width - padding * 2);
              const y = height - padding - ((value - min) / range) * (height - padding * 2);
              return (
                <Rect
                  key={index}
                  x={x - 3}
                  y={y - 3}
                  width={6}
                  height={6}
                  fill={colors.ink}
                />
              );
            })}
          </Svg>
          <View style={styles.popupLabels}>
            {peRatioData.map((value, index) => (
              <Text key={index} style={styles.popupLabel}>
                Q{index + 1}: {value.toFixed(1)}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Modal>
    </>
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
  pePopup: {
    position: 'absolute',
    width: 180,
    backgroundColor: colors.cardBg,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.4,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
    zIndex: 1000,
  },
  popupTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  popupChart: {
    height: 80,
    width: '100%',
    marginBottom: 8,
  },
  popupLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  popupLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.ink,
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

