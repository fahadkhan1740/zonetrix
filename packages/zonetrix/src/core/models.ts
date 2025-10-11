/**
 * Core data models and types for Zonetrix
 */

/**
 * Type of cell - seat or booth
 */
export type CellKind = 'seat' | 'booth';

/**
 * Unique identifier for a cell
 */
export interface CellId {
  /** Section identifier (optional, for multi-section layouts) */
  sectionId?: string;
  /** Row index (optional, for grid-based layouts) */
  row?: number;
  /** Column index (optional, for grid-based layouts) */
  col?: number;
  /** Linear index (optional, for non-grid shapes) */
  index?: number;
}

/**
 * Metadata associated with a cell
 */
export interface CellMeta {
  /** Display label (e.g., "A12", "B-07", "Booth 23") */
  label?: string;
  /** Label representing the row (used for axis rendering) */
  rowLabel?: string;
  /** Label representing the column (used for axis rendering) */
  colLabel?: string;
  /** Price for this cell */
  price?: number;
  /** Availability status */
  status?: 'available' | 'unavailable' | 'held' | 'sold' | 'booked';
  /** Arbitrary custom metadata */
  data?: Record<string, unknown>;
}

/**
 * A single renderable cell (seat or booth)
 */
export interface Cell {
  /** Unique identifier */
  id: CellId;
  /** Type of cell */
  kind: CellKind;
  /** X coordinate in canvas space (px) */
  x: number;
  /** Y coordinate in canvas space (px) */
  y: number;
  /** Width (px) */
  w: number;
  /** Height (px) */
  h: number;
  /** Rotation angle in degrees (optional) */
  rotation?: number;
  /** Associated metadata */
  meta?: CellMeta;
}

/**
 * Supported layout object types
 */
export type LayoutObjectType = 'stage' | 'screen' | 'custom';

/**
 * Additional object that can be rendered alongside seats (e.g., stage, screen)
 */
export interface LayoutObject {
  /** Unique identifier for the object */
  id: string;
  /** Type of the object */
  type: LayoutObjectType;
  /** X coordinate in canvas space (px, center-based) */
  x: number;
  /** Y coordinate in canvas space (px, center-based) */
  y: number;
  /** Width (px) */
  width: number;
  /** Height (px) */
  height: number;
  /** Rotation angle in degrees (optional) */
  rotation?: number;
  /** Display label */
  label?: string;
  /** Arbitrary custom metadata */
  data?: Record<string, unknown>;
}

/**
 * Shared layout configuration options
 */
export interface LayoutObjectsConfig {
  /** Objects to render alongside the main layout (e.g., stage) */
  objects?: LayoutObject[];
}

/**
 * Supported layout types
 */
export type LayoutType = 'grid' | 'arc' | 'circle' | 'sections';

/**
 * Base numbering configuration
 */
export interface NumberingConfig {
  /** Numbering scheme */
  scheme: 'row-col' | 'snake' | 'index' | 'alpha-rows';
  /** Starting index (default: 1) */
  startIndex?: number;
  /** Custom row labels (for alpha-rows) */
  rowLabels?: string[];
  /** Column starting number (default: 1) */
  colStart?: number;
}

/**
 * Grid layout configuration
 */
export interface GridLayoutConfig extends LayoutObjectsConfig {
  type: 'grid';
  /** Number of rows */
  rows: number;
  /** Number of columns */
  cols: number;
  /** Cell size in pixels */
  cellSize: number;
  /** Gap between cells in pixels (default: 0) */
  gap?: number;
  /** Origin point (default: {x: 0, y: 0}) */
  origin?: { x: number; y: number };
  /** Numbering configuration */
  numbering?: NumberingConfig;
  /** Label prefix for rows (e.g., "A" for rows) */
  labelPrefix?: string;
}

/**
 * Arc layout configuration (seats along a circular arc)
 */
export interface ArcLayoutConfig extends LayoutObjectsConfig {
  type: 'arc';
  /** Radius of the arc in pixels */
  radius: number;
  /** Arc sweep angle in degrees */
  sweepDegrees: number;
  /** Number of seats */
  count: number;
  /** Cell size in pixels */
  cellSize: number;
  /** Origin point (center of arc, default: {x: 0, y: 0}) */
  origin?: { x: number; y: number };
  /** Numbering configuration */
  numbering?: NumberingConfig;
}

