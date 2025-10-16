/**
 * ZonetrixCanvas - Main canvas component
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createArcLayout } from '../core/layout-arc';
import { createCircleLayout } from '../core/layout-circle';
import { createGridLayout } from '../core/layout-grid';
import { createSectionsLayout } from '../core/layout-sections';
import { calculateBoundingBox, findAngularNeighbor, findGridNeighbor } from '../core/math';
import type {
  AxisLabelsConfig,
  Cell,
  LayoutConfig,
  LayoutObject,
  RenderTheme,
} from '../core/models';
import { useZoomPan } from '../hooks/useZoomPan';
import { ZonetrixCell } from './ZonetrixCell';
import { ZonetrixLayer } from './ZonetrixLayer';
import { ZonetrixZoomControls } from './ZonetrixZoomControls';

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
  /** Control whether seat labels are shown inside each cell */
  showSeatLabels?: boolean;
  /** Axis label configuration */
  axisLabels?: AxisLabelsConfig;
  /** Render theme */
  theme?: RenderTheme;
  /** Text direction */
  dir?: 'ltr' | 'rtl';
  /** Additional class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Enable pan/zoom controls and interactions */
  enablePanZoom?: boolean;
  /** Show zoom control buttons (default: true when enablePanZoom is true) */
  showZoomControls?: boolean;
  /** Minimum zoom level (default: 0.1) */
  minZoom?: number;
  /** Maximum zoom level (default: 5) */
  maxZoom?: number;
  /** Zoom speed/sensitivity (default: 0.1) */
  zoomSpeed?: number;
}

type AxisSettings = {
  enabled: boolean;
  showX: boolean;
  showY: boolean;
  position: { x: 'top' | 'bottom'; y: 'left' | 'right' };
  offset: number;
};

const EMPTY_BOUNDS = {
  minX: -50,
  maxX: 50,
  minY: -50,
  maxY: 50,
  width: 100,
  height: 100,
} as const;

