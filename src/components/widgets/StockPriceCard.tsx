/**
 * StockPriceCard Widget — Refined Version
 * Clean, modern, animated price visualization.
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, Line } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { sharedWidgetStyles } from './sharedWidgetStyles';
import type { WidgetBuilder } from './widgetRegistry';

// Animated SVG path
const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Payload Type
 */
export type StockPriceCardPayload = {
  ticker: string;
  name: string;
  prices: Record<string, number>;
  financial_ratios: Record<string, string | number>;
  summary: string;
};

/**
 * Generate widget title
 */
const getTitle = (data: StockPriceCardPayload): string => `${data.ticker} - ${data.name}`;

/**
 * Convert prices to ordered array
 */
const getPriceArray = (prices: Record<string, number>): number[] => {
  const sorted = Object.keys(prices).sort();
  return sorted.map(d => prices[d]);
};

/**
 * Compute price changes
 */
const getPriceChange = (prices: Record<string, number>) => {
  const arr = getPriceArray(prices);
  if (arr.length < 2)
    return { current: 0, previous: 0, change: 0, changePercent: '0.00', isPositive: true };

  const current = arr[arr.length - 1];
  const previous = arr[0];
  const change = current - previous;
  const pct = ((change / previous) * 100).toFixed(2);
  return { current, previous, change, changePercent: pct, isPositive: change >= 0 };
};

/**
 * Animated Chart Component
 */
