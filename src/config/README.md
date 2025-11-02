# Dashboard Configuration

This directory contains the JSON configuration files that define the dashboards and their widgets.

## Overview

The dashboard system allows you to configure multiple views (dashboards) of widgets through JSON files, making it easy to add, remove, or modify dashboards without changing the code.

## File: `dashboards.json`

Defines all available dashboards and their widget configurations.

### Structure

```json
{
  "dashboards": [
    {
      "id": "unique-dashboard-id",
      "name": "Display Name",
      "isDefault": true,
      "widgets": [
        {
          "id": "unique-widget-id",
          "type": "WidgetComponentName",
          "props": {
            "customProp": "value"
          }
        }
      ]
    }
  ]
}
```

### Fields

#### Dashboard Level
- **id** (string, required): Unique identifier for the dashboard. Used in navigation routing.
- **name** (string, required): Display name shown in the sidebar navigation.
- **isDefault** (boolean, optional): If `true`, this dashboard loads when the app opens. Only one dashboard should be marked as default.

#### Widget Level
- **id** (string, required): Unique identifier for the widget instance.
- **type** (string, required): Name of the widget component (must match a key in `widgetComponentRegistry.ts`).
- **props** (object, optional): Custom properties passed to the widget component.

## Available Widget Types

Widget types must be registered in `/src/components/widgets/widgetComponentRegistry.ts`:

- `TotalBalanceCard` - Displays total account balance
- `PortfolioCard` - Shows portfolio allocation
- `StockPriceCard` - Displays stock price with chart and financial ratios

## Adding a New Dashboard

1. Open `dashboards.json`
2. Add a new object to the `dashboards` array:

```json
{
  "id": "my-new-dashboard",
  "name": "My Dashboard",
  "isDefault": false,
  "widgets": [
    {
      "id": "widget-1",
      "type": "StockPriceCard",
      "props": {}
    }
  ]
}
```

3. Save the file - the dashboard will automatically appear in the sidebar!

## Adding a New Widget Type

1. Create your widget component in `/src/components/widgets/`
2. Register it in `/src/components/widgets/widgetComponentRegistry.ts`:

```typescript
import { MyNewWidget } from './MyNewWidget';

export const widgetComponentRegistry = {
  // ... existing widgets
  MyNewWidget,
};
```

3. Use it in `dashboards.json`:

```json
{
  "id": "my-widget-instance",
  "type": "MyNewWidget",
  "props": {
    "customProp": "value"
  }
}
```

## Future: Backend Integration

When you're ready to load dashboards from a backend API:

1. Replace the JSON import with an API call
2. Update the navigation to handle async loading
3. Add loading states and error handling
4. Implement real-time updates via WebSocket or polling

Example:
```typescript
// Instead of:
import dashboardsConfig from '../config/dashboards.json';

// Do:
const dashboardsConfig = await fetch('/api/dashboards').then(r => r.json());
```

## Notes

- Dashboard IDs must be unique across all dashboards
- Widget IDs must be unique within a dashboard (can be reused across different dashboards)
- The sidebar will automatically update when you modify `dashboards.json`
- Invalid widget types will be skipped and logged to the console

