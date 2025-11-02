/**
 * NeoCard Component
 * 
 * A reusable card component with neobrutalist styling that serves as the base container
 * for widgets and content throughout the app. Features bold borders, shadows, and an optional
 * expand button.
 * 
 * Used by: TotalBalanceCard and other widget cards
 * 
 * Props:
 * - title: Optional card title displayed at the top
 * - subtitleRight: Optional subtitle text positioned on the right side
 * - onExpand: Optional callback function triggered when the expand button is pressed
 * - children: The content to be displayed inside the card
 */
import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { NeoDotsButton } from './NeoDotsButton';

export const CARD_RADIUS = 18;

export type NeoCardProps = PropsWithChildren<{
  title?: string;
  subtitleRight?: string;
  onExpand?: () => void;
}>;

export const NeoCard: React.FC<NeoCardProps> = ({ 
  title, 
  subtitleRight, 
  onExpand, 
  children 
}) => {
  return (
    <View style={styles.card}>
      {onExpand && (
        <NeoDotsButton onPress={onExpand} style={styles.expand} testID="expand-btn" />
      )}
      {title ? (
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitleRight ? (
            <Text style={styles.subtitleRight}>{subtitleRight}</Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 4,
    borderColor: colors.ink,
    borderRadius: CARD_RADIUS,
    padding: 14,
    marginHorizontal: 18,
    marginVertical: 9,
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  title: { 
    fontWeight: '800', 
    fontSize: 16, 
    color: colors.ink 
  },
  subtitleRight: { 
    position: 'absolute', 
    right: 0, 
    top: 0, 
    color: colors.ink 
  },
  expand: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    zIndex: 2 
  },
});

