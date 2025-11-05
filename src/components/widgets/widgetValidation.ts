/**
 * Widget Validation Utilities
 * 
 * Helper functions for validating widget data and components.
 * Reduces duplication of validation logic across components.
 */

import { getWidgetComponent } from './widgetComponentRegistry';

export const validateWidget = (widget: any, widgetId: string): { isValid: boolean; Component?: any; data?: any } => {
  const WidgetComponent = getWidgetComponent(widget.type);
  
  if (!WidgetComponent) {
    console.warn(`Widget type "${widget.type}" not found in registry`);
    return { isValid: false };
  }

  const widgetData = (widget as any).data;
  if (!widgetData) {
    console.warn(`Widget "${widgetId}" is missing data prop`);
    return { isValid: false };
  }

  return { isValid: true, Component: WidgetComponent, data: widgetData };
};

