/**
 * PriceChart Component
 * 
 * A modern, clean price series chart component for displaying stock prices over time.
 * Features smooth gradients, subtle grid lines, and professional styling.
 */
import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';

export type PriceChartProps = {
  prices: Record<string, number>; // Date -> Price mapping
  isPositive?: boolean; // Whether the trend is positive (for color coding)
  height?: number; // Chart height in pixels
};

/**
 * Convert prices dict to sorted array
 */
const getPriceArray = (prices: Record<string, number>): { prices: number[]; dates: string[] } => {
  const sortedDates = Object.keys(prices).sort();
  const priceArray = sortedDates.map(date => prices[date]);
  return { prices: priceArray, dates: sortedDates };
};

/**
 * Format date for display
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * Format price for display
 */
const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const PriceChart: React.FC<PriceChartProps> = ({ 
  prices, 
  isPositive = true,
  height = 200,
}) => {
  const gradientId = useRef(`areaGradient-${Math.random().toString(36).substring(2, 11)}`).current;
  const { prices: priceArray, dates } = getPriceArray(prices);
  
  if (priceArray.length < 2) {
    return null;
  }

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 60; // Account for padding
  const chartHeight = height;
  
  // Padding for chart area
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  
  // Calculate price range
  const maxPrice = Math.max(...priceArray);
  const minPrice = Math.min(...priceArray);
  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.1; // 10% padding above and below
  
  // Generate path for price line
  const pathPoints = priceArray.map((price, index) => {
    const x = paddingLeft + (index / (priceArray.length - 1)) * plotWidth;
    const y = paddingTop + plotHeight - ((price - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * plotHeight;
    return `${x},${y}`;
  });
  const pathString = `M ${pathPoints.join(' L ')}`;
  
  // Generate area fill path
  const areaPath = `${pathString} L ${paddingLeft + plotWidth},${paddingTop + plotHeight} L ${paddingLeft},${paddingTop + plotHeight} Z`;
  
  // Generate grid lines (horizontal lines for price levels)
  const numGridLines = 4;
  const gridLines: Array<{ y: number; value: number }> = [];
  for (let i = 0; i <= numGridLines; i++) {
    const value = minPrice - pricePadding + ((priceRange + pricePadding * 2) / numGridLines) * i;
    const y = paddingTop + plotHeight - ((value - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * plotHeight;
    gridLines.push({ y, value });
  }
  
  // Generate Y-axis labels (price values)
  const yLabels = gridLines.map(({ value }) => formatPrice(value));
  
  // Generate X-axis labels (show first, middle, last dates)
  const xLabels: Array<{ x: number; date: string }> = [];
  if (dates.length > 0) {
    const indices = [0, Math.floor(dates.length / 2), dates.length - 1];
    indices.forEach((idx) => {
      const x = paddingLeft + (idx / (priceArray.length - 1)) * plotWidth;
      xLabels.push({ x, date: formatDate(dates[idx]) });
    });
  }
  
  // Gradient colors based on trend
  const gradientColor1 = isPositive ? colors.successLight : colors.warning;
  const gradientColor2 = isPositive ? colors.successLight : colors.warning;
  const lineColor = isPositive ? colors.successLight : colors.warning;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <Defs>
          {/* Gradient for area fill */}
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={gradientColor1} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={gradientColor2} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        
        {/* Grid lines */}
        {gridLines.map((line, index) => (
          <Path
            key={`grid-${index}`}
            d={`M ${paddingLeft} ${line.y} L ${paddingLeft + plotWidth} ${line.y}`}
            stroke={colors.ink}
            strokeWidth="0.5"
            strokeOpacity="0.06"
          />
        ))}
        
        {/* Area fill with gradient */}
        <Path
          d={areaPath}
          fill={`url(#${gradientId})`}
        />
        
        {/* Price line */}
        <Path
          d={pathString}
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Y-axis labels (price values) */}
        {gridLines.map((line, index) => (
          <SvgText
            key={`y-label-${index}`}
            x={paddingLeft - 8}
            y={line.y + 4}
            fontSize="10"
            fill={colors.inkMuted}
            textAnchor="end"
            fontWeight="500"
          >
            {yLabels[index]}
          </SvgText>
        ))}
        
        {/* X-axis labels (dates) */}
        {xLabels.map((label, index) => (
          <SvgText
            key={`x-label-${index}`}
            x={label.x}
            y={chartHeight - paddingBottom + 20}
            fontSize="10"
            fill={colors.inkMuted}
            textAnchor="middle"
            fontWeight="500"
          >
            {label.date}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

