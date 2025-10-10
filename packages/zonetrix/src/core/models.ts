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
  /** Price for this cell */
  price?: number;
  /** Availability status */
  status?: 'available' | 'unavailable' | 'held' | 'sold';
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
export interface GridLayoutConfig {
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
export interface ArcLayoutConfig {
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
export interface CircleLayoutConfig {
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
 * Theme configuration for rendering
 */
export interface RenderTheme {
  /** Border radius for cells (px, default: 4) */
  cellRadius?: number;
  /** Default seat color */
  seatColor?: string;
  /** Selected seat color */
  seatColorSelected?: string;
  /** Unavailable seat color */
  seatColorUnavailable?: string;
  /** Seat border color */
  seatBorder?: string;
  /** Font family */
  fontFamily?: string;
  /** Font size (px) */
  fontSize?: number;
}
