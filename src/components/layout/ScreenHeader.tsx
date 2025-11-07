/**
 * ScreenHeader Component
 * 
 * A reusable header component that appears on all screens with consistent styling.
 * Can show either a sidebar toggle button, a close button, or a dropdown depending on the mode.
 * 
 * Used by: All screen components (HomeScreen, MarketScreen, ChatScreen, AccountScreen)
 * 
 * Features:
 * - Sidebar toggle button that opens drawer navigation (default mode)
 * - Close button for modal/expanded views (when onClose is provided)
 * - Dropdown mode for dashboard selection (when dropdownConfig is provided)
 * - Centered "QuantiFy" branding or custom title
 * - Consistent neobrutalist styling
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NeoSidebarButton, CARD_RADIUS } from '../core';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import dashboardsConfig from '../../config/dashboards.json';

export type Dashboard = {
  id: string;
  name: string;
  description?: string;
};

type DropdownConfig = {
  dashboards: Dashboard[];
  selectedId: string;
  onSelect: (dashboardId: string) => void;
};

type ScreenHeaderProps = {
  onClose?: () => void; // If provided, shows close button instead of sidebar button
  dropdownConfig?: DropdownConfig; // If provided, shows dropdown instead of static title
  title?: string; // Optional custom title (overrides default)
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ onClose, dropdownConfig, title: customTitle }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Determine title
  let displayTitle = customTitle;
  if (!displayTitle) {
    if (dropdownConfig) {
      const selectedDashboard = dropdownConfig.dashboards.find(d => d.id === dropdownConfig.selectedId);
      displayTitle = selectedDashboard?.name || 'QuantiFy';
    } else {
      const dashboard = dashboardsConfig.dashboards.find(d => d.id === route.name);
      displayTitle = dashboard ? dashboard.name : 'QuantiFy';
    }
  }
  
  const handleDropdownSelect = (dashboardId: string) => {
    dropdownConfig?.onSelect(dashboardId);
    setDropdownVisible(false);
  };
  
  return (
    <>
      {/* Backdrop to close dropdown */}
      {dropdownVisible && (
        <Pressable 
          style={styles.backdrop} 
          onPress={() => setDropdownVisible(false)}
        />
      )}
      
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {onClose ? (
            // Close button for expanded/modal views
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          ) : (
            // Sidebar button for normal views
            <NeoSidebarButton onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
          )}
          
          {dropdownConfig ? (
            // Dropdown mode for dashboard selection
            <View style={styles.titleCenterContainer} pointerEvents="box-none">
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setDropdownVisible(!dropdownVisible)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownTitle}>{displayTitle}</Text>
                <Text style={[styles.dropdownIcon, dropdownVisible && styles.dropdownIconOpen]}>
                  ▼
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Static title
            <Text style={styles.headerTitle} pointerEvents="none">{displayTitle}</Text>
          )}
          
          <View style={styles.placeholder} />
        </View>
        
        {/* Header Stripe Separator */}
        <View
          style={[styles.headerStripe, dropdownVisible && styles.headerStripeHidden]}
          pointerEvents="none"
        />
        
        {/* Inline Dropdown Menu */}
        {dropdownConfig && dropdownVisible && (
          <View style={styles.dropdownContainer} pointerEvents="box-none">
            <View style={styles.dropdownMenu}>
              <ScrollView 
                style={styles.dropdownScrollView}
                contentContainerStyle={styles.dropdownContent}
                showsVerticalScrollIndicator={true}
              >
                {dropdownConfig.dashboards.map((dashboard) => {
                  const isSelected = dashboard.id === dropdownConfig.selectedId;
                  return (
                    <TouchableOpacity
                      key={dashboard.id}
                      style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                      onPress={() => handleDropdownSelect(dashboard.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dropdownItemContent}>
                        <Text style={[styles.dropdownItemLabel, isSelected && styles.dropdownItemLabelActive]}>
                          {dashboard.name}
                        </Text>
                        {isSelected && (
                          <View style={styles.checkmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </View>
                      {dashboard.description && (
                        <Text style={styles.dropdownItemDescription}>{dashboard.description}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: colors.headerBg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 1,
  },
  headerStripe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E5E5',
    zIndex: 100,
  },
  headerStripeHidden: {
    opacity: 0,
    height: 0,
  },
  titleCenterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownTitle: {
    ...typography.heading,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.4,
    fontWeight: '500',
    fontFamily: 'Helvetica',
  },
  dropdownIcon: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  dropdownIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 0,
    zIndex: 200,
  },
  dropdownMenu: {
    width: '86%',
    maxWidth: 320,
    maxHeight: 420,
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(10, 10, 10, 0.18)',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 0,
    elevation: 6,
  },
  dropdownScrollView: {
    maxHeight: 420,
  },
  dropdownContent: {
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 10, 10, 0.08)',
  },
  dropdownItemActive: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemLabel: {
    ...typography.body,
    fontSize: 16,
    color: colors.inkMuted,
    fontWeight: '500',
    flex: 1,
  },
  dropdownItemLabelActive: {
    color: colors.ink,
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  dropdownItemDescription: {
    ...typography.body,
    fontSize: 13,
    color: colors.inkLight,
    marginTop: 4,
  },
  headerTitle: {
    ...typography.heading,
    fontSize: 22,
    color: colors.white,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    letterSpacing: -0.4,
    fontWeight: '500',
    fontFamily: 'Helvetica',
  },
  placeholder: {
    width: 44,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardBg,
    borderWidth: 1.5,
    borderColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  closeButtonText: {
    ...typography.heading,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 22,
    fontWeight: '700',
  },
});

