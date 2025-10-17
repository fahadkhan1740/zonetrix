# Tooltip Feature

The Zonetrix tooltip feature displays seat information when users hover over seats (desktop) or tap on seats (mobile/touch devices).

## Features

- **Automatic Positioning**: Tooltips automatically position themselves to stay within the viewport
- **Touch Support**: Works seamlessly on mobile devices with tap-to-show functionality
- **Rich Content**: Display section, seat number, pricing, status, and custom metadata
- **Customizable**: Control appearance, delays, and content rendering
- **Accessibility**: Maintains proper ARIA labels and keyboard navigation

## Basic Usage

```tsx
import { ZonetrixCanvas } from 'zonetrix';

function MyVenue() {
  return (
    <ZonetrixCanvas
      layout={myLayout}
      tooltip={{
        enabled: true,  // Enable tooltips (default: true)
        enableTouch: true,  // Enable touch mode (default: true)
      }}
    />
  );
}
```

## Configuration Options

The `tooltip` prop accepts a `TooltipConfig` object:

```typescript
interface TooltipConfig {
  /** Enable tooltip on hover/touch (default: true) */
  enabled?: boolean;

  /** Enable touch mode detection for mobile devices (default: true) */
  enableTouch?: boolean;

  /** Offset from cursor/touch point in pixels (default: { x: 12, y: 12 }) */
  offset?: { x: number; y: number };

  /** Delay before showing tooltip in milliseconds (default: 0) */
  showDelay?: number;

  /** Delay before hiding tooltip in milliseconds (default: 0) */
  hideDelay?: number;

  /** Custom render function for tooltip content */
  renderContent?: (cell: Cell) => React.ReactNode;
}
```

## Adding Pricing and Metadata

To display pricing and custom data in tooltips, add them to the cell metadata:

```tsx
// Using getCellLabel to enrich cells with pricing
const getCellLabel = (cell: Cell) => {
  // Calculate price based on row position
  const rowDistance = cell.id.row || 0;
  const basePrice = 100 - (rowDistance * 5);

  // Add price to cell metadata
  if (cell.meta) {
    cell.meta.price = Math.max(25, Math.min(100, basePrice));
    cell.meta.data = {
      category: basePrice >= 75 ? 'Premium' : 'Standard',
      amenities: ['WiFi', 'Cupholders'],
    };
  }

  return cell.meta?.label || '';
};

<ZonetrixCanvas
  layout={myLayout}
  getCellLabel={getCellLabel}
  tooltip={{ enabled: true }}
/>
```

## Default Tooltip Content

The default tooltip displays:

1. **Section** (if available): "Section: VIP"
2. **Seat Number**: "Seat: A-12"
3. **Price** (if available): "Price: $75.00"
4. **Status Badge** (if not available): Shows booked/held/sold status
5. **Custom Data** (if available): Any additional metadata

## Custom Tooltip Content

Provide a custom render function to fully control tooltip appearance:

```tsx
<ZonetrixCanvas
  layout={myLayout}
  tooltip={{
    enabled: true,
    renderContent: (cell) => (
      <div className="my-custom-tooltip">
        <h3>{cell.meta?.label}</h3>
        <p>Section: {cell.id.sectionId}</p>
        {cell.meta?.price && (
          <p className="price">${cell.meta.price.toFixed(2)}</p>
        )}
        <p className="status">{cell.meta?.status}</p>
      </div>
    ),
  }}
/>
```

## Mobile/Touch Behavior

On touch devices:
- **Tap a seat**: Shows the tooltip near the tapped seat
- **Tap another seat**: Switches to the new seat
- **Tap outside**: Hides the tooltip
- Tooltip remains visible until dismissed (no auto-hide on touch)

On desktop:
- **Hover over seat**: Shows tooltip following mouse cursor
- **Move cursor away**: Hides tooltip after `hideDelay`
- Tooltip follows cursor position while hovering

## Styling

Customize tooltip appearance using CSS variables:

```css
:root {
  /* Tooltip container */
  --ztx-tooltip-bg: #ffffff;
  --ztx-tooltip-border: #e2e8f0;
  --ztx-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --ztx-tooltip-radius: 8px;
  --ztx-tooltip-padding: 12px;
  --ztx-tooltip-min-width: 180px;
  --ztx-tooltip-max-width: 280px;

  /* Text colors */
  --ztx-tooltip-text: #1e293b;
  --ztx-tooltip-label-color: #64748b;
  --ztx-tooltip-value-color: #1e293b;
  --ztx-tooltip-price-color: #059669;

  /* Divider */
  --ztx-tooltip-divider: #e2e8f0;
}

/* Dark mode support is built-in */
@media (prefers-color-scheme: dark) {
  :root {
    --ztx-tooltip-bg: #1e293b;
    --ztx-tooltip-border: #334155;
    --ztx-tooltip-text: #f1f5f9;
    /* ... more dark mode variables */
  }
}
```

## Advanced Examples

### Dynamic Pricing

```tsx
const getCellLabel = (cell: Cell) => {
  const seatType = determineSeatType(cell);
  const eventDate = new Date('2025-12-25');
  const dynamicPrice = calculateDynamicPrice(seatType, eventDate);

  if (cell.meta) {
    cell.meta.price = dynamicPrice;
    cell.meta.data = {
      seatType,
      eventDate: eventDate.toLocaleDateString(),
    };
  }

  return cell.meta?.label || '';
};
```

### Custom Delay Configuration

```tsx
// Show tooltip after 200ms hover, hide after 100ms
<ZonetrixCanvas
  layout={myLayout}
  tooltip={{
    enabled: true,
    showDelay: 200,
    hideDelay: 100,
  }}
/>
```

### Disable Tooltips

```tsx
// Completely disable tooltips
<ZonetrixCanvas
  layout={myLayout}
  tooltip={{ enabled: false }}
/>
```

## TypeScript Support

Full TypeScript support is included:

```typescript
import type { TooltipConfig, Cell } from 'zonetrix';

const tooltipConfig: TooltipConfig = {
  enabled: true,
  enableTouch: true,
  offset: { x: 15, y: 15 },
  renderContent: (cell: Cell) => {
    return <div>{cell.meta?.label}</div>;
  },
};
```

## Best Practices

1. **Keep tooltip content concise**: Display only essential information
2. **Consider mobile users**: Test tap interactions on touch devices
3. **Use appropriate delays**: Avoid showing tooltips too quickly (can be distracting)
4. **Provide pricing context**: Always include currency symbols and formatting
5. **Test viewport boundaries**: Ensure tooltips don't overflow on small screens
6. **Maintain accessibility**: The tooltip enhances but doesn't replace ARIA labels

## Troubleshooting

**Tooltip not showing:**
- Ensure `tooltip.enabled` is `true`
- Check that cells have valid metadata
- Verify CSS is properly imported

**Tooltip positioning issues:**
- Adjust `offset` values in the configuration
- Check container positioning styles
- Ensure tooltip z-index is appropriate

**Touch not working:**
- Verify `enableTouch` is `true`
- Check for event handler conflicts
- Test on actual touch devices (not just browser emulation)
