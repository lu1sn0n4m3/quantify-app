# Widget Pagination Guide

> ⚠️ **Legacy Content:** This guide references the earlier component-based API. For the current builder-based approach, see `src/components/widgets/README.md`. The material below remains for historical context and will be updated soon.

This guide explains how to implement horizontal pagination in your widgets, allowing users to swipe through multiple "pages" of content without expanding the widget.

## Overview

Widgets can optionally implement **horizontal pagination** in their condensed view (when `expanded = false`). This allows you to show different content on multiple pages that users can swipe through horizontally.

**Example:** The `StockPriceCard` has 3 pages:
- Page 1: Stock price chart
- Page 2: Financial ratios
- Page 3: Analysis summary

## When to Use Pagination

Use pagination when you have:
- Multiple distinct sections of information
- Content that doesn't fit well in a single condensed view
- Information that benefits from being organized into discrete pages

**Don't use pagination** if:
- You only have one screen of content
- The information flows better vertically
- Users need to see multiple pieces of data at once

## Implementation Steps

### 1. Import Required Components

```tsx
import React, { useState, useRef } from 'react';
import { ScrollView, View, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { WidgetPageIndicator } from './WidgetPageIndicator';
```

### 2. Set Up State and Constants

```tsx
export const YourWidget: React.FC<WidgetProps> = ({ onExpand, expanded = false }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const CARD_WIDTH = Dimensions.get('window').width - 36; // Adjust for card margins
  
  // Your other state and logic...
}
```

### 3. Create Scroll Handler

```tsx
const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  const offsetX = event.nativeEvent.contentOffset.x;
  const page = Math.round(offsetX / CARD_WIDTH);
  setCurrentPage(page);
};
```

### 4. Create Page Render Functions

Break your content into separate render functions for each page:

```tsx
const renderPage1 = () => (
  <View style={[styles.page, { width: CARD_WIDTH }]}>
    {/* Page 1 content */}
  </View>
);

const renderPage2 = () => (
  <View style={[styles.page, { width: CARD_WIDTH }]}>
    {/* Page 2 content */}
  </View>
);

// Add more pages as needed...
```

### 5. Implement Conditional Rendering

In your component's return statement, show pagination in condensed view and all content in expanded view:

```tsx
return (
  <NeoCard title="Your Widget" onExpand={onExpand}>
    {!expanded ? (
      // CONDENSED VIEW: Show pagination
      <>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {renderPage1()}
          {renderPage2()}
          {/* Add more pages */}
        </ScrollView>
        <WidgetPageIndicator currentPage={currentPage} totalPages={2} />
      </>
    ) : (
      // EXPANDED VIEW: Show all content
      <View>
        {renderPage1()}
        <View style={styles.divider} />
        {renderPage2()}
        {/* Add more pages with dividers */}
      </View>
    )}
  </NeoCard>
);
```

### 6. Add Required Styles

```tsx
const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: -14, // Offset NeoCard padding to make pages full width
  },
  page: {
    paddingHorizontal: 14, // Restore padding for content inside pages
  },
  divider: {
    height: 2,
    backgroundColor: colors.ink,
    marginVertical: 16,
    opacity: 0.3,
  },
  // Your other styles...
});
```

## Complete Example

See `StockPriceCard.tsx` for a complete working implementation with 3 pages.

## Key Points

1. **Width calculation**: Always calculate page width based on screen width minus card margins (typically 36px total: 18px per side)

2. **Pagination indicator**: The `WidgetPageIndicator` component automatically shows/hides based on total pages (hidden if only 1 page)

3. **Expanded view**: In expanded view, show all pages vertically with dividers between them - no pagination

4. **ScrollView props**:
   - `horizontal`: Enable horizontal scrolling
   - `pagingEnabled`: Snap to pages
   - `showsHorizontalScrollIndicator={false}`: Hide scrollbar for clean look
   - `scrollEventThrottle={16}`: Update current page smoothly

5. **Performance**: Use `useRef` for ScrollView and avoid unnecessary re-renders

## Best Practices

- **3-5 pages max**: More than 5 pages becomes hard to navigate
- **Clear content separation**: Each page should have a distinct purpose
- **Consistent styling**: Keep typography and spacing consistent across pages
- **Visual hierarchy**: Use the same title styles and layout patterns
- **Test thoroughly**: Test swiping on different screen sizes

## Troubleshooting

**Pages don't snap correctly:**
- Check that `CARD_WIDTH` calculation matches your actual card width
- Ensure each page View has `width: CARD_WIDTH` style

**Pagination dots don't update:**
- Verify `scrollEventThrottle` is set (use 16)
- Check that `handleScroll` is calculating page correctly

**Content is cut off:**
- Make sure `scrollView` has `marginHorizontal: -14` to offset card padding
- Verify each `page` has `paddingHorizontal: 14` to restore spacing

## API Reference

### WidgetPageIndicator Props

```tsx
type WidgetPageIndicatorProps = {
  currentPage: number;  // Zero-indexed current page (0, 1, 2, etc.)
  totalPages: number;   // Total number of pages
};
```

The component automatically hides if `totalPages <= 1`.

