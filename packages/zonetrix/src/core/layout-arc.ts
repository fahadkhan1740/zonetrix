/**
 * Arc layout algorithm
 */

import { polarToCartesian } from './math';
import type { ArcLayoutConfig, Cell } from './models';
import { generateAngularLabel } from './numbering';

/**
 * Generate cells for an arc layout
 */
export function createArcLayout(config: ArcLayoutConfig): Cell[] {
  const { radius, sweepDegrees, count, cellSize, origin = { x: 0, y: 0 }, numbering } = config;

  const cells: Cell[] = [];

  // Starting angle (top of arc, -90 degrees = top, going clockwise)
  const startAngle = -90 - sweepDegrees / 2;

  // Angular spacing between cells
  const angleStep = count > 1 ? sweepDegrees / (count - 1) : 0;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;

    // Calculate position on arc
    const pos = polarToCartesian(origin.x, origin.y, radius, angle);

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
