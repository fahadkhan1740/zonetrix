/**
 * ZonetrixCanvas - Main canvas component
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createArcLayout } from '../core/layout-arc';
import { createCircleLayout } from '../core/layout-circle';
import { createGridLayout } from '../core/layout-grid';
import { createSectionsLayout } from '../core/layout-sections';
import { calculateBoundingBox, findAngularNeighbor, findGridNeighbor } from '../core/math';
import type { Cell, LayoutConfig, RenderTheme } from '../core/models';
import { ZonetrixCell } from './ZonetrixCell';
import { ZonetrixLayer } from './ZonetrixLayer';

export interface ZonetrixProps {
  /** Layout configuration */
  layout: LayoutConfig;
  /** Controlled selection: array of cell labels */
  value?: string[];
  /** Uncontrolled default selection */
  defaultValue?: string[];
  /** Selection change handler */
  onSelectionChange?: (selected: string[]) => void;
  /** Cell click handler */
  onCellClick?: (cell: Cell) => void;
  /** Cell hover handler */
  onCellHover?: (cell: Cell | null) => void;
  /** Custom label generator */
  getCellLabel?: (cell: Cell) => string;
  /** Predicate to determine if a cell is selectable */
  selectablePredicate?: (cell: Cell) => boolean;
  /** Render theme */
  theme?: RenderTheme;
  /** Text direction */
  dir?: 'ltr' | 'rtl';
  /** Additional class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Enable pan/zoom (future feature, placeholder) */
  enablePanZoom?: boolean;
}

