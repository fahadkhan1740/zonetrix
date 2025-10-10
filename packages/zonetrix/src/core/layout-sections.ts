/**
 * Multi-section layout algorithm
 */

import { createGridLayout } from './layout-grid';
import type { Cell, SectionsLayoutConfig } from './models';

/**
 * Generate cells for a multi-section layout
 */
export function createSectionsLayout(config: SectionsLayoutConfig): Cell[] {
  const { blocks } = config;
  const allCells: Cell[] = [];

  for (const block of blocks) {
    // Create grid for this block
    const blockCells = createGridLayout({
      type: 'grid',
      rows: block.rows,
      cols: block.cols,
      cellSize: block.cellSize,
      gap: block.gap,
      origin: block.origin,
      numbering: block.numbering,
      labelPrefix: block.labelPrefix,
    });

    // Add section ID to each cell
    for (const cell of blockCells) {
      cell.id.sectionId = block.id;
      allCells.push(cell);
    }
  }

  return allCells;
}
