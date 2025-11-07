/**
 * Widget Builder Registry
 *
 * Keeps legacy file name to avoid churn, but now exports the widget builder map
 * so dashboards and validation can resolve the correct builder for a widget type.
 */

import type { WidgetBuilder } from './widgetRegistry';
import { widgetBuilderRegistry, getWidgetBuilder } from './widgetRegistry';

export const widgetComponentRegistry = widgetBuilderRegistry;

/**
 * Helper function to get a widget builder by type name.
 * Returns undefined if the widget type is not found.
 */
export function getWidgetComponent(type: string): WidgetBuilder<any> | undefined {
  return getWidgetBuilder(type);
}