export function ZonetrixCanvas({
  layout,
  value,
  defaultValue,
  onSelectionChange,
  onCellClick,
  onCellHover,
  getCellLabel,
  selectablePredicate,
  theme,
  dir = 'ltr',
  className = '',
  style,
  enablePanZoom: _enablePanZoom = false,
}: ZonetrixProps) {
  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const [internalSelection, setInternalSelection] = useState<string[]>(defaultValue || []);
  const selection = isControlled ? value : internalSelection;

  const [focusedCellLabel, setFocusedCellLabel] = useState<string | null>(null);
  const [_hoveredCell, setHoveredCell] = useState<Cell | null>(null);

  const containerRef = useRef<SVGSVGElement>(null);

  // Generate cells from layout configuration (memoized)
  const cells = useMemo(() => {
    let generatedCells: Cell[];

    switch (layout.type) {
      case 'grid':
        generatedCells = createGridLayout(layout);
        break;
      case 'arc':
        generatedCells = createArcLayout(layout);
        break;
      case 'circle':
        generatedCells = createCircleLayout(layout);
        break;
      case 'sections':
        generatedCells = createSectionsLayout(layout);
        break;
      default:
        generatedCells = [];
    }

    // Apply custom labels if provided
    if (getCellLabel) {
      generatedCells = generatedCells.map((cell) => ({
        ...cell,
        meta: {
          ...cell.meta,
          label: getCellLabel(cell),
        },
      }));
    }

    return generatedCells;
  }, [layout, getCellLabel]);

  // Create label -> cell map
  const cellsByLabel = useMemo(() => {
    const map = new Map<string, Cell>();
    for (const cell of cells) {
      const label = cell.meta?.label;
      if (label) {
        map.set(label, cell);
      }
    }
    return map;
  }, [cells]);

  // Calculate viewBox
  const viewBox = useMemo(() => {
    const bbox = calculateBoundingBox(cells);
    const padding = 20;
    return {
      x: bbox.minX - padding,
      y: bbox.minY - padding,
      width: bbox.width + padding * 2,
      height: bbox.height + padding * 2,
    };
  }, [cells]);

  // Handle cell click
  const handleCellClick = useCallback(
    (cell: Cell) => {
      const label = cell.meta?.label;
      if (!label) return;

      // Check if selectable
      const isSelectable = selectablePredicate ? selectablePredicate(cell) : true;
      const isAvailable = cell.meta?.status === 'available';

      if (!isSelectable || !isAvailable) return;

      // Toggle selection
      const newSelection = selection.includes(label)
        ? selection.filter((l) => l !== label)
        : [...selection, label];

      if (!isControlled) {
        setInternalSelection(newSelection);
      }

      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }

      if (onCellClick) {
        onCellClick(cell);
      }
    },
    [selection, isControlled, selectablePredicate, onSelectionChange, onCellClick]
  );

  // Handle cell hover
  const handleCellMouseEnter = useCallback(
    (cell: Cell) => {
      setHoveredCell(cell);
      if (onCellHover) {
        onCellHover(cell);
      }
    },
    [onCellHover]
  );

  const handleCellMouseLeave = useCallback(() => {
    setHoveredCell(null);
    if (onCellHover) {
      onCellHover(null);
    }
  }, [onCellHover]);

  // Handle cell focus
  const handleCellFocus = useCallback((cell: Cell) => {
    const label = cell.meta?.label;
    if (label) {
      setFocusedCellLabel(label);
    }
  }, []);

  const handleCellBlur = useCallback(() => {
    setFocusedCellLabel(null);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!focusedCellLabel) return;

      const currentCell = cellsByLabel.get(focusedCellLabel);
      if (!currentCell) return;

      let neighbor: Cell | null = null;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        neighbor =
          layout.type === 'grid' || layout.type === 'sections'
            ? findGridNeighbor(cells, currentCell, 'up', dir === 'rtl')
            : null;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        neighbor =
          layout.type === 'grid' || layout.type === 'sections'
            ? findGridNeighbor(cells, currentCell, 'down', dir === 'rtl')
            : null;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        neighbor =
          layout.type === 'grid' || layout.type === 'sections'
            ? findGridNeighbor(cells, currentCell, 'left', dir === 'rtl')
            : layout.type === 'arc' || layout.type === 'circle'
              ? findAngularNeighbor(
                  cells,
                  currentCell,
                  'left',
                  layout.origin?.x || 0,
                  layout.origin?.y || 0,
                  dir === 'rtl'
                )
              : null;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        neighbor =
          layout.type === 'grid' || layout.type === 'sections'
            ? findGridNeighbor(cells, currentCell, 'right', dir === 'rtl')
            : layout.type === 'arc' || layout.type === 'circle'
              ? findAngularNeighbor(
                  cells,
                  currentCell,
                  'right',
                  layout.origin?.x || 0,
                  layout.origin?.y || 0,
                  dir === 'rtl'
                )
              : null;
      }

      if (neighbor?.meta?.label) {
        setFocusedCellLabel(neighbor.meta.label);
        // Focus the neighbor element
        const neighborLabel = neighbor.meta.label;
        const neighborElement = containerRef.current?.querySelector(
          `[aria-label="Seat ${neighborLabel}"]`
        ) as SVGElement | null;
        if (neighborElement) {
          neighborElement.focus();
        }
      }
    },
    [focusedCellLabel, cellsByLabel, cells, layout, dir]
  );

  // Apply theme variables
  useEffect(() => {
    if (!containerRef.current || !theme) return;

    const root = containerRef.current;
    if (theme.cellRadius !== undefined)
      root.style.setProperty('--ztx-cell-radius', `${theme.cellRadius}px`);
    if (theme.seatColor) root.style.setProperty('--ztx-seat-color', theme.seatColor);
    if (theme.seatColorSelected)
      root.style.setProperty('--ztx-seat-color-selected', theme.seatColorSelected);
    if (theme.seatColorUnavailable)
      root.style.setProperty('--ztx-seat-color-unavailable', theme.seatColorUnavailable);
    if (theme.seatBorder) root.style.setProperty('--ztx-seat-border', theme.seatBorder);
    if (theme.fontFamily) root.style.setProperty('--ztx-font-family', theme.fontFamily);
    if (theme.fontSize !== undefined)
      root.style.setProperty('--ztx-font-size', `${theme.fontSize}px`);
  }, [theme]);

  return (
    <div
      className={`zonetrix ${className}`.trim()}
      dir={dir}
      style={style}
      onKeyDown={handleKeyDown}
    >
      <svg
        ref={containerRef}
        className="zonetrix-svg"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        role="grid"
        aria-label="Venue seating layout"
      >
        <ZonetrixLayer>
          {cells.map((cell) => {
            const label = cell.meta?.label || '';
            const isSelected = selection.includes(label);
            const isSelectable = selectablePredicate ? selectablePredicate(cell) : true;
            const isAvailable = cell.meta?.status === 'available';
            const isDisabled = !isSelectable || !isAvailable;

            // Determine tab index: first cell is tabbable, others are focusable via arrows
            const isFirstCell = cells[0] === cell;
            const isFocused = label === focusedCellLabel;
            const tabIndex = isFirstCell || isFocused ? 0 : -1;

            return (
              <ZonetrixCell
                key={label || `${cell.id.row}-${cell.id.col}-${cell.id.index}`}
                cell={cell}
                selected={isSelected}
                disabled={isDisabled}
                theme={theme}
                onClick={handleCellClick}
                onMouseEnter={handleCellMouseEnter}
                onMouseLeave={handleCellMouseLeave}
                onFocus={handleCellFocus}
                onBlur={handleCellBlur}
                tabIndex={tabIndex}
              />
            );
          })}
        </ZonetrixLayer>
      </svg>
    </div>
  );
}
