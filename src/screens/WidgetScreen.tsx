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
 * - Automatic rendering of all widgets from widgetRegistry
 * 
 * Modular Widget System:
 * To add a new widget, simply add it to the widgetRegistry.ts file. No changes needed here!
 * All widgets automatically get the same animation and expansion behavior.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widgetConfig, getWidgetBuilder } from '../components/widgets/widgetRegistry';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/colors';
import { NeoCard } from '../components/base/NeoCard';

export default function WidgetScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(90);

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

  const handleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <>
      {/* Fixed header - always on top, never moves */}
      <SafeAreaView
        style={styles.fixedHeaderContainer}
        edges={['top']}
        pointerEvents="box-none"
        onLayout={(event) => {
          setHeaderHeight(event.nativeEvent.layout.height);
        }}
      >
        <ScreenHeader />
      </SafeAreaView>

      {/* Main content with top padding for header */}
      <ScreenLayout contentStyle={styles.mainContent}>
        {widgetConfig.map((widget) => {
          const builder = getWidgetBuilder(widget.type);
          if (!builder) {
            console.warn(`Widget type "${widget.type}" not found in widgetConfig map.`);
            return null;
          }

          const definition = builder(widget.data);

          return (
            <NeoCard
              key={widget.id}
              title={definition.title}
              condensedPages={definition.condensedPages}
              expandedView={definition.expandedContent}
              onExpand={() => handleExpand(widget.id)}
              expanded={expandedId === widget.id}
              expandedTopOffset={headerHeight}
            />
          );
        })}
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
});
