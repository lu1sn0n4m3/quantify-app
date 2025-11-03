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
    paddingHorizontal: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    ...typography.label,
    color: colors.ink,
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    ...typography.heading,
    color: colors.ink,
  },
  positive: {
    color: '#16a34a',
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