export function ZonetrixCanvas({
  layout,
  value,
  defaultValue,
  onSelectionChange,
  onCellClick,
  onCellHover,
  getCellLabel,
  selectablePredicate,
  showSeatLabels = true,
  axisLabels,
  theme,
  dir = 'ltr',
  className = '',
  style,
  enablePanZoom = false,
  showZoomControls = true,
  minZoom = 0.1,
  maxZoom = 5,
  zoomSpeed = 0.1,
}: ZonetrixProps) {
  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const [internalSelection, setInternalSelection] = useState<string[]>(defaultValue || []);
  const selection = isControlled ? value : internalSelection;

  const [focusedCellLabel, setFocusedCellLabel] = useState<string | null>(null);
  const [_hoveredCell, setHoveredCell] = useState<Cell | null>(null);

  const containerRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize zoom/pan functionality
  const zoomPan = useZoomPan({
    minZoom,
    maxZoom,
    zoomSpeed,
    initialZoom: 1,
  });

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

  const layoutObjects = layout.objects ?? [];

  const axisSettings = useMemo<AxisSettings>(() => {
    const enabled = axisLabels?.enabled ?? false;
    return {
      enabled,
      showX: enabled ? axisLabels?.showX ?? true : false,
      showY: enabled ? axisLabels?.showY ?? true : false,
      position: {
        x: axisLabels?.position?.x ?? 'top',
        y: axisLabels?.position?.y ?? 'left',
      },
      offset: axisLabels?.offset ?? 36,
    };
  }, [axisLabels]);

  const cellsBounds = useMemo(() => calculateBoundingBox(cells), [cells]);

  const contentBounds = useMemo(() => {
    const hasCells = cells.length > 0;

    if (!hasCells && layoutObjects.length === 0) {
      return { ...EMPTY_BOUNDS };
    }

    let minX = hasCells ? cellsBounds.minX : Number.POSITIVE_INFINITY;
    let minY = hasCells ? cellsBounds.minY : Number.POSITIVE_INFINITY;
    let maxX = hasCells ? cellsBounds.maxX : Number.NEGATIVE_INFINITY;
    let maxY = hasCells ? cellsBounds.maxY : Number.NEGATIVE_INFINITY;

    if (hasCells) {
      minX = Math.min(minX, cellsBounds.minX);
      minY = Math.min(minY, cellsBounds.minY);
      maxX = Math.max(maxX, cellsBounds.maxX);
      maxY = Math.max(maxY, cellsBounds.maxY);
    }

    for (const object of layoutObjects) {
      const objMinX = object.x - object.width / 2;
      const objMaxX = object.x + object.width / 2;
      const objMinY = object.y - object.height / 2;
      const objMaxY = object.y + object.height / 2;

      minX = Math.min(minX, objMinX);
      minY = Math.min(minY, objMinY);
      maxX = Math.max(maxX, objMaxX);
      maxY = Math.max(maxY, objMaxY);
    }

    if (minX === Number.POSITIVE_INFINITY || minY === Number.POSITIVE_INFINITY) {
      return { ...EMPTY_BOUNDS };
    }

    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);

    return { minX, minY, maxX, maxY, width, height };
  }, [cells.length, cellsBounds, layoutObjects]);

  const baseViewBox = useMemo(() => {
    const padding = 20;
    const axisExtraX = axisSettings.offset + 30;
    const axisExtraY = axisSettings.offset + 30;

    let extraLeft = 0;
    let extraRight = 0;
    let extraTop = 0;
    let extraBottom = 0;

    if (axisSettings.showY) {
      if (axisSettings.position.y === 'left') {
        extraLeft = Math.max(extraLeft, axisExtraX);
      } else {
        extraRight = Math.max(extraRight, axisExtraX);
      }
    }

    if (axisSettings.showX) {
      if (axisSettings.position.x === 'top') {
        extraTop = Math.max(extraTop, axisExtraY);
      } else {
        extraBottom = Math.max(extraBottom, axisExtraY);
      }
    }

    return {
      x: contentBounds.minX - padding - extraLeft,
      y: contentBounds.minY - padding - extraTop,
      width: contentBounds.width + padding * 2 + extraLeft + extraRight,
      height: contentBounds.height + padding * 2 + extraTop + extraBottom,
    };
  }, [contentBounds, axisSettings]);

  // Apply zoom and pan to viewBox
  const viewBox = useMemo(() => {
    if (!enablePanZoom) {
      return baseViewBox;
    }

    // Apply zoom by adjusting viewBox dimensions (inverse relationship)
    // Higher zoom = smaller viewBox = zoomed in
    const scaledWidth = baseViewBox.width / zoomPan.zoom;
    const scaledHeight = baseViewBox.height / zoomPan.zoom;

    // Apply pan by adjusting viewBox position
    // Convert screen-space pan to viewBox space
    const panX = -zoomPan.panX / zoomPan.zoom;
    const panY = -zoomPan.panY / zoomPan.zoom;

    return {
      x: baseViewBox.x + panX,
      y: baseViewBox.y + panY,
      width: scaledWidth,
      height: scaledHeight,
    };
  }, [baseViewBox, enablePanZoom, zoomPan.zoom, zoomPan.panX, zoomPan.panY]);

  const rowAxisData = useMemo(() => {
    if (!axisSettings.showY) return [];
    if (layout.type !== 'grid' && layout.type !== 'sections') return [];

    const rows = new Map<string, { key: string; label: string; y: number }>();

    for (const cell of cells) {
      if (cell.id.row === undefined) continue;
      const label = cell.meta?.rowLabel;
      if (!label) continue;
      const section = cell.id.sectionId ?? 'default';
      const key = `${section}:${cell.id.row}`;

      if (!rows.has(key)) {
        rows.set(key, { key, label, y: cell.y });
      } else {
        const entry = rows.get(key)!;
        entry.y = (entry.y + cell.y) / 2;
      }
    }

    return Array.from(rows.values()).sort((a, b) => a.y - b.y);
  }, [axisSettings.showY, cells, layout.type]);

  const colAxisData = useMemo(() => {
    if (!axisSettings.showX) return [];
    if (layout.type !== 'grid' && layout.type !== 'sections') return [];

    const cols = new Map<string, { key: string; label: string; x: number }>();

    for (const cell of cells) {
      if (cell.id.col === undefined) continue;
      const label = cell.meta?.colLabel;
      if (!label) continue;
      const section = cell.id.sectionId ?? 'default';
      const key = `${section}:${cell.id.col}`;

      if (!cols.has(key)) {
        cols.set(key, { key, label, x: cell.x });
      } else {
        const entry = cols.get(key)!;
        entry.x = (entry.x + cell.x) / 2;
      }
    }

    return Array.from(cols.values()).sort((a, b) => a.x - b.x);
  }, [axisSettings.showX, cells, layout.type]);

  const rowAxisX =
    axisSettings.position.y === 'left'
      ? contentBounds.minX - axisSettings.offset
      : contentBounds.maxX + axisSettings.offset;

  const colAxisY =
    axisSettings.position.x === 'top'
      ? contentBounds.minY - axisSettings.offset
      : contentBounds.maxY + axisSettings.offset;

  const showAxisLabels = axisSettings.showX || axisSettings.showY;
  const rowAxisTextAnchor = axisSettings.position.y === 'left' ? 'end' : 'start';
  const columnDominantBaseline = 'middle';
  const rowDominantBaseline = 'middle';
  const objectCornerRadius = Math.max(6, (theme?.cellRadius ?? 4) * 1.5);

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

  // Zoom and pan event handlers
  const handleFitToView = useCallback(() => {
    if (!enablePanZoom || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    zoomPan.fitToView(
      baseViewBox.width,
      baseViewBox.height,
      rect.width,
      rect.height,
      40
    );
  }, [enablePanZoom, zoomPan, baseViewBox]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enablePanZoom || e.button !== 0) return;
      e.preventDefault();
      zoomPan.startPan(e.clientX, e.clientY);
    },
    [enablePanZoom, zoomPan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enablePanZoom) return;
      zoomPan.updatePan(e.clientX, e.clientY);
    },
    [enablePanZoom, zoomPan]
  );

  const handleMouseUp = useCallback(() => {
    if (!enablePanZoom) return;
    zoomPan.endPan();
  }, [enablePanZoom, zoomPan]);

  const handleMouseLeave = useCallback(() => {
    if (!enablePanZoom) return;
    zoomPan.endPan();
  }, [enablePanZoom, zoomPan]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!enablePanZoom) return;
      e.preventDefault();

      // Convert React synthetic event to native event for the hook
      const nativeEvent = e.nativeEvent;
      zoomPan.handleWheel(nativeEvent);
    },
    [enablePanZoom, zoomPan]
  );

  // Keyboard zoom shortcuts
  const handleZoomKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enablePanZoom) return;

      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        // Cmd/Ctrl + = for zoom in
        e.preventDefault();
        zoomPan.zoomIn();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        // Cmd/Ctrl + - for zoom out
        e.preventDefault();
        zoomPan.zoomOut();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        // Cmd/Ctrl + 0 for reset
        e.preventDefault();
        handleFitToView();
      }
    },
    [enablePanZoom, zoomPan, handleFitToView]
  );

  // Apply theme variables
  useEffect(() => {
    if (!containerRef.current || !theme) return;

    const root = containerRef.current;
    if (theme.cellRadius !== undefined)
      root.style.setProperty('--ztx-cell-radius', `${theme.cellRadius}px`);

    // New state-based colors
    if (theme.seatColorEmpty) root.style.setProperty('--ztx-seat-color-empty', theme.seatColorEmpty);
    if (theme.seatColorHover) root.style.setProperty('--ztx-seat-color-hover', theme.seatColorHover);
    if (theme.seatColorSelected)
      root.style.setProperty('--ztx-seat-color-selected', theme.seatColorSelected);
    if (theme.seatColorUnavailable)
      root.style.setProperty('--ztx-seat-color-unavailable', theme.seatColorUnavailable);
    if (theme.seatColorBooked)
      root.style.setProperty('--ztx-seat-color-booked', theme.seatColorBooked);

    // New border colors
    if (theme.seatBorderEmpty)
      root.style.setProperty('--ztx-seat-border-empty', theme.seatBorderEmpty);
    if (theme.seatBorderHover)
      root.style.setProperty('--ztx-seat-border-hover', theme.seatBorderHover);
    if (theme.seatBorderSelected)
      root.style.setProperty('--ztx-seat-border-selected', theme.seatBorderSelected);
    if (theme.seatBorderUnavailable)
      root.style.setProperty('--ztx-seat-border-unavailable', theme.seatBorderUnavailable);
    if (theme.seatBorderBooked)
      root.style.setProperty('--ztx-seat-border-booked', theme.seatBorderBooked);

    // New text colors
    if (theme.seatTextEmpty) root.style.setProperty('--ztx-seat-text-empty', theme.seatTextEmpty);
    if (theme.seatTextHover) root.style.setProperty('--ztx-seat-text-hover', theme.seatTextHover);
    if (theme.seatTextSelected)
      root.style.setProperty('--ztx-seat-text-selected', theme.seatTextSelected);
    if (theme.seatTextUnavailable)
      root.style.setProperty('--ztx-seat-text-unavailable', theme.seatTextUnavailable);
    if (theme.seatTextBooked)
      root.style.setProperty('--ztx-seat-text-booked', theme.seatTextBooked);

    // Held state colors
    if (theme.seatColorHeld) root.style.setProperty('--ztx-seat-color-held', theme.seatColorHeld);
    if (theme.seatBorderHeld)
      root.style.setProperty('--ztx-seat-border-held', theme.seatBorderHeld);
    if (theme.seatTextHeld) root.style.setProperty('--ztx-seat-text-held', theme.seatTextHeld);

    // Sold state colors
    if (theme.seatColorSold) root.style.setProperty('--ztx-seat-color-sold', theme.seatColorSold);
    if (theme.seatBorderSold)
      root.style.setProperty('--ztx-seat-border-sold', theme.seatBorderSold);
    if (theme.seatTextSold) root.style.setProperty('--ztx-seat-text-sold', theme.seatTextSold);

    // Legacy support
    if (theme.seatColor) root.style.setProperty('--ztx-seat-color', theme.seatColor);
    if (theme.seatBorder) root.style.setProperty('--ztx-seat-border', theme.seatBorder);

    // Other properties
    if (theme.axisLabelColor)
      root.style.setProperty('--ztx-axis-label-color', theme.axisLabelColor);
    if (theme.objectFillColor) root.style.setProperty('--ztx-object-fill', theme.objectFillColor);
    if (theme.objectBorderColor)
      root.style.setProperty('--ztx-object-border', theme.objectBorderColor);
    if (theme.objectTextColor)
      root.style.setProperty('--ztx-object-text', theme.objectTextColor);
    if (theme.fontFamily) root.style.setProperty('--ztx-font-family', theme.fontFamily);
    if (theme.fontSize !== undefined)
      root.style.setProperty('--ztx-font-size', `${theme.fontSize}px`);
  }, [theme]);

  return (
    <div
      ref={wrapperRef}
      className={`zonetrix ${enablePanZoom ? 'zonetrix-zoomable' : ''} ${className}`.trim()}
      dir={dir}
      style={{ ...style, position: 'relative' }}
      onKeyDown={(e) => {
        handleKeyDown(e);
        handleZoomKeyDown(e);
      }}
    >
      {enablePanZoom && showZoomControls && (
        <ZonetrixZoomControls
          zoom={zoomPan.zoom}
          onZoomIn={zoomPan.zoomIn}
          onZoomOut={zoomPan.zoomOut}
          onReset={zoomPan.resetZoom}
          onFitToView={handleFitToView}
          minZoom={minZoom}
          maxZoom={maxZoom}
        />
      )}
      <svg
        ref={containerRef}
        className={`zonetrix-svg ${zoomPan.isPanning ? 'is-panning' : ''}`}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        role="grid"
        aria-label="Venue seating layout"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        style={{
          cursor: enablePanZoom ? (zoomPan.isPanning ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {layoutObjects.length > 0 && (
          <ZonetrixLayer className="zonetrix-layer-objects">
            {layoutObjects.map((object: LayoutObject) => {
              const rotation = object.rotation ?? 0;
              const label = object.label ?? object.type.toUpperCase();

              return (
                <g
                  key={object.id}
                  className={`zonetrix-object zonetrix-object-${object.type}`}
                  transform={`translate(${object.x}, ${object.y}) rotate(${rotation})`}
                  role="presentation"
                >
                  <rect
                    className="zonetrix-object-rect"
                    x={-object.width / 2}
                    y={-object.height / 2}
                    width={object.width}
                    height={object.height}
                    rx={objectCornerRadius}
                    ry={objectCornerRadius}
                  />
                  <text className="zonetrix-object-label" x={0} y={0}>
                    {label}
                  </text>
                </g>
              );
            })}
          </ZonetrixLayer>
        )}

        <ZonetrixLayer className="zonetrix-layer-cells">
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
                showLabel={showSeatLabels}
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

        {showAxisLabels && (
          <ZonetrixLayer className="zonetrix-layer-axis">
            {axisSettings.showY &&
              rowAxisData.map((row) => (
                <text
                  key={`row-${row.key}`}
                  className="zonetrix-axis-label zonetrix-axis-label-y"
                  x={rowAxisX}
                  y={row.y}
                  textAnchor={rowAxisTextAnchor}
                  dominantBaseline={rowDominantBaseline}
                >
                  {row.label}
                </text>
              ))}

            {axisSettings.showX &&
              colAxisData.map((col) => (
                <text
                  key={`col-${col.key}`}
                  className="zonetrix-axis-label zonetrix-axis-label-x"
                  x={col.x}
                  y={colAxisY}
                  textAnchor="middle"
                  dominantBaseline={columnDominantBaseline}
                >
                  {col.label}
                </text>
              ))}
          </ZonetrixLayer>
        )}
      </svg>
    </div>
  );
}
