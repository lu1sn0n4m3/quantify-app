# Widget Development Guide

This guide explains how to create widgets in the new payload-based architecture. Widgets are self-contained components that display data from JSON payloads, with separate layouts for condensed and expanded views.

## Table of Contents

1. [What Defines a Widget](#what-defines-a-widget)
2. [Defining a Payload Type](#defining-a-payload-type)
3. [Creating Condensed View Pages](#creating-condensed-view-pages)
4. [Creating Expanded View](#creating-expanded-view)
5. [Complete Widget Example](#complete-widget-example)
6. [Registering Your Widget](#registering-your-widget)

---

## What Defines a Widget

A widget is a React component that:

1. **Accepts a typed payload** - Receives data via the `data` prop (JSON from API)
2. **Generates its own title** - Creates header from payload (e.g., "AAPL - Apple Inc.")
3. **Defines condensed pages** - Returns array of page components for pagination
4. **Defines expanded view** - Returns single component for full-screen view
5. **Uses NeoCard template** - Renders through NeoCard which handles pagination, page indicator, and expand button

### Widget Props Interface

```typescript
type WidgetProps<T = any> = {
  id: string;                    // Unique identifier
  data: T;                       // Payload data (typed per widget)
  onExpand?: () => void;         // Expand button callback
  expanded?: boolean;            // Condensed vs expanded view
};
```

### Widget Structure

```typescript
export const YourWidget: React.FC<WidgetProps<YourPayloadType>> = ({ 
  data,
  onExpand, 
  expanded = false,
}) => {
  // 1. Generate title from payload
  const title = getTitle(data);
  
  // 2. Create condensed view pages
  const condensedPages = renderCondensedPages(data);
  
  // 3. Create expanded view
  const expandedViewContent = renderExpandedView(data);

  // 4. Render using NeoCard template
  return (
    <NeoCard
      title={title}
      onExpand={onExpand}
      expanded={expanded}
      condensedPages={expanded ? [] : condensedPages}
      expandedView={expandedViewContent}
    />
  );
};
```

---

## Defining a Payload Type

The payload defines the JSON structure your widget expects from the API. Each widget should define its own payload type.

### Step 1: Create TypeScript Interface

```typescript
/**
 * YourWidget Payload Type
 * Defines the JSON structure expected from the API
 */
export type YourWidgetPayload = {
  // Required fields
  field1: string;
  field2: number;
  
  // Optional fields
  field3?: string;
  
  // Complex structures
  nestedData: {
    key: string;
    value: number;
  };
  
  // Dictionary/Record types
  items: Record<string, number>; // Date -> Price mapping
};
```

### Step 2: Example - Stock Price Card Payload

```typescript
export type StockPriceCardPayload = {
  ticker: string;                              // "AAPL"
  name: string;                                // "Apple Inc."
  prices: Record<string, number>;              // {"2024-01-01": 145.50, ...}
  financial_ratios: Record<string, string | number>; // {"P/E Ratio": 28.45, ...}
  summary: string;                             // "Analysis summary text..."
};
```

### Best Practices

- **Use descriptive names** - Make field names clear and self-documenting
- **Type everything** - Use TypeScript types, avoid `any` when possible
- **Document the structure** - Add comments explaining complex fields
- **Consider optional fields** - Use `?` for fields that might not always be present
- **Use Record for dictionaries** - `Record<string, number>` for date->price mappings

---

## Creating Condensed View Pages

The condensed view displays multiple "pages" that users can swipe through horizontally. Each page is a separate React element.

### Architecture

- **Pages are separate** - Each page is a self-contained component
- **Array of pages** - Return `React.ReactElement[]` from `renderCondensedPages()`
- **Pagination handled by NeoCard** - You just define the pages, NeoCard handles scrolling
- **Single page widgets** - If you only have one page, return an array with one element

### Step 1: Create Page Rendering Functions

```typescript
/**
 * Render Page 1: Main content
 */
const renderPage1 = (data: YourPayloadType): React.ReactElement => {
  return (
    <View style={styles.pageInner}>
      <Text style={styles.title}>{data.field1}</Text>
      <Text style={styles.value}>{data.field2}</Text>
    </View>
  );
};

/**
 * Render Page 2: Secondary content
 */
const renderPage2 = (data: YourPayloadType): React.ReactElement => {
  return (
    <View style={styles.pageInner}>
      <Text style={styles.sectionTitle}>Details</Text>
      {/* More content */}
    </View>
  );
};
```

### Step 2: Combine Pages into Array

```typescript
/**
 * Render all condensed view pages
 */
const renderCondensedPages = (data: YourPayloadType): React.ReactElement[] => {
  return [
    renderPage1(data),
    renderPage2(data),
    // Add more pages as needed
  ];
};
```

### Step 3: Single Page Widget

If your widget only needs one page:

```typescript
const renderCondensedPages = (data: YourPayloadType): React.ReactElement[] => {
  return [
    <View key="main" style={styles.pageInner}>
      {/* Your single page content */}
    </View>
  ];
};
```

### Page Styling Guidelines

- **Use `pageInner` style** - Provides consistent padding and width
- **Full width available** - Pages take full card width minus padding
- **No horizontal scrolling** - Each page is one full-width view
- **Vertical scrolling OK** - Pages can scroll vertically if needed

### Example: StockPriceCard Pages

```typescript
// Page 1: Price Chart
const renderPricePage = (data: StockPriceCardPayload): React.ReactElement => {
  const priceInfo = getPriceChange(data.prices);
  return (
    <View style={styles.pageInner}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${priceInfo.current.toFixed(2)}</Text>
        <Text style={styles.change}>+{priceInfo.changePercent}%</Text>
      </View>
      <Svg viewBox="0 0 300 120">
        {/* Chart rendering */}
      </Svg>
    </View>
  );
};

// Page 2: Financial Ratios
const renderRatiosPage = (data: StockPriceCardPayload): React.ReactElement => {
  return (
    <View style={styles.pageInner}>
      <Text style={styles.sectionTitle}>Financial Ratios</Text>
      <View style={styles.ratiosGrid}>
        {Object.entries(data.financial_ratios).map(([label, value]) => (
          <View key={label} style={styles.ratioItem}>
            <Text style={styles.ratioLabel}>{label}</Text>
            <Text style={styles.ratioValue}>{String(value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Combine pages
const renderCondensedPages = (data: StockPriceCardPayload): React.ReactElement[] => {
  return [
    renderPricePage(data),
    renderRatiosPage(data),
    renderSummaryPage(data),
  ];
};
```

---

## Creating Expanded View

The expanded view is a completely separate layout from the condensed view. This allows you to create richer visualizations, more detailed charts, and different arrangements of data.

### Key Principles

- **Completely separate** - Don't reuse condensed page components directly
- **Full vertical scroll** - All content in one scrollable view
- **Richer visualizations** - Can have more detailed charts, larger images, etc.
- **Different layout** - Can arrange data differently than condensed view

### Step 1: Create Expanded View Function

```typescript
/**
 * Render expanded view (completely separate layout)
 */
const renderExpandedView = (data: YourPayloadType): React.ReactElement => {
  return (
    <View style={styles.expandedContent}>
      {/* Section 1 */}
      <View style={styles.expandedSection}>
        <Text style={styles.sectionTitle}>Main Content</Text>
        {/* Richer visualization here */}
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Section 2 */}
      <View style={styles.expandedSection}>
        <Text style={styles.sectionTitle}>Details</Text>
        {/* More detailed content */}
      </View>
    </View>
  );
};
```

### Step 2: Use Dividers Between Sections

```typescript
const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: colors.ink,
    marginVertical: 16,
    opacity: 0.3,
    marginHorizontal: 14,
    alignSelf: 'stretch',
  },
  expandedSection: {
    width: '100%',
  },
});
```

### Step 3: Example - StockPriceCard Expanded View

```typescript
const renderExpandedView = (data: StockPriceCardPayload): React.ReactElement => {
  return (
    <View style={styles.expandedContent}>
      {/* Price Chart Section - Larger chart in expanded */}
      <View style={styles.expandedSection}>
        {renderPricePage(data)}
        {/* Could add more detailed chart here */}
      </View>
      
      <View style={styles.divider} />
      
      {/* Financial Ratios Section */}
      <View style={styles.expandedSection}>
        {renderRatiosPage(data)}
      </View>
      
      <View style={styles.divider} />
      
      {/* Summary Section */}
      <View style={styles.expandedSection}>
        {renderSummaryPage(data, false)}
      </View>
    </View>
  );
};
```

### Expanded View Best Practices

- **Reuse logic, not components** - Extract helper functions for data processing
- **Use dividers** - Separate major sections visually
- **Larger visualizations** - Take advantage of extra space
- **More context** - Add explanatory text, tooltips, etc.
- **Different arrangements** - Don't feel constrained by condensed layout

---

## Complete Widget Example

Here's a complete example of a simple widget:

```typescript
/**
 * MyWidget Component
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NeoCard } from '../base/NeoCard';
import { colors } from '../../theme/colors';
import { WidgetProps } from './widgetRegistry';

/**
 * MyWidget Payload Type
 */
export type MyWidgetPayload = {
  title: string;
  value: number;
  description: string;
};

/**
 * Generate title from payload
 */
const getTitle = (data: MyWidgetPayload): string => {
  return data.title;
};

/**
 * Render condensed view (single page)
 */
const renderCondensedPages = (data: MyWidgetPayload): React.ReactElement[] => {
  return [
    <View key="main" style={styles.pageInner}>
      <Text style={styles.value}>{data.value}</Text>
      <Text style={styles.description}>{data.description}</Text>
    </View>
  ];
};

/**
 * Render expanded view
 */
const renderExpandedView = (data: MyWidgetPayload): React.ReactElement => {
  return (
    <View style={styles.expandedContent}>
      <View style={styles.expandedSection}>
        <Text style={styles.value}>{data.value}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <Text style={styles.expandedText}>
          Additional detailed information that only appears in expanded view...
        </Text>
      </View>
    </View>
  );
};

/**
 * MyWidget Component
 */
export const MyWidget: React.FC<WidgetProps<MyWidgetPayload>> = ({ 
  data,
  onExpand, 
  expanded = false,
}) => {
  const title = getTitle(data);
  const condensedPages = renderCondensedPages(data);
  const expandedViewContent = renderExpandedView(data);

  return (
    <NeoCard
      title={title}
      onExpand={onExpand}
      expanded={expanded}
      condensedPages={expanded ? [] : condensedPages}
      expandedView={expandedViewContent}
    />
  );
};

const styles = StyleSheet.create({
  pageInner: {
    width: '100%',
    paddingHorizontal: 14,
  },
  value: {
    fontWeight: '800',
    fontSize: 24,
    color: colors.ink,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.ink,
    opacity: 0.7,
  },
  expandedContent: {
    // Expanded view layout
  },
  expandedSection: {
    width: '100%',
  },
  expandedText: {
    color: colors.ink,
    lineHeight: 20,
    marginTop: 12,
    fontSize: 14,
  },
});
```

---

## Registering Your Widget

After creating your widget, you need to register it in two places:

### Step 1: Add to Widget Component Registry

In `src/components/widgets/widgetComponentRegistry.ts`:

```typescript
import { MyWidget } from './MyWidget';

export const widgetComponentRegistry: Record<string, WidgetComponent> = {
  TotalBalanceCard,
  PortfolioCard,
  StockPriceCard,
  MyWidget, // Add your widget here
};
```

### Step 2: Add to Widget Registry (for WidgetScreen)

In `src/components/widgets/widgetRegistry.ts`:

```typescript
import { MyWidget } from './MyWidget';

export const widgetConfig: WidgetConfig[] = [
  // ... existing widgets
  {
    id: 'my-widget-1',
    component: MyWidget,
    data: {
      title: 'My Widget Title',
      value: 12345,
      description: 'Widget description',
    },
  },
];
```

### Step 3: Add to Dashboard Config (for DashboardScreen)

In `src/config/dashboards.json`:

```json
{
  "dashboards": [
    {
      "id": "my-dashboard",
      "name": "My Dashboard",
      "widgets": [
        {
          "id": "my-widget-1",
          "type": "MyWidget",
          "data": {
            "title": "My Widget Title",
            "value": 12345,
            "description": "Widget description"
          }
        }
      ]
    }
  ]
}
```

---

## Quick Reference Checklist

When creating a new widget:

- [ ] Define payload type (`YourWidgetPayload`)
- [ ] Create `getTitle(data)` function
- [ ] Create `renderCondensedPages(data)` function (returns `React.ReactElement[]`)
- [ ] Create `renderExpandedView(data)` function (returns `React.ReactElement`)
- [ ] Create main widget component that uses NeoCard
- [ ] Add to `widgetComponentRegistry.ts`
- [ ] Add to `widgetRegistry.ts` (if using WidgetScreen)
- [ ] Add to `dashboards.json` (if using DashboardScreen)

---

## Tips & Best Practices

1. **Separate concerns**: Keep data processing logic separate from rendering
2. **Reuse helper functions**: Extract calculations, formatters, etc.
3. **Type everything**: Use TypeScript to catch errors early
4. **Test both views**: Make sure condensed and expanded views work independently
5. **Use consistent styling**: Follow the existing style patterns
6. **Handle edge cases**: What if data is missing? What if array is empty?
7. **Document your payload**: Clear comments help future developers

---

## See Also

- `StockPriceCard.tsx` - Complete example with pagination
- `TotalBalanceCard.tsx` - Simple single-page example
- `PortfolioCard.tsx` - Another simple example
- `NeoCard.tsx` - Widget template that handles pagination

