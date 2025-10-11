/**
 * Zonetrix - Highly-flexible React library for rendering venue layouts
 * @packageDocumentation
 */

// Import styles
import './styles/base.css';

// Export components
export { ZonetrixCanvas } from './components/ZonetrixCanvas';
export type { ZonetrixProps } from './components/ZonetrixCanvas';
export { ZonetrixCell } from './components/ZonetrixCell';
export type { ZonetrixCellProps } from './components/ZonetrixCell';
export { ZonetrixLegend } from './components/ZonetrixLegend';
export type { ZonetrixLegendProps } from './components/ZonetrixLegend';
export { ZonetrixLayer } from './components/ZonetrixLayer';
export type { ZonetrixLayerProps } from './components/ZonetrixLayer';

// Export types
export type {
  Cell,
  CellId,
  CellKind,
  CellMeta,
  LayoutType,
  LayoutConfig,
  GridLayoutConfig,
  ArcLayoutConfig,
  CircleLayoutConfig,
  SectionsLayoutConfig,
  SectionBlock,
  NumberingConfig,
  LayoutObject,
  LayoutObjectType,
  LayoutObjectsConfig,
  AxisLabelsConfig,
  RenderTheme,
} from './core/models';

// Export layout functions (advanced usage)
export { createGridLayout } from './core/layout-grid';
export { createArcLayout } from './core/layout-arc';
export { createCircleLayout } from './core/layout-circle';
export { createSectionsLayout } from './core/layout-sections';

// Export utilities (advanced usage)
export {
  polarToCartesian,
  cartesianToPolar,
  calculateBoundingBox,
  findNeighborInDirection,
  findGridNeighbor,
  findAngularNeighbor,
  angleBetweenPoints,
  normalizeAngle,
  distance,
  mirrorXForRTL,
} from './core/math';

export { generateLabel, getAlphaLabel, generateAngularLabel } from './core/numbering';
