/**
 * Arc layout algorithm
 */

import { polarToCartesian } from './math';
import type { ArcLayoutConfig, Cell } from './models';
import { generateAngularLabel } from './numbering';
import { calculateMinimumArcRadius } from './collision-detection';

/**
 * Generate cells for an arc layout with automatic overlap prevention
 */
export function createArcLayout(config: ArcLayoutConfig): Cell[] {
  const {
    radius,
    sweepDegrees,
    count,
    cellSize,
    origin = { x: 0, y: 0 },
    numbering,
    autoPreventOverlap = true,
    minSpacing = 2,
  } = config;

  // Calculate minimum radius to prevent overlaps
  let adjustedRadius = radius;
  if (autoPreventOverlap && count > 1) {
    const minRadius = calculateMinimumArcRadius(count, cellSize, sweepDegrees, minSpacing);
    adjustedRadius = Math.max(radius, minRadius);
  }

  const cells: Cell[] = [];

  // Starting angle (top of arc, -90 degrees = top, going clockwise)
  const startAngle = -90 - sweepDegrees / 2;

  // Angular spacing between cells
  const angleStep = count > 1 ? sweepDegrees / (count - 1) : 0;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;

    // Calculate position on arc using adjusted radius
    const pos = polarToCartesian(origin.x, origin.y, adjustedRadius, angle);

    // Calculate rotation to face the center
    const rotation = angle + 90; // Face inward

    // Generate label
    const label = generateAngularLabel(i, numbering);

    const cell: Cell = {
      id: {
        index: i,
      },
      kind: 'seat',
      x: pos.x,
      y: pos.y,
      w: cellSize,
      h: cellSize,
      rotation,
      meta: {
        label,
        status: 'available',
      },
    };

    cells.push(cell);
  }

  return cells;
}
