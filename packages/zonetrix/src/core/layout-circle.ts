/**
 * Circle/Ring layout algorithm
 */

import { createArcLayout } from './layout-arc';
import type { Cell, CircleLayoutConfig } from './models';

/**
 * Generate cells for a circular layout (full 360 degrees)
 */
export function createCircleLayout(config: CircleLayoutConfig): Cell[] {
  // A circle is just a 360-degree arc
  return createArcLayout({
    type: 'arc',
    radius: config.radius,
    sweepDegrees: 360,
    count: config.count,
    cellSize: config.cellSize,
    origin: config.origin,
    numbering: config.numbering,
    autoPreventOverlap: config.autoPreventOverlap,
    minSpacing: config.minSpacing,
  });
}
