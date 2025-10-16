/**
 * Grid layout algorithm
 */

import type { Cell, GridLayoutConfig } from './models';
import {
  computeAxisLabels,
  generateIndexLabelWithCols,
  generateLabel,
  generateSnakeLabelWithCols,
} from './numbering';
import { calculateMinimumGridGap } from './collision-detection';

/**
 * Generate cells for a grid layout with automatic overlap prevention
 */
export function createGridLayout(config: GridLayoutConfig): Cell[] {
  const {
    rows,
    cols,
    cellSize,
    gap = 0,
    origin = { x: 0, y: 0 },
    numbering,
    labelPrefix,
    autoPreventOverlap = true,
    minSpacing = 2,
  } = config;

  // Calculate minimum gap to prevent overlaps
  let adjustedGap = gap;
  if (autoPreventOverlap) {
    const minGap = calculateMinimumGridGap(cellSize, cellSize, minSpacing);
    adjustedGap = Math.max(gap, minGap);
  }

  const cells: Cell[] = [];
  const startIndex = numbering?.startIndex ?? 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate position using adjusted gap
      const x = origin.x + col * (cellSize + adjustedGap) + cellSize / 2;
      const y = origin.y + row * (cellSize + adjustedGap) + cellSize / 2;

      // Generate label based on scheme
      let label: string;
      const scheme = numbering?.scheme || 'row-col';

      if (scheme === 'snake') {
        label = generateSnakeLabelWithCols(row, col, cols, startIndex, labelPrefix);
      } else if (scheme === 'index') {
        label = generateIndexLabelWithCols(row, col, cols, startIndex);
      } else {
        label = generateLabel(row, col, numbering, labelPrefix);
      }

      const { rowLabel, colLabel } = computeAxisLabels(row, col, numbering, labelPrefix);

      const cell: Cell = {
        id: {
          row,
          col,
        },
        kind: 'seat',
        x,
        y,
        w: cellSize,
        h: cellSize,
        meta: {
          label,
          rowLabel,
          colLabel,
          status: 'available',
        },
      };

      cells.push(cell);
    }
  }

  return cells;
}
