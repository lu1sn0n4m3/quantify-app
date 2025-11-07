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
import { Animated, StyleSheet, BackHandler, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { BackgroundTexture } from '../components/base/BackgroundTexture';
import { colors } from '../theme/colors';
import { validateWidget } from '../components/widgets/widgetValidation';
import { NeoCard } from '../components/base/NeoCard';
import dashboardsConfig from '../config/dashboards.json';

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
  expandedSafeArea: {
    flex: 1,
  },
  expandedContentWrapper: {
    flex: 1,
    minHeight: '100%',
  },
});

