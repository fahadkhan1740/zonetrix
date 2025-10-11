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

/**
 * Generate cells for a grid layout
 */
export function createGridLayout(config: GridLayoutConfig): Cell[] {
  const { rows, cols, cellSize, gap = 0, origin = { x: 0, y: 0 }, numbering, labelPrefix } = config;

  const cells: Cell[] = [];
  const startIndex = numbering?.startIndex ?? 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate position
      const x = origin.x + col * (cellSize + gap) + cellSize / 2;
      const y = origin.y + row * (cellSize + gap) + cellSize / 2;

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
