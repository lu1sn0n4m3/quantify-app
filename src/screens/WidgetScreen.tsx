/**
 * WidgetScreen Component
 * 
 * A modular, dynamic widgets screen that automatically renders all widgets from the widget registry.
 * Features a header with sidebar toggle button and "QuantiFy" branding. The screen manages
 * the expansion state of widgets, allowing users to expand cards to see more details.
 * 
 * Used by: AppNavigator (drawer navigation)
 * 
 * Features:
 * - Sidebar toggle button to open drawer navigation
 * - Centered "QuantiFy" header title
 * - Scrollable content area for widgets
 * - State management for widget expansion
 * - Animated floating expansion with blurred background
 * - Automatic rendering of all widgets from widgetRegistry
 * 
 * Modular Widget System:
 * To add a new widget, simply add it to the widgetRegistry.ts file. No changes needed here!
 * All widgets automatically get the same animation and expansion behavior.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { widgetConfig } from '../components/widgets/widgetRegistry';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function WidgetScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const lastExpandedId = useRef<string | null>(null);
  const slideAnim = useRef(new Animated.Value(300)).current; // Slide up from bottom
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (expandedId) {
      // Store the current expanded ID
      lastExpandedId.current = expandedId;
      
      // Show modal immediately
      setModalVisible(true);
      
      // Reset values before animating in
      slideAnim.setValue(300);
      opacityAnim.setValue(0);
      blurAnim.setValue(0);
      
      // Animate in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 9,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(blurAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (modalVisible) {
      // Animate out then hide modal
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 300,
          useNativeDriver: true,
          tension: 80,
          friction: 9,
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
        // Hide modal after animation completes
        setModalVisible(false);
        lastExpandedId.current = null;
      });
    }
  }, [expandedId, slideAnim, opacityAnim, blurAnim, modalVisible]);

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle Android back button to close expanded view
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (expandedId) {
        setExpandedId(null);
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    });

    return () => backHandler.remove();
  }, [expandedId]);

  // Find the widget to display - use current or last expanded ID during close animation
  const widgetIdToDisplay = expandedId || lastExpandedId.current;
  const displayWidget = widgetConfig.find(w => w.id === widgetIdToDisplay);

  return (
    <>
      {/* Fixed header - always on top, never moves */}
            <SafeAreaView style={styles.fixedHeaderContainer} edges={['top']} pointerEvents="box-none">
              <ScreenHeader />
            </SafeAreaView>

      {/* Main content with top padding for header */}
      <ScreenLayout contentStyle={styles.mainContent}>
        {/* Dynamically render all widgets from the registry */}
        {widgetConfig.map((widget) => {
          const WidgetComponent = widget.component;
          return (
            <WidgetComponent
              key={widget.id}
              id={widget.id}
              data={widget.data}
              onExpand={() => handleExpand(widget.id)}
              expanded={false}
            />
          );
        })}

        {/* Expanded widget overlay */}
        {modalVisible && (
          <>
            {/* Blur background */}
            <Animated.View 
              style={[
                StyleSheet.absoluteFill, 
                styles.expandedOverlay,
                { opacity: blurAnim }
              ]}
              pointerEvents="none"
            >
              <BlurView intensity={20} style={StyleSheet.absoluteFill} />
            </Animated.View>
            
            {/* Scrollable content with animation */}
            <Animated.View 
              style={[
                styles.expandedContentContainer,
                { 
                  transform: [{ translateY: slideAnim }],
                  opacity: opacityAnim,
                }
              ]}
            >
              <SafeAreaView style={styles.expandedSafeArea} edges={['bottom']}>
                <ScrollView 
                  style={styles.expandedScrollView}
                  contentContainerStyle={styles.expandedScrollContent}
                >
                  {displayWidget && (
                    <displayWidget.component
                      id={displayWidget.id}
                      data={displayWidget.data}
                      onExpand={() => handleExpand(displayWidget.id)}
                      expanded={true}
                    />
                  )}
                </ScrollView>
              </SafeAreaView>
            </Animated.View>
          </>
        )}
      </ScreenLayout>
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
    paddingTop: 90,
  },
  expandedOverlay: {
    zIndex: 1000,
  },
  expandedContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    paddingTop: 90,
    backgroundColor: colors.screenBg,
  },
  expandedSafeArea: {
    flex: 1,
  },
  expandedScrollView: {
    flex: 1,
  },
  expandedScrollContent: {
    paddingBottom: 20,
  },
});
