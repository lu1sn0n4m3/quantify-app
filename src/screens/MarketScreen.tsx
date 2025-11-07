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
import { Animated, StyleSheet, BackHandler, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader, Dashboard } from '../components/layout/ScreenHeader';
import { BackgroundTexture } from '../components/base/BackgroundTexture';
import { NeoCard } from '../components/base/NeoCard';
import { validateWidget } from '../components/widgets/widgetValidation';
import dashboardsConfig from '../config/dashboards.json';
import { colors } from '../theme/colors';

const LAST_DASHBOARD_KEY = '@quantify/lastSelectedDashboard';

export default function MarketScreen() {
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>(
    dashboardsConfig.dashboards[0]?.id || ''
  );
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(75);
  const lastExpandedId = useRef<string | null>(null);
  const scaleYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(0)).current;
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

  // Animate expand/collapse
  useEffect(() => {
    if (expandedId) {
      lastExpandedId.current = expandedId;
      setModalVisible(true);
      scaleYAnim.setValue(0);
      opacityAnim.setValue(0);
      blurAnim.setValue(0);
      
      Animated.parallel([
        Animated.spring(scaleYAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(blurAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (modalVisible) {
      Animated.parallel([
        Animated.spring(scaleYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(blurAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setModalVisible(false);
        lastExpandedId.current = null;
      });
    }
  }, [expandedId, scaleYAnim, opacityAnim, blurAnim, modalVisible]);

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={[styles.fixedHeaderContainer, { paddingTop: insets.top }]}>
          <ScreenHeader />
        </View>
      </View>
    );
  }

  const widgetIdToDisplay = expandedId || lastExpandedId.current;
  const displayWidget = selectedDashboard.widgets.find(w => w.id === widgetIdToDisplay);

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
              expanded={false}
            />
          );
        })}
      </ScreenLayout>

      {/* Expanded Widget Overlay - only affects content area (same as DashboardScreen) */}
      {modalVisible && (
        <>
          {/* Blur layer - respects header space */}
          <Animated.View 
            style={[
              styles.expandedOverlayBase,
              { 
                top: headerHeight,
                opacity: blurAnim 
              }
            ]}
            pointerEvents="none"
          >
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          </Animated.View>
          
          {/* Scrollable content with animation - starts right below header stripe */}
          <Animated.View 
            style={[
              styles.expandedContentContainerBase,
              { 
                top: headerHeight,
                transform: [{ scaleY: scaleYAnim }],
                opacity: opacityAnim,
              }
            ]}
          >
            <BackgroundTexture />
            
            <View style={styles.expandedSafeArea}>
              <View style={styles.expandedContentWrapper}>
                {displayWidget && (() => {
                  const validation = validateWidget(displayWidget, displayWidget.id);
                  if (!validation.isValid || !validation.builder || !validation.data) {
                    return null;
                  }

                  const definition = validation.builder(validation.data);

                  return (
                    <NeoCard
                      title={definition.title}
                      condensedPages={definition.condensedPages}
                      expandedView={definition.expandedContent}
                      onExpand={() => handleExpand(displayWidget.id)}
                      expanded={true}
                    />
                  );
                })()}
              </View>
            </View>
          </Animated.View>
        </>
      )}
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
  expandedOverlayBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  expandedContentContainerBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    backgroundColor: colors.screenBg,
    transformOrigin: 'top center',
    overflow: 'hidden',
  },
  expandedSafeArea: {
    flex: 1,
  },
  expandedContentWrapper: {
    flex: 1,
    minHeight: '100%',
  },
});