/**
 * Circle/Ring layout configuration (seats around a full circle)
 */
export interface CircleLayoutConfig extends LayoutObjectsConfig {
  type: 'circle';
  /** Radius of the circle in pixels */
  radius: number;
  /** Number of seats */
  count: number;
  /** Cell size in pixels */
  cellSize: number;
  /** Origin point (center of circle, default: {x: 0, y: 0}) */
  origin?: { x: number; y: number };
  /** Numbering configuration */
  numbering?: NumberingConfig;
}

/**
 * Single section block for multi-section layouts
 */
export interface SectionBlock {
  /** Section identifier */
  id: string;
  /** Section display name (e.g., "VIP Section", "Balcony") */
  name?: string;
  /** Origin point for this section */
  origin: { x: number; y: number };
  /** Number of rows in this section */
  rows: number;
  /** Number of columns in this section */
  cols: number;
  /** Cell size in pixels */
  cellSize: number;
  /** Gap between cells in pixels (default: 0) */
  gap?: number;
  /** Numbering configuration for this section */
  numbering?: NumberingConfig;
  /** Label prefix for this section */
  labelPrefix?: string;
}

/**
 * Multi-section layout configuration
 */
export interface SectionsLayoutConfig {
  type: 'sections';
  /** Array of section blocks */
  blocks: SectionBlock[];
  /** Objects to render alongside the sections */
  objects?: LayoutObject[];
}

/**
 * Union of all layout configuration types
 */
export type LayoutConfig =
  | GridLayoutConfig
  | ArcLayoutConfig
  | CircleLayoutConfig
  | SectionsLayoutConfig;

/**
 * Axis label configuration for rendering
 */
export interface AxisLabelsConfig {
  /** Enable axis labels */
  enabled?: boolean;
  /** Show column labels along the X axis */
  showX?: boolean;
  /** Show row labels along the Y axis */
  showY?: boolean;
  /** Axis label positions */
  position?: {
    x?: 'top' | 'bottom';
    y?: 'left' | 'right';
  };
  /** Distance between axis labels and layout (px) */
  offset?: number;
}

/**
 * Theme configuration for rendering
 */
export interface RenderTheme {
  /** Border radius for cells (px, default: 4) */
  cellRadius?: number;

  /* Seat colors for different states */
  /** Empty/available seat color */
  seatColorEmpty?: string;
  /** Seat color on hover */
  seatColorHover?: string;
  /** Selected seat color */
  seatColorSelected?: string;
  /** Unavailable seat color */
  seatColorUnavailable?: string;
  /** Booked seat color */
  seatColorBooked?: string;

  /* Seat border colors for different states */
  /** Empty/available seat border */
  seatBorderEmpty?: string;
  /** Seat border on hover */
  seatBorderHover?: string;
  /** Selected seat border */
  seatBorderSelected?: string;
  /** Unavailable seat border */
  seatBorderUnavailable?: string;
  /** Booked seat border */
  seatBorderBooked?: string;

  /* Seat text colors for different states */
  /** Empty/available seat text */
  seatTextEmpty?: string;
  /** Seat text on hover */
  seatTextHover?: string;
  /** Selected seat text */
  seatTextSelected?: string;
  /** Unavailable seat text */
  seatTextUnavailable?: string;
  /** Booked seat text */
  seatTextBooked?: string;

  /* Legacy color support (deprecated, use specific state colors instead) */
  /** @deprecated Use seatColorEmpty instead */
  seatColor?: string;
  /** @deprecated Use seatBorderEmpty instead */
  seatBorder?: string;

  /** Font family */
  fontFamily?: string;
  /** Font size (px) */
  fontSize?: number;
  /** Axis label text color */
  axisLabelColor?: string;
  /** Stage/object fill color */
  objectFillColor?: string;
  /** Stage/object border color */
  objectBorderColor?: string;
  /** Stage/object text color */
  objectTextColor?: string;
}
