/**
 * Widgets
 * 
 * Feature-specific widget builders that describe small and expanded states.
 * Each widget focuses on its content while NeoCard handles pagination and
 * expansion behaviors.
 *
 * To add a new widget:
 * 1. Create your widget builder in this directory
 * 2. Export the builder here
 * 3. Register it in widgetRegistry.ts
 * That's it! The widget will automatically appear with animations.
 */

export { buildTotalBalanceCard } from './TotalBalanceCard';
export { buildPortfolioCard } from './PortfolioCard';
export { buildStockPriceCard } from './StockPriceCard';
export { WidgetPageIndicator } from './WidgetPageIndicator';
export {
  widgetConfig,
  widgetBuilderRegistry,
  getWidgetBuilder,
  type WidgetConfig,
  type WidgetBuilder,
  type WidgetRenderDefinition,
} from './widgetRegistry';
export { widgetComponentRegistry, getWidgetComponent } from './widgetComponentRegistry';

