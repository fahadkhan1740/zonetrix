/**
 * ZonetrixCell - Individual cell renderer
 */

import { memo } from 'react';
import type { Cell, RenderTheme } from '../core/models';

export interface ZonetrixCellProps {
  cell: Cell;
  selected: boolean;
  disabled: boolean;
  theme?: RenderTheme;
  showLabel?: boolean;
  onClick?: (cell: Cell) => void;
  onMouseEnter?: (cell: Cell, event?: React.MouseEvent) => void;
  onMouseLeave?: (cell: Cell) => void;
  onFocus?: (cell: Cell) => void;
  onBlur?: () => void;
  tabIndex?: number;
}

export const ZonetrixCell = memo<ZonetrixCellProps>(
  ({
    cell,
    selected,
    disabled,
    theme,
    showLabel = true,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    tabIndex = -1,
  }) => {
    const { x, y, w, h, meta } = cell;
    const label = meta?.label || '';
    const status = meta?.status || 'available';

    const cellRadius = theme?.cellRadius ?? 4;
    const isUnavailable = status !== 'available' || disabled;
    const isBooked = status === 'booked';
    const isSold = status === 'sold';
    const isHeld = status === 'held';

    const handleClick = () => {
      if (!isUnavailable && onClick) {
        onClick(cell);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isUnavailable && onClick) {
          onClick(cell);
        }
      }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
      if (onMouseEnter) {
        onMouseEnter(cell, e);
      }
    };

    const handleMouseLeave = () => {
      if (onMouseLeave) {
        onMouseLeave(cell);
      }
    };

    const handleFocus = () => {
      if (onFocus) {
        onFocus(cell);
      }
    };

    const classNames = [
      'zonetrix-cell',
      selected && 'is-selected',
      isUnavailable && 'is-unavailable',
      isBooked && 'is-booked',
      isSold && 'is-sold',
      isHeld && 'is-held',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <g
        className={classNames}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        tabIndex={tabIndex}
        role="gridcell"
        aria-label={`Seat ${label}`}
        aria-selected={selected}
        aria-disabled={isUnavailable}
      >
        <rect
          className="zonetrix-cell-rect"
          x={x - w / 2}
          y={y - h / 2}
          width={w}
          height={h}
          rx={cellRadius}
          ry={cellRadius}
        />
        {showLabel && (
          <text className="zonetrix-cell-label" x={x} y={y}>
            {label}
          </text>
        )}
      </g>
    );
  }
);

ZonetrixCell.displayName = 'ZonetrixCell';
