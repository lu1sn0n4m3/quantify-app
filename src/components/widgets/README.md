# Modular Widget System

## Overview

The widget system is designed to be completely modular and standardized. Adding a new widget requires **zero animation code** - all animations, expansions, blur effects, and modal overlays are handled automatically by the `WidgetScreen`.

## Standardized Widget Architecture

Every widget follows a **dual-view pattern**:

### 1. Small Version (`expanded = false`)
- Compact view shown in the main scrollable list
- Shows key information at a glance
- Optimized for quick scanning
- **Designer decides** what's most important to display

### 2. Expanded Version (`expanded = true`)
- Full-featured view shown in modal overlay with blur background
- Can include additional base components, charts, detailed information
- More interactive elements and deeper functionality
- **Designer makes it pop** with rich content

Both views are controlled by the same component using the `expanded` prop.

## How to Add a New Widget

### Step 1: Create Your Widget Builder

Create a new file in `src/components/widgets/` (e.g., `MyNewWidget.tsx`):

```tsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import type { WidgetBuilder } from './widgetRegistry';

type MyNewWidgetPayload = {
  value: number;
  changePercent: number;
  breakdown: Record<string, number>;
};

const renderCondensedPages = (data: MyNewWidgetPayload) => [
  <View key="summary" style={styles.compact}>
    <Text style={styles.mainValue}>${data.value.toLocaleString()}</Text>
    <Text style={styles.subtitle}>{data.changePercent.toFixed(2)}%</Text>
  </View>,
];

const renderExpandedView = (data: MyNewWidgetPayload) => (
  <View style={styles.expandedContent}>
    <Text style={styles.sectionTitle}>Detailed Breakdown</Text>
    {Object.entries(data.breakdown).map(([label, amount]) => (
      <View key={label} style={styles.statsRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>${amount.toLocaleString()}</Text>
      </View>
    ))}
  </View>
);

export const buildMyNewWidget: WidgetBuilder<MyNewWidgetPayload> = (data) => ({
  title: 'My New Widget',
  condensedPages: renderCondensedPages(data),
  expandedContent: renderExpandedView(data),
});

const styles = StyleSheet.create({
  compact: {
    gap: 4,
  },
  mainValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  expandedContent: {
    gap: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    opacity: 0.7,
  },
  statValue: {
    fontWeight: '600',
  },
});
```

### Step 2: Export Your Builder

Add your widget to `src/components/widgets/index.ts`:

```tsx
export { buildMyNewWidget } from './MyNewWidget';
```

### Step 3: Register Your Widget Builder

Add your widget to `src/components/widgets/widgetRegistry.ts`:

```tsx
import { buildMyNewWidget } from './MyNewWidget';

export const widgetBuilderRegistry = {
  ...widgetBuilderRegistry,
  MyNewWidget: buildMyNewWidget,
};
```

### That's It! 🎉

Your new widget will automatically:
- ✅ Render in the WidgetScreen
- ✅ Support tap-to-expand with spring animation
- ✅ Show in a modal overlay when expanded
- ✅ Have a blurred background effect
- ✅ Scale smoothly with fade animations
- ✅ Support tap outside to close

## Widget Builder Contract

Every widget builder must return a `WidgetRenderDefinition`:

- `title: string` – Text shown in the NeoCard header
- `condensedPages: ReactElement[]` – Pages for the condensed carousel
- `expandedContent: ReactElement` – Full layout for the expanded overlay

Widgets focus solely on generating these React elements. NeoCard handles:

- Pagination and horizontal snapping
- Expand/collapse controls and buttons
- Sticky header + modal animation for expanded content

## Runtime Configuration

Dashboards (both sample `widgetConfig` and JSON-driven dashboards) reference widgets by **type string**. The builder registry maps that type to an implementation.

```tsx
import { widgetBuilderRegistry } from './widgetRegistry';

widgetBuilderRegistry.MyNewWidget = buildMyNewWidget;
```

The runtime config simply lists which widgets appear and provides payload data:

```jsonc
{
  "id": "portfolio-overview",
  "name": "Portfolio Overview",
  "widgets": [
    {
      "id": "portfolio-1",
      "type": "PortfolioCard",
      "data": {
        "value": 45200,
        "gain": 12.5
      }
    }
  ]
}
```

## Examples

See `TotalBalanceCard.tsx` and `PortfolioCard.tsx` for complete examples.

---

## Future: Backend Integration Architecture

### Overview

In the final version, each widget will have:
1. **2 Frontend Designs** - Small and expanded views (✅ Already implemented)
2. **1 Backend Function** - API endpoint that serves data to the widget (🔮 Future)

### How Backend Integration Will Work

#### 1. Widget Registry Configuration

Add `dataEndpoint` and optional `refreshInterval` to widget configs:

