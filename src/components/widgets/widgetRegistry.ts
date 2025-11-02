/**
 * Widget Registry
 * 
 * Central registry for all widgets in the app. Add new widgets here to automatically
 * include them in the WidgetScreen with full animation support. No additional code needed!
 * 
 * WIDGET ARCHITECTURE:
 * Each widget has TWO states that the designer controls:
 * 
 * 1. SMALL VERSION (expanded = false):
 *    - Compact view shown in the main scrollable list
 *    - Shows key information at a glance
 *    - Designer decides what's most important to display
 * 
 * 2. EXPANDED VERSION (expanded = true):
 *    - Full-featured view shown in modal overlay
 *    - Can include additional base components, charts, detailed info
 *    - Designer can make it pop with more interactive elements
 * 
 * To add a new widget:
 * 1. Create your widget component in components/widgets/
 * 2. Implement both small and expanded designs using the `expanded` prop
 * 3. Import it here
 * 4. Add it to the widgetConfig array with a unique id
 * 5. (Future) Add dataEndpoint to connect to backend
 */

import React from 'react';
import { TotalBalanceCard } from './TotalBalanceCard';
import { PortfolioCard } from './PortfolioCard';
import { StockPriceCard } from './StockPriceCard';

/**
 * Standard Widget Props Interface
 * All widgets must accept these props
 */
export type WidgetProps = {
  id: string;                    // Unique identifier for this widget instance
  onExpand?: () => void;         // Callback when expand button is pressed
  expanded?: boolean;            // Controls small vs expanded view
  data?: any;                    // (Future) Data fetched from backend
};

/**
 * Widget Configuration
 * Defines a widget instance in the registry
 */
export type WidgetConfig = {
  id: string;                                    // Unique ID for this widget instance
  component: React.ComponentType<WidgetProps>;  // The widget component
  props?: Record<string, any>;                  // Additional custom props
  // dataEndpoint?: string;                      // (Future) Backend endpoint for data fetching
  // refreshInterval?: number;                   // (Future) Auto-refresh interval in ms
};

/**
 * Widget Configuration Array
 * 
 * Define all widget instances here. Each entry will be rendered automatically
 * with expand/collapse animations, modal overlay, and blur effects.
 * 
 * Example: To add a new widget, just import it above and add an entry here.
 * That's it! No animation code needed - it's all handled automatically.
 */
export const widgetConfig: WidgetConfig[] = [
  {
    id: 'stock-aapl',
    component: StockPriceCard,
  },
  {
    id: 'balance-1',
    component: TotalBalanceCard,
  },
  {
    id: 'portfolio-1',
    component: PortfolioCard,
  },
  {
    id: 'stock-tsla',
    component: StockPriceCard,
  },
];

