/**
 * ZonetrixTooltip - Tooltip card component for seat information
 */

import { useEffect, useRef, useState } from 'react';
import type { Cell } from '../core/models';

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface ZonetrixTooltipProps {
  /** The cell to display information for */
  cell: Cell | null;
  /** Position of the tooltip */
  position: TooltipPosition;
  /** Whether the tooltip is visible */
  visible: boolean;
  /** Whether in touch mode (affects positioning) */
  isTouchMode?: boolean;
  /** Custom render function for tooltip content */
  renderContent?: (cell: Cell) => React.ReactNode;
  /** Additional class name */
  className?: string;
}

export function ZonetrixTooltip({
  cell,
  position,
  visible,
  isTouchMode = false,
  renderContent,
  className = '',
}: ZonetrixTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Adjust position to prevent tooltip from going off-screen
  useEffect(() => {
    if (!visible || !tooltipRef.current) {
      setAdjustedPosition(position);
      return;
    }

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Check right edge
    if (x + rect.width > viewportWidth - 10) {
      x = viewportWidth - rect.width - 10;
    }

    // Check left edge
    if (x < 10) {
      x = 10;
    }

    // Check bottom edge
    if (y + rect.height > viewportHeight - 10) {
      y = viewportHeight - rect.height - 10;
    }

    // Check top edge
    if (y < 10) {
      y = 10;
    }

    setAdjustedPosition({ x, y });
  }, [position, visible]);

  if (!visible || !cell) {
    return null;
  }

  const renderDefaultContent = () => {
    const { meta, id } = cell;
    const label = meta?.label || 'N/A';
    const price = meta?.price;
    const status = meta?.status || 'available';
    const sectionId = id.sectionId;
    const customData = meta?.data;

    return (
      <div className="zonetrix-tooltip-content">
        {sectionId && (
          <div className="zonetrix-tooltip-section">
            <span className="zonetrix-tooltip-label">Section:</span>
            <span className="zonetrix-tooltip-value">{sectionId}</span>
          </div>
        )}

        <div className="zonetrix-tooltip-seat">
          <span className="zonetrix-tooltip-label">Seat:</span>
          <span className="zonetrix-tooltip-value zonetrix-tooltip-seat-number">{label}</span>
        </div>

        {price !== undefined && (
          <div className="zonetrix-tooltip-price">
            <span className="zonetrix-tooltip-label">Price:</span>
            <span className="zonetrix-tooltip-value zonetrix-tooltip-price-amount">
              ${typeof price === 'number' ? price.toFixed(2) : price}
            </span>
          </div>
        )}

        {status !== 'available' && (
          <div className="zonetrix-tooltip-status">
            <span className={`zonetrix-tooltip-status-badge zonetrix-tooltip-status-${status}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )}

        {customData && Object.keys(customData).length > 0 && (
          <div className="zonetrix-tooltip-custom">
            {Object.entries(customData).map(([key, value]) => (
              <div key={key} className="zonetrix-tooltip-custom-item">
                <span className="zonetrix-tooltip-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="zonetrix-tooltip-value">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={tooltipRef}
      className={`zonetrix-tooltip ${isTouchMode ? 'is-touch' : 'is-mouse'} ${className}`.trim()}
      style={{
        position: 'fixed',
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {renderContent ? renderContent(cell) : renderDefaultContent()}
    </div>
  );
}
