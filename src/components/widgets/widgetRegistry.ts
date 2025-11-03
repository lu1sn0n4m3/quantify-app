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
 * 
 * NEW ARCHITECTURE:
 * - Widgets receive a `data` prop containing their payload (JSON from API)
 * - Widgets define their own payload type (e.g., StockPriceCardPayload)
 * - Widgets use `renderCondensedPages(data)` to define pages for condensed view
 * - Widgets use `renderExpandedView(data)` to define expanded view
 * - Widgets use `getTitle(data)` to generate header from payload
 * - NeoCard handles all pagination logic, page indicator, and expand button
 */
export type WidgetProps<T = any> = {
  id: string;                    // Unique identifier for this widget instance
  data: T;                       // Payload data (JSON from API, typed per widget)
  onExpand?: () => void;         // Callback when expand button is pressed
  expanded?: boolean;            // Controls condensed vs expanded view
};

/**
 * Widget Definition Interface
 * Each widget must implement these methods to work with NeoCard template
 */
export type WidgetDefinition<T = any> = {
  // Generate title from payload (e.g., "AAPL - Apple Inc.")
  getTitle: (data: T) => string;
  
  // Render pages for condensed view (returns array of page components)
  renderCondensedPages: (data: T) => React.ReactElement[];
  
  // Render expanded view (returns single component)
  renderExpandedView: (data: T) => React.ReactElement;
};

/**
 * Widget Configuration
 * Defines a widget instance in the registry
 */
export type WidgetConfig = {
  id: string;                                    // Unique ID for this widget instance
  component: React.ComponentType<WidgetProps<any>>;  // The widget component
  data: any;                                     // Payload data (JSON from API, typed per widget)
  // dataEndpoint?: string;                      // (Future) Backend endpoint for data fetching
  // refreshInterval?: number;                   // (Future) Auto-refresh interval in ms
};

/**
 * Widget Configuration Array
 * 
 * Define all widget instances here. Each entry will be rendered automatically
 * with expand/collapse animations, modal overlay, and blur effects.
 * 
 * Each widget requires a `data` prop containing its payload (JSON structure).
 * In the future, this will be fetched from the backend API.
 * 
 * Example: To add a new widget, just import it above and add an entry here.
 * That's it! No animation code needed - it's all handled automatically.
 */
export const widgetConfig: WidgetConfig[] = [
  {
    id: 'stock-aapl',
    component: StockPriceCard,
    data: {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      prices: {
        '2024-01-01': 145.50,
        '2024-01-02': 146.20,
        '2024-01-03': 147.80,
        '2024-01-04': 146.50,
        '2024-01-05': 148.20,
        '2024-01-06': 149.10,
        '2024-01-07': 148.75,
        '2024-01-08': 150.20,
        '2024-01-09': 151.30,
        '2024-01-10': 150.90,
        '2024-01-11': 152.40,
        '2024-01-12': 153.10,
        '2024-01-13': 152.80,
        '2024-01-14': 154.20,
        '2024-01-15': 155.50,
        '2024-01-16': 156.10,
        '2024-01-17': 155.80,
        '2024-01-18': 157.20,
        '2024-01-19': 158.40,
        '2024-01-20': 159.10,
      },
      financial_ratios: {
        'P/E Ratio': 28.45,
        'Market Cap': '$2.89T',
        'Dividend Yield': '0.52%',
        '52 Week High': '$198.23',
        '52 Week Low': '$124.17',
        'Volume': '58.3M',
      },
      summary: 'Apple continues to show strong performance in the tech sector, with solid fundamentals and consistent revenue growth. The stock is trading near its historical average P/E ratio, suggesting fair valuation. Recent product launches and expanding services revenue provide positive momentum for long-term growth. Market sentiment remains bullish with strong institutional support.',
    },
  },
  {
    id: 'stock-tsla',
    component: StockPriceCard,
    data: {
      ticker: 'TSLA',
      name: 'Tesla, Inc.',
      prices: {
        '2024-01-01': 240.50,
        '2024-01-02': 245.20,
        '2024-01-03': 248.80,
        '2024-01-04': 242.50,
        '2024-01-05': 250.20,
        '2024-01-06': 252.10,
        '2024-01-07': 248.75,
        '2024-01-08': 255.20,
        '2024-01-09': 258.30,
        '2024-01-10': 256.90,
        '2024-01-11': 260.40,
        '2024-01-12': 262.10,
        '2024-01-13': 258.80,
        '2024-01-14': 265.20,
        '2024-01-15': 268.50,
        '2024-01-16': 270.10,
        '2024-01-17': 268.80,
        '2024-01-18': 272.20,
        '2024-01-19': 275.40,
        '2024-01-20': 278.10,
      },
      financial_ratios: {
        'P/E Ratio': 45.2,
        'Market Cap': '$850B',
        'Dividend Yield': '0%',
        '52 Week High': '$299.29',
        '52 Week Low': '$138.80',
        'Volume': '125.5M',
      },
      summary: 'Tesla maintains its position as a leader in electric vehicle innovation, with expanding global production capacity and strong demand for its vehicles. The company\'s energy storage and solar businesses are showing growth potential. Volatility remains high due to market sentiment around EV adoption and competitive dynamics.',
    },
  },
  {
    id: 'balance-1',
    component: TotalBalanceCard,
    data: {
      balance: 128450,
      summary: 'Steady monthly growth driven by tech and energy sectors.',
    },
  },
  {
    id: 'portfolio-1',
    component: PortfolioCard,
    data: {
      value: 45200,
      gain: 12.5,
      summary: 'Your portfolio has shown strong performance this quarter.',
    },
  },
];

