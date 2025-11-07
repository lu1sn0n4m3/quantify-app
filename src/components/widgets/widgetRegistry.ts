/**
 * Widget Registry
 *
 * Provides the shared types and sample configuration used across the widget system.
 * Each widget supplies a builder function that NeoCard can use to render condensed
 * pages and expanded content from the payload data.
 */

import type { ReactElement } from 'react';
import { buildTotalBalanceCard } from './TotalBalanceCard';
import { buildPortfolioCard } from './PortfolioCard';
import { buildStockPriceCard } from './StockPriceCard';

/**
 * Output structure returned by every widget builder. NeoCard consumes this payload
 * to render the title, condensed pagination pages, and expanded overlay content.
 */
export type WidgetRenderDefinition = {
  title: string;
  condensedPages: ReactElement[];
  expandedContent: ReactElement;
};

/**
 * Builder signature implemented by all widgets. Widgets only focus on transforming
 * their payload data into renderable React elements.
 */
export type WidgetBuilder<T = any> = (data: T) => WidgetRenderDefinition;

export const widgetBuilderRegistry: Record<string, WidgetBuilder<any>> = {
  TotalBalanceCard: buildTotalBalanceCard,
  PortfolioCard: buildPortfolioCard,
  StockPriceCard: buildStockPriceCard,
};

export function getWidgetBuilder(type: string): WidgetBuilder<any> | undefined {
  return widgetBuilderRegistry[type];
}

/**
 * Sample widget configuration used by WidgetScreen and documentation examples.
 * Runtime dashboards pull from JSON config files but share the same builder map.
 */
export type WidgetConfig = {
  id: string;
  type: keyof typeof widgetBuilderRegistry;
  data: any;
};

export const widgetConfig: WidgetConfig[] = [
  {
    id: 'stock-aapl',
    type: 'StockPriceCard',
    data: {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      prices: {
        '2024-01-01': 145.5,
        '2024-01-02': 146.2,
        '2024-01-03': 147.8,
        '2024-01-04': 146.5,
        '2024-01-05': 148.2,
        '2024-01-06': 149.1,
        '2024-01-07': 148.75,
        '2024-01-08': 150.2,
        '2024-01-09': 151.3,
        '2024-01-10': 150.9,
        '2024-01-11': 152.4,
        '2024-01-12': 153.1,
        '2024-01-13': 152.8,
        '2024-01-14': 154.2,
        '2024-01-15': 155.5,
        '2024-01-16': 156.1,
        '2024-01-17': 155.8,
        '2024-01-18': 157.2,
        '2024-01-19': 158.4,
        '2024-01-20': 159.1,
      },
      financial_ratios: {
        'P/E Ratio': 28.45,
        'Market Cap': '$2.89T',
        'Dividend Yield': '0.52%',
        '52 Week High': '$198.23',
        '52 Week Low': '$124.17',
        Volume: '58.3M',
      },
      summary:
        'Apple continues to show strong performance in the tech sector, with solid fundamentals and consistent revenue growth. The stock is trading near its historical average P/E ratio, suggesting fair valuation. Recent product launches and expanding services revenue provide positive momentum for long-term growth. Market sentiment remains bullish with strong institutional support.',
    },
  },
  {
    id: 'stock-tsla',
    type: 'StockPriceCard',
    data: {
      ticker: 'TSLA',
      name: 'Tesla, Inc.',
      prices: {
        '2024-01-01': 240.5,
        '2024-01-02': 245.2,
        '2024-01-03': 248.8,
        '2024-01-04': 242.5,
        '2024-01-05': 250.2,
        '2024-01-06': 252.1,
        '2024-01-07': 248.75,
        '2024-01-08': 255.2,
        '2024-01-09': 258.3,
        '2024-01-10': 256.9,
        '2024-01-11': 260.4,
        '2024-01-12': 262.1,
        '2024-01-13': 258.8,
        '2024-01-14': 265.2,
        '2024-01-15': 268.5,
        '2024-01-16': 270.1,
        '2024-01-17': 268.8,
        '2024-01-18': 272.2,
        '2024-01-19': 275.4,
        '2024-01-20': 278.1,
      },
      financial_ratios: {
        'P/E Ratio': 45.2,
        'Market Cap': '$850B',
        'Dividend Yield': '0%',
        '52 Week High': '$299.29',
        '52 Week Low': '$138.80',
        Volume: '125.5M',
      },
      summary:
        "Tesla maintains its position as a leader in electric vehicle innovation, with expanding global production capacity and strong demand for its vehicles. The company's energy storage and solar businesses are showing growth potential. Volatility remains high due to market sentiment around EV adoption and competitive dynamics.",
    },
  },
  {
    id: 'balance-1',
    type: 'TotalBalanceCard',
    data: {
      balance: 128450,
      summary: 'Steady monthly growth driven by tech and energy sectors.',
    },
  },
  {
    id: 'portfolio-1',
    type: 'PortfolioCard',
    data: {
      value: 45200,
      gain: 12.5,
      summary: 'Your portfolio has shown strong performance this quarter.',
    },
  },
];

