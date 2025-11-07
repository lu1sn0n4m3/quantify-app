/**
 * Widget Validation Utilities
 * 
 * Helper functions for validating widget data and components.
 * Reduces duplication of validation logic across components.
 */

import { getWidgetComponent } from './widgetComponentRegistry';
import type { WidgetBuilder } from './widgetRegistry';

export const validateWidget = (
  widget: any,
  widgetId: string
): { isValid: boolean; builder?: WidgetBuilder<any>; data?: any } => {
  const widgetBuilder = getWidgetComponent(widget.type);

  if (!widgetBuilder) {
    console.warn(`Widget type "${widget.type}" not found in registry`);
    return { isValid: false };
  }

  const widgetData = (widget as any).data;
  if (!widgetData) {
    console.warn(`Widget "${widgetId}" is missing data prop`);
    return { isValid: false };
  }

  return { isValid: true, builder: widgetBuilder, data: widgetData };
};

