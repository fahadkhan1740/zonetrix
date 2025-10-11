/**
 * ZonetrixTooltip - Tooltip component for displaying seat information on hover
 */

import { useEffect, useState } from 'react';
import type { Cell } from '../core/models';

export interface ZonetrixTooltipProps {
  /** Cell being hovered */
  cell: Cell | null;
  /** Whether the cell is selected */
  isSelected?: boolean;
  /** Section name (if in multi-section layout) */
  sectionName?: string;
  /** Mouse position for positioning tooltip */
  position?: { x: number; y: number };
  /** Custom class name */
  className?: string;
  /** Enable/disable tooltip */
  enabled?: boolean;
}

export function ZonetrixTooltip({
  cell,
  isSelected = false,
  sectionName,
  position,
  className = '',
  enabled = true,
}: ZonetrixTooltipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (cell && enabled) {
      // Small delay before showing tooltip for better UX
      const timer = setTimeout(() => setVisible(true), 150);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [cell, enabled]);

  if (!cell || !enabled || !visible) {
    return null;
  }

  const label = cell.meta?.label || 'N/A';
  const price = cell.meta?.price;
  const status = cell.meta?.status || 'available';

  const tooltipStyle: React.CSSProperties = position
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
      }
    : {};

  return (
    <div className={`zonetrix-tooltip ${className}`.trim()} style={tooltipStyle}>
      <div className="zonetrix-tooltip-content">
        {sectionName && (
          <div className="zonetrix-tooltip-section">
            <strong>{sectionName}</strong>
          </div>
        )}
        <div className="zonetrix-tooltip-seat">Seat: {label}</div>
        {price !== undefined && (
          <div className="zonetrix-tooltip-price">${price.toFixed(2)}</div>
        )}
        {isSelected && (
          <div className="zonetrix-tooltip-selected">✓ You selected this seat</div>
        )}
        {status === 'booked' && (
          <div className="zonetrix-tooltip-status">Already booked</div>
        )}
        {status === 'unavailable' && (
          <div className="zonetrix-tooltip-status">Unavailable</div>
        )}
      </div>
    </div>
  );
}
