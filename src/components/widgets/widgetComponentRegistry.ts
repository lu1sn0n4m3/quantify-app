/**
 * Widget Component Registry
 * 
 * Maps widget type names (strings) to their actual React component implementations.
 * This allows the JSON configuration to reference widgets by name, which are then
 * dynamically resolved to the appropriate component at runtime.
 * 
 * Usage:
 * const WidgetComponent = widgetComponentRegistry['StockPriceCard'];
 * <WidgetComponent id="stock-1" onExpand={...} expanded={false} />
 * 
 * To add a new widget type:
 * 1. Import the widget component
 * 2. Add it to the registry object with its string identifier
 */

import React from 'react';
import { TotalBalanceCard } from './TotalBalanceCard';
import { PortfolioCard } from './PortfolioCard';
import { StockPriceCard } from './StockPriceCard';
import type { WidgetProps } from './widgetRegistry';

type WidgetComponent = React.ComponentType<WidgetProps<any>>;

export const widgetComponentRegistry: Record<string, WidgetComponent> = {
  TotalBalanceCard,
  PortfolioCard,
  StockPriceCard,
};

/**
 * Helper function to get a widget component by type name
 * Returns undefined if the widget type is not found
 */
export function getWidgetComponent(type: string): WidgetComponent | undefined {
  return widgetComponentRegistry[type];
}