```tsx
// widgetRegistry.ts
export const widgetConfig: WidgetConfig[] = [
  {
    id: 'balance-1',
    component: TotalBalanceCard,
    dataEndpoint: '/api/widgets/balance',     // Backend endpoint
    refreshInterval: 60000,                   // Refresh every 60 seconds
  },
  {
    id: 'portfolio-1',
    component: PortfolioCard,
    dataEndpoint: '/api/widgets/portfolio',
    refreshInterval: 30000,
  },
];
```

#### 2. Create Backend Endpoints

Each widget gets its own API endpoint on your backend:

```python
# quantify-api (Python/Flask example)

@app.route('/api/widgets/balance', methods=['GET'])
def get_balance_widget_data():
    user_id = request.args.get('user_id')
    
    # Fetch data from database
    balance_data = {
        'total_balance': 128450.00,
        'change_percent': 5.2,
        'chart_data': [100, 70, 110, 80, 50, 100],
        'updated_at': datetime.now().isoformat()
    }
    
    return jsonify(balance_data)

@app.route('/api/widgets/portfolio', methods=['GET'])
def get_portfolio_widget_data():
    user_id = request.args.get('user_id')
    
    # Fetch portfolio data
    portfolio_data = {
        'value': 45200.00,
        'gain_percent': 12.5,
        'top_performers': [
            {'sector': 'Tech', 'gain': 18},
            {'sector': 'Healthcare', 'gain': 14}
        ]
    }
    
    return jsonify(portfolio_data)
```

#### 3. Create Data Fetching Hook

Create a custom hook to manage data fetching for widgets:

```tsx
// src/hooks/useWidgetData.ts

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo'; // Your auth solution

export const useWidgetData = (widgetId: string, endpoint?: string, refreshInterval?: number) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  const fetchData = async () => {
    if (!endpoint) return;
    
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch widget data');
      
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [endpoint, widgetId]);

  // Auto-refresh at interval
  useEffect(() => {
    if (!refreshInterval) return;
    
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error, refetch: fetchData };
};
```

#### 4. Update WidgetScreen to Fetch Data

Modify `WidgetScreen.tsx` to fetch data for each widget:

```tsx
// WidgetScreen.tsx (Future implementation)

{widgetConfig.map((widget) => {
  const builder = getWidgetBuilder(widget.type);
  if (!builder) return null;

  const { data } = useWidgetData(
    widget.id,
    widget.dataEndpoint,
    widget.refreshInterval
  );

  const definition = builder(data);

  return (
    <NeoCard
      key={widget.id}
      title={definition.title}
      condensedPages={definition.condensedPages}
      expandedView={definition.expandedContent}
      onExpand={() => handleExpand(widget.id)}
      expanded={false}
    />
  );
})}
```

#### 5. Use Data in Widget Component

Update your widget to use the fetched data:

```tsx
// TotalBalanceCard.tsx (Future implementation)

export const buildTotalBalanceCard: WidgetBuilder<TotalBalanceCardPayload> = (data) => {
  const balance = data.total_balance ?? 0;
  const changePercent = data.change_percent ?? 0;
  const chartData = data.chart_data ?? [];

  const condensedPages = [
    <View key="summary">
      <Text style={styles.value}>{currency(balance)}</Text>
      <Text style={styles.change}>
        {changePercent > 0 ? '+' : ''}{changePercent}%
      </Text>
    </View>,
  ];

  const expandedContent = (
    <View style={styles.expandedContent}>
      {chartData.length > 0 && <LineChart data={chartData} />}
      <Text style={styles.detail}>Updated just now</Text>
    </View>
  );

  return {
    title: 'Total Balance',
    condensedPages,
    expandedContent,
  };
};
```

### Benefits of This Architecture

✅ **Separation of Concerns**
- Frontend focuses on UI/UX design
- Backend focuses on data logic and business rules
- Easy to test each layer independently

✅ **Reusable Data Fetching**
- One `useWidgetData` hook serves all widgets
- Automatic caching and refresh logic
- Centralized error handling

✅ **Scalable**
- Add new widgets by just creating endpoint + component
- No changes needed to core fetching logic
- Each widget is independent

✅ **Flexible**
- Each widget can have different refresh intervals
- Easy to add loading states, error boundaries
- Can implement pull-to-refresh for all widgets

### Implementation Checklist (When Ready)

- [ ] Set up API base URL and configuration
- [ ] Create backend endpoints for each widget type
- [ ] Implement `useWidgetData` hook
- [ ] Add `dataEndpoint` to `WidgetConfig` type
- [ ] Update `WidgetScreen` to use the hook
- [ ] Update widget components to consume `data` prop
- [ ] Add loading and error states to widgets
- [ ] Implement pull-to-refresh functionality
- [ ] Add offline support with cached data
- [ ] Set up proper authentication headers

## Architecture

- **WidgetScreen.tsx** - Handles all animation logic and rendering
- **widgetRegistry.ts** - Central registry of all widgets
- **NeoCard.tsx** - Base card component with neobrutalist styling
- **Individual Widget Components** - Focus only on their content

This separation of concerns means:
- Widget components are simple and focused
- Animation code is centralized and reusable
- Adding new widgets requires minimal code
- No duplication of animation logic

