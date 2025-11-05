/**
 * PortfolioCard Widget
 * 
 * Example widget showing portfolio performance.
 * 
 * NEW ARCHITECTURE:
 * - Widget defines its payload type (PortfolioCardPayload)
 * - Widget generates title from payload
 * - Widget defines pages for condensed view (single page)
 * - Widget defines expanded view (completely separate layout)
 * - NeoCard handles all pagination, page indicator, and expand button
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NeoCard } from '../base/NeoCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { currency } from '../../utils/format';
import { WidgetProps } from './widgetRegistry';
import { sharedWidgetStyles } from './sharedWidgetStyles';

/**
 * PortfolioCard Payload Type
 * Defines the JSON structure expected from the API
 */
export type PortfolioCardPayload = {
  value: number;
  gain: number; // Percentage gain
  summary?: string; // Optional summary text for expanded view
};

/**
 * Generate title from payload
 */
const getTitle = (data: PortfolioCardPayload): string => {
  return 'Portfolio Performance';
};

/**
 * Render condensed view (single page)
 */
const renderCondensedPages = (data: PortfolioCardPayload): React.ReactElement[] => {
  return [
    <View key="main" style={styles.pageInner}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Value</Text>
          <Text style={styles.statValue}>{currency(data.value)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Gain</Text>
          <Text style={[styles.statValue, styles.positive]}>+{data.gain.toFixed(1)}%</Text>
        </View>
      </View>
    </View>
  ];
};

/**
 * Render expanded view (completely separate layout)
 */
const renderExpandedView = (data: PortfolioCardPayload): React.ReactElement => {
  return (
    <View style={styles.expandedContent}>
      <View style={styles.expandedSection}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Value</Text>
            <Text style={styles.statValue}>{currency(data.value)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Gain</Text>
            <Text style={[styles.statValue, styles.positive]}>+{data.gain.toFixed(1)}%</Text>
          </View>
        </View>
      </View>
      
      {data.summary && (
        <>
          <View style={styles.divider} />
          <View style={styles.expandedSection}>
            <Text style={styles.summary}>{data.summary}</Text>
            <Text style={styles.expandedText}>
              Top performers: Tech sector (+18%), Healthcare (+14%). Your diversified 
              strategy is working well with balanced exposure across multiple sectors.
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

/**
 * PortfolioCard Component
 */
export const PortfolioCard: React.FC<WidgetProps<PortfolioCardPayload>> = ({ 
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    marginTop: 8,
  },
  stat: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statLabel: {
    ...typography.metricLabel,
    color: colors.inkMuted,
    marginBottom: 8,
    opacity: 1,
  },
  statValue: {
    ...typography.valueLarge,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  positive: {
    color: colors.successLight,
  },
  expandedContent: {
    width: '100%',
  },
  expandedSection: {
    ...sharedWidgetStyles.expandedSection,
  },
  divider: {
    ...sharedWidgetStyles.divider,
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
});
