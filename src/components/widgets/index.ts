/**
 * Widgets
 * 
 * Feature-specific widget components built from base components. Each widget is self-contained
 * and can be customized while maintaining the standardized card container structure.
 * 
 * Widgets are built using NeoCard as their container, which provides consistent styling
 * and expand functionality. Each widget focuses on its specific content and design.
 * 
 * Modular Widget System:
 * To add a new widget to the app:
 * 1. Create your widget component in this directory
 * 2. Export it here
 * 3. Add it to widgetRegistry.ts
 * That's it! The widget will automatically appear with animations.
 */

export { TotalBalanceCard } from './TotalBalanceCard';
export { PortfolioCard } from './PortfolioCard';
export { StockPriceCard } from './StockPriceCard';
export { widgetConfig, type WidgetConfig, type WidgetProps } from './widgetRegistry';

