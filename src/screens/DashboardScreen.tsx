/**
 * DashboardScreen Component
 * 
 * Displays a collection of widgets based on the selected dashboard configuration.
 * The dashboard configuration is loaded from dashboards.json, which defines:
 * - Dashboard ID and name
 * - List of widgets to display
 * - Widget types and their properties
 * 
 * Features:
 * - Dynamic widget rendering based on JSON config
 * - Widget expansion/modal overlay
 * - Smooth animations
 * - Fixed header
 * - Sidebar access while widget is expanded
 * 
 * Used by: AppNavigator (for each dashboard route)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/colors';
import { getWidgetComponent } from '../components/widgets/widgetComponentRegistry';
import dashboardsConfig from '../config/dashboards.json';

const { width } = Dimensions.get('window');

type DashboardScreenProps = {
  route?: {
    params?: {
      dashboardId?: string;
    };
  };
};

export default function DashboardScreen({ route }: DashboardScreenProps) {
  const dashboardId = route?.params?.dashboardId || dashboardsConfig.dashboards.find(d => d.isDefault)?.id || dashboardsConfig.dashboards[0].id;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const lastExpandedId = useRef<string | null>(null);
  const scaleYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(0)).current;

  // Find the dashboard configuration
  const dashboard = dashboardsConfig.dashboards.find(d => d.id === dashboardId);

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

  if (!dashboard) {
    return (
      <>
        <SafeAreaView style={styles.fixedHeaderContainer} edges={['top']} pointerEvents="box-none">
          <ScreenHeader />
        </SafeAreaView>
        <ScreenLayout contentStyle={styles.mainContent}>
          {/* Dashboard not found */}
        </ScreenLayout>
      </>
    );
  }

  const widgetIdToDisplay = expandedId || lastExpandedId.current;
  const displayWidget = dashboard.widgets.find(w => w.id === widgetIdToDisplay);
  const DisplayWidgetComponent = displayWidget ? getWidgetComponent(displayWidget.type) : null;

  return (
    <>
      {/* Fixed header - completely independent, never affected by modal */}
      <SafeAreaView style={styles.fixedHeaderContainer} edges={['top']} pointerEvents="box-none">
        <ScreenHeader />
      </SafeAreaView>

      {/* Main content with top padding for header */}
      <ScreenLayout contentStyle={styles.mainContent}>
        {/* Dynamically render all widgets from the dashboard config */}
        {dashboard.widgets.map((widget) => {
          const WidgetComponent = getWidgetComponent(widget.type);
          
          if (!WidgetComponent) {
            console.warn(`Widget type "${widget.type}" not found in registry`);
            return null;
          }

          // Get data from widget.data
          const widgetData = (widget as any).data;

          if (!widgetData) {
            console.warn(`Widget "${widget.id}" is missing data prop`);
            return null;
          }

          return (
            <WidgetComponent
              key={widget.id}
              id={widget.id}
              data={widgetData}
              onExpand={() => handleExpand(widget.id)}
              expanded={false}
            />
          );
        })}
      </ScreenLayout>

      {/* Expanded Widget Overlay - only affects content area */}
      {modalVisible && (
        <>
          {/* Blur layer - respects header space */}
          <Animated.View 
            style={[
              styles.expandedOverlay,
              { opacity: blurAnim }
            ]}
            pointerEvents="none"
          >
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          </Animated.View>
          
          {/* Scrollable content with animation - respects header space */}
          <Animated.View 
            style={[
              styles.expandedContentContainer,
              { 
                transform: [{ scaleY: scaleYAnim }],
                opacity: opacityAnim,
              }
            ]}
          >
            <SafeAreaView style={styles.expandedSafeArea} edges={['bottom']}>
              <ScrollView 
                style={styles.expandedScrollView}
                contentContainerStyle={styles.expandedScrollContent}
              >
                {displayWidget && DisplayWidgetComponent && (() => {
                  // Get data from widget.data
                  const widgetData = (displayWidget as any).data;
                  
                  if (!widgetData) {
                    console.warn(`Widget "${displayWidget.id}" is missing data prop`);
                    return null;
                  }

                  return (
                    <DisplayWidgetComponent
                      id={displayWidget.id}
                      data={widgetData}
                      onExpand={() => handleExpand(displayWidget.id)}
                      expanded={true}
                    />
                  );
                })()}
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fixedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: colors.screenBg,
  },
  mainContent: {
    paddingTop: 75,
    paddingBottom: 20,
  },
  expandedOverlay: {
    position: 'absolute',
    top: 90, // Start below the header
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  expandedContentContainer: {
    position: 'absolute',
    top: 120, // Start below the header
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    backgroundColor: colors.screenBg,
    transformOrigin: 'top center',
  },
  expandedSafeArea: {
    flex: 1,
  },
  expandedScrollView: {
    flex: 1,
  },
  expandedScrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});

