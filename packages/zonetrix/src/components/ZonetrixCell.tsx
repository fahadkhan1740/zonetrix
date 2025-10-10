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
  onClick?: (cell: Cell) => void;
  onMouseEnter?: (cell: Cell) => void;
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
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    tabIndex = -1,
  }) => {
    const { x, y, w, h, rotation = 0, meta } = cell;
    const label = meta?.label || '';
    const status = meta?.status || 'available';

    const cellRadius = theme?.cellRadius ?? 4;
    const isUnavailable = status !== 'available' || disabled;

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

    const handleMouseEnter = () => {
      if (onMouseEnter) {
        onMouseEnter(cell);
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
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <g
        className={classNames}
        transform={`translate(${x}, ${y}) rotate(${rotation})`}
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
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={cellRadius}
          ry={cellRadius}
        />
        <text className="zonetrix-cell-label" x={0} y={0}>
          {label}
        </text>
      </g>
    );
  }
);

ZonetrixCell.displayName = 'ZonetrixCell';
