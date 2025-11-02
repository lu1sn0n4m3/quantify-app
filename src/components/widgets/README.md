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

### Step 1: Create Your Widget Component

Create a new file in `src/components/widgets/` (e.g., `MyNewWidget.tsx`):

```tsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NeoCard } from '../base/NeoCard';
import { colors } from '../../theme/colors';
import { WidgetProps } from './widgetRegistry';

// Use the standardized WidgetProps type
export const MyNewWidget: React.FC<WidgetProps> = ({ 
  id,
  onExpand, 
  expanded = false,
  data, // Future: data from backend
}) => {
  return (
    <NeoCard 
      title="My New Widget" 
      onExpand={onExpand}
    >
      {/* SMALL VERSION - Always visible */}
      <Text style={styles.mainValue}>$42,000</Text>
      <Text style={styles.subtitle}>+5.2% this month</Text>
      
      {/* EXPANDED VERSION - Only shows when expanded */}
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Detailed Breakdown</Text>
          <Text style={styles.detailText}>
            Here you can add charts, more base components, 
            interactive elements, detailed statistics, etc.
          </Text>
          
          {/* Example: Add more components here */}
          <View style={styles.statsGrid}>
            <Text>Revenue: $30,000</Text>
            <Text>Expenses: $12,000</Text>
          </View>
        </View>
      )}
    </NeoCard>
  );
};

const styles = StyleSheet.create({
  mainValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 14,
    color: colors.ink,
    opacity: 0.7,
    marginTop: 4,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  detailText: {
    color: colors.ink,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsGrid: {
    marginTop: 8,
  },
});
```

### Step 2: Export Your Widget

Add your widget to `src/components/widgets/index.ts`:

```tsx
export { MyNewWidget } from './MyNewWidget';
```

### Step 3: Register Your Widget

Add your widget to `src/components/widgets/widgetRegistry.ts`:

```tsx
import { MyNewWidget } from './MyNewWidget';

export const widgetConfig: WidgetConfig[] = [
  // ... existing widgets
  {
    id: 'my-new-widget-1',  // unique id
    component: MyNewWidget,
  },
];
```

### That's It! 🎉

Your new widget will automatically:
- ✅ Render in the WidgetScreen
- ✅ Support tap-to-expand with spring animation
- ✅ Show in a modal overlay when expanded
- ✅ Have a blurred background effect
- ✅ Scale smoothly with fade animations
- ✅ Support tap outside to close

## Widget Props

All widgets must accept the standardized `WidgetProps`:

- `id: string` - Unique identifier for the widget instance
- `onExpand?: () => void` - Callback when expand button is pressed
- `expanded?: boolean` - Controls small vs expanded view
- `data?: any` - (Future) Data fetched from backend

## Additional Props

You can extend `WidgetProps` and pass additional props via the `props` field in the config:

```tsx
type MyWidgetProps = WidgetProps & {
  customProp?: string;
  anotherProp?: number;
};

export const MyWidget: React.FC<MyWidgetProps> = ({ 
  id, onExpand, expanded, data,
  customProp, anotherProp 
}) => {
  // Your widget implementation
};
```

Then in `widgetRegistry.ts`:

```tsx
{
  id: 'custom-widget-1',
  component: MyWidget,
  props: {
    customProp: 'custom value',
    anotherProp: 123,
  },
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
  const WidgetComponent = widget.component;
  
  // Fetch data for this widget
  const { data, loading, error } = useWidgetData(
    widget.id,
    widget.dataEndpoint,
    widget.refreshInterval
  );
  
  return (
    <WidgetComponent
      key={widget.id}
      id={widget.id}
      onExpand={() => handleExpand(widget.id)}
      expanded={false}
      data={data}                    // Pass fetched data
      {...(widget.props || {})}
    />
  );
})}
```

#### 5. Use Data in Widget Component

Update your widget to use the fetched data:

```tsx
// TotalBalanceCard.tsx (Future implementation)

export const TotalBalanceCard: React.FC<WidgetProps> = ({ 
  onExpand, 
  expanded = false,
  data,  // Data from backend
}) => {
  // Use data from backend or fallback to defaults
  const balance = data?.total_balance || 0;
  const changePercent = data?.change_percent || 0;
  const chartData = data?.chart_data || [];
  
  return (
    <NeoCard title="Total Balance" onExpand={onExpand}>
      <Text style={styles.value}>{currency(balance)}</Text>
      <Text style={styles.change}>
        {changePercent > 0 ? '+' : ''}{changePercent}%
      </Text>
      
      {chartData.length > 0 && (
        <LineChart data={chartData} />
      )}
      
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Expanded view with more detailed data */}
        </View>
      )}
    </NeoCard>
  );
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

