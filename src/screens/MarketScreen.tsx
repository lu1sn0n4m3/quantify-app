/**
 * MarketScreen Component
 * 
 * The market screen that displays a selected dashboard with widgets.
 * Features a dropdown in the header to switch between dashboards.
 * Remembers the last selected dashboard using AsyncStorage.
 * 
 * Used by: BottomTabNavigator
 * 
 * Features:
 * - Dashboard dropdown selector in header
 * - Persists last selected dashboard
 * - Displays widgets from selected dashboard
 * - Widget expand/collapse with blur overlay (same as DashboardScreen)
 * - Scrollable widget list
 */
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, BackHandler, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader, Dashboard } from '../components/layout/ScreenHeader';
import { NeoCard } from '../components/base/NeoCard';
import { validateWidget } from '../components/widgets/widgetValidation';
import dashboardsConfig from '../config/dashboards.json';
import { colors } from '../theme/colors';

const LAST_DASHBOARD_KEY = '@quantify/lastSelectedDashboard';
const TAB_BAR_HEIGHT = 65;

export default function MarketScreen() {
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>(
    dashboardsConfig.dashboards[0]?.id || ''
  );
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(75);
  const insets = useSafeAreaInsets();
  const headerRef = useRef<View>(null);

  // Load last selected dashboard on mount
  useEffect(() => {
    loadLastDashboard();
  }, []);

  const loadLastDashboard = async () => {
    try {
      const lastDashboardId = await AsyncStorage.getItem(LAST_DASHBOARD_KEY);
      if (lastDashboardId) {
        // Verify dashboard still exists
        const dashboardExists = dashboardsConfig.dashboards.some(d => d.id === lastDashboardId);
        if (dashboardExists) {
          setSelectedDashboardId(lastDashboardId);
        }
      }
    } catch (error) {
      console.error('Failed to load last dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDashboardSelect = async (dashboardId: string) => {
    setSelectedDashboardId(dashboardId);
    // Close expanded widget when switching dashboards
    if (expandedId) {
      setExpandedId(null);
    }
    try {
      await AsyncStorage.setItem(LAST_DASHBOARD_KEY, dashboardId);
    } catch (error) {
      console.error('Failed to save dashboard selection:', error);
    }
  };

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (expandedId) {
        setExpandedId(null);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [expandedId]);

  const handleExpand = (widgetId: string) => {
    if (expandedId === widgetId) {
      setExpandedId(null);
    } else {
      setExpandedId(widgetId);
    }
  };

  // Find selected dashboard
  const selectedDashboard = dashboardsConfig.dashboards.find(
    d => d.id === selectedDashboardId
  ) || dashboardsConfig.dashboards[0];

  // Convert dashboards to dropdown format
  const dropdownDashboards: Dashboard[] = dashboardsConfig.dashboards.map(d => ({
    id: d.id,
    name: d.name,
  }));

  const expandedBottomOffset = insets.bottom + TAB_BAR_HEIGHT;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={[styles.fixedHeaderContainer, { paddingTop: insets.top }]}>
          <ScreenHeader />
        </View>
      </View>
    );
  }

  return (
    <>
      {/* Fixed header with dropdown - completely independent, never affected by expansion */}
      <View 
        ref={headerRef}
        style={[styles.fixedHeaderContainer, { paddingTop: insets.top }]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
      >
        <ScreenHeader
          dropdownConfig={{
            dashboards: dropdownDashboards,
            selectedId: selectedDashboardId,
            onSelect: handleDashboardSelect,
          }}
        />
      </View>

      {/* Main content with top padding for header */}
      <ScreenLayout contentStyle={styles.mainContent}>
        {/* Dynamically render all widgets from the selected dashboard */}
        {selectedDashboard.widgets.map((widget) => {
          const validation = validateWidget(widget, widget.id);
          if (!validation.isValid || !validation.builder || !validation.data) {
            return null;
          }

          const definition = validation.builder(validation.data);

          return (
            <NeoCard
              key={widget.id}
              title={definition.title}
              condensedPages={definition.condensedPages}
              expandedView={definition.expandedContent}
              onExpand={() => handleExpand(widget.id)}
              expanded={expandedId === widget.id}
              expandedTopOffset={headerHeight}
              expandedBottomOffset={expandedBottomOffset}
            />
          );
        })}
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  fixedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: colors.headerBg,
  },
  mainContent: {
    paddingTop: 65,
    paddingBottom: 28,
  },
});

