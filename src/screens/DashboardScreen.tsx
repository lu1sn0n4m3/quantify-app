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
import { Animated, StyleSheet, Dimensions, ScrollView, BackHandler, View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Defs, Pattern, Rect, Circle, LinearGradient, Stop } from 'react-native-svg';
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
  const [headerHeight, setHeaderHeight] = useState(75); // Default fallback
  const lastExpandedId = useRef<string | null>(null);
  const scaleYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const headerRef = useRef<View>(null);

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
  
  // Generate unique ID for SVG patterns in expanded view
  const expandedViewId = useRef(Math.random().toString(36).substring(2, 11)).current;

  return (
    <>
      {/* Fixed header - completely independent, never affected by modal */}
      <View 
        ref={headerRef}
        style={[styles.fixedHeaderContainer, { paddingTop: insets.top }]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          // Height includes the header stripe (1px at bottom of headerContainer)
          // The stripe is positioned absolutely at bottom: 0, so it's the last pixel
          // We use the full height so expanded view starts right below the stripe
          setHeaderHeight(height);
        }}
      >
        <ScreenHeader />
      </View>

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
              styles.expandedOverlayBase,
              { top: headerHeight, opacity: blurAnim }
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
                top: headerHeight, // Start exactly at header stripe (stripe is at bottom of header)
                bottom: 0, // Extend all the way to bottom
                transform: [{ scaleY: scaleYAnim }],
                opacity: opacityAnim,
              }
            ]}
          >
            {/* Background Texture - Same as main view */}
            <View style={styles.expandedTextureOverlay} pointerEvents="none">
              <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <Pattern id={`expandedPattern-${expandedViewId}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <Circle cx="5" cy="5" r="0.7" fill={colors.ink} opacity="0.05" />
                  </Pattern>
                  <LinearGradient id={`expandedGradient-${expandedViewId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={colors.pastelBlue} stopOpacity="0.12" />
                    <Stop offset="50%" stopColor={colors.pastelMint} stopOpacity="0.08" />
                    <Stop offset="100%" stopColor={colors.pastelBlush} stopOpacity="0.10" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill={`url(#expandedPattern-${expandedViewId})`} />
                <Rect width="100%" height="100%" fill={`url(#expandedGradient-${expandedViewId})`} />
              </Svg>
            </View>
            
            <View style={styles.expandedSafeArea}>
              <View style={styles.expandedContentWrapper}>
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
              </View>
            </View>
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
    margin: 0,
    padding: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  mainContent: {
    paddingTop: 75,
    paddingBottom: 20,
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
  expandedTextureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  expandedSafeArea: {
    flex: 1,
    margin: 0,
    padding: 0,
    marginTop: 0,
    paddingTop: 0,
  },
  expandedContentWrapper: {
    flex: 1,
    margin: 0,
    padding: 0,
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
});