const AnimatedPriceChart = ({
  prices,
  isPositive,
}: {
  prices: Record<string, number>;
  isPositive: boolean;
}) => {
  const priceArray = Object.entries(prices)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, p]) => p);

  const width = 300;
  const height = 140;
  const padding = 12;
  const max = Math.max(...priceArray);
  const min = Math.min(...priceArray);
  const range = max - min || 1;

  const points = priceArray.map((p, i) => {
    const x = (i / (priceArray.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((p - min) / range) * (height - padding * 2);
    return [x, y];
  });

  const d = `M ${points.map(([x, y]) => `${x},${y}`).join(' L ')}`;
  const last = points[points.length - 1];
  const color = isPositive ? '#26A65B' : '#D64541';

  const progress = useSharedValue(0);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: (1 - progress.value) * 1000,
  }));

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  return (
    <View style={styles.chartWrapper}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Faint gridlines */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <Line
            key={i}
            x1={padding}
            x2={width - padding}
            y1={height * f}
            y2={height * f}
            stroke="#999"
            strokeOpacity={0.05}
            strokeWidth={1}
          />
        ))}

        {/* Gradient area under curve */}
        <Path
          d={`${d} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
          fill="url(#chartGradient)"
          opacity={0.7}
        />

        {/* Animated line */}
        <AnimatedPath
          d={d}
          stroke={color}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="1000"
          animatedProps={animatedProps}
        />

        {/* Last point marker */}
        <Circle cx={last[0]} cy={last[1]} r={3.5} fill={color} opacity={0.9} />
      </Svg>
    </View>
  );
};

/**
 * Condensed View: Page 1 (Price + Chart)
 */
const renderPricePage = (data: StockPriceCardPayload) => {
  const info = getPriceChange(data.prices);

  return (
    <View style={styles.pageInner}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${info.current.toFixed(2)}</Text>
        <Text style={[styles.change, info.isPositive ? styles.positive : styles.negative]}>
          {info.isPositive ? '+' : ''}
          {info.changePercent}%
        </Text>
      </View>
      <AnimatedPriceChart prices={data.prices} isPositive={info.isPositive} />
    </View>
  );
};

/**
 * Condensed View: Page 2 (Ratios Grid)
 */
const renderRatiosPage = (data: StockPriceCardPayload) => {
  const ratios = Object.entries(data.financial_ratios);

  return (
    <View style={styles.pageInner}>
      <Text style={styles.sectionTitleCompact}>Financial Ratios</Text>
      <View style={styles.ratiosGrid}>
        {ratios.map(([label, value], i) => (
          <View key={i} style={styles.ratioItem}>
            <Text style={styles.ratioLabel}>{label}</Text>
            <Text style={styles.ratioValue}>{String(value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * Condensed View: Page 3 (Summary)
 */
const renderSummaryPage = (data: StockPriceCardPayload) => (
  <View style={styles.pageInner}>
    <Text style={styles.sectionTitleCompact}>Analysis Summary</Text>
    <ScrollView
      style={styles.summaryContainerCondensed}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <Text style={styles.summaryText}>{data.summary}</Text>
    </ScrollView>
  </View>
);

/**
 * Condensed View Pages
 */
const renderCondensedPages = (data: StockPriceCardPayload) => [
  renderPricePage(data),
  renderRatiosPage(data),
  renderSummaryPage(data),
];

/**
 * Expanded View (Detailed)
 */
const renderExpandedView = (data: StockPriceCardPayload) => {
  const info = getPriceChange(data.prices);
  const arr = getPriceArray(data.prices);
  const high = Math.max(...arr);
  const low = Math.min(...arr);
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  const vol =
    arr.length > 1
      ? Math.sqrt(arr.reduce((s, p) => s + Math.pow(p - avg, 2), 0) / arr.length)
      : 0;

  return (
    <View style={styles.expandedContent}>
      <View style={styles.expandedSection}>
        <View style={styles.expandedHeader}>
          <Text style={styles.expandedPrice}>${info.current.toFixed(2)}</Text>
          <Text style={[styles.expandedChange, info.isPositive ? styles.positive : styles.negative]}>
            {info.isPositive ? '+' : ''}
            {info.changePercent}% ({info.isPositive ? '+' : ''}
            ${info.change.toFixed(2)})
          </Text>
        </View>

        <AnimatedPriceChart prices={data.prices} isPositive={info.isPositive} />

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>High</Text>
            <Text style={styles.metricValue}>${high.toFixed(2)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Low</Text>
            <Text style={styles.metricValue}>${low.toFixed(2)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Average</Text>
            <Text style={styles.metricValue}>${avg.toFixed(2)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Volatility</Text>
            <Text style={styles.metricValue}>${vol.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.expandedSection}>
        <Text style={styles.sectionTitle}>Financial Ratios</Text>
        <View style={styles.expandedRatiosGrid}>
          {Object.entries(data.financial_ratios).map(([label, value], i) => (
            <View key={i} style={styles.expandedRatioItem}>
              <Text style={styles.ratioLabel}>{label}</Text>
              <Text style={styles.ratioValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={[styles.expandedSection, styles.summarySectionExpanded]}>
        <Text style={styles.sectionTitle}>Analysis Summary</Text>
        <Text style={styles.summaryText}>{data.summary}</Text>
      </View>
    </View>
  );
};

/**
 * Widget Builder
 */
export const buildStockPriceCard: WidgetBuilder<StockPriceCardPayload> = data => ({
  title: getTitle(data),
  condensedPages: renderCondensedPages(data),
  expandedContent: renderExpandedView(data),
});

/**
 * Styles
 */
const styles = StyleSheet.create({
  pageInner: {
    width: '100%',
    paddingHorizontal: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    gap: 12,
  },
  price: {
    ...typography.valueXLarge,
    color: colors.ink,
  },
  change: {
    ...typography.change,
  },
  positive: { color: colors.successLight },
    negative: { color: colors.warning },

  chartWrapper: { width: '100%', alignItems: 'center', marginTop: 8 },

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
    fontSize: 16,
    letterSpacing: -0.3,
  },

  ratiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  ratioItem: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  ratioLabel: {
    ...typography.metricLabel,
    color: colors.inkMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  ratioValue: {
    ...typography.value,
    color: colors.ink,
    fontSize: 14,
  },

  summaryContainerCondensed: {
    maxHeight: 200,
    paddingRight: 8,
  },
  summaryText: {
    ...typography.body,
    color: colors.inkMuted,
    lineHeight: 22,
  },

  expandedContent: { width: '100%' },
  expandedSection: { ...sharedWidgetStyles.expandedSection },
  expandedHeader: { marginBottom: 12 },
  expandedPrice: {
    ...typography.headingLarge,
    color: colors.ink,
    marginBottom: 8,
  },
  expandedChange: { ...typography.change },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
  },
  metricLabel: {
    ...typography.metricLabel,
    color: colors.inkMuted,
    fontSize: 10,
    marginBottom: 4,
  },
  metricValue: {
    ...typography.metricValue,
    color: colors.ink,
    fontSize: 13,
  },
  expandedRatiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  expandedRatioItem: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  divider: { ...sharedWidgetStyles.divider },
  summarySectionExpanded: { paddingBottom: 24 },
});
