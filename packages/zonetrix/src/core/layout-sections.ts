/**
 * Multi-section layout algorithm
 */

import { createGridLayout } from './layout-grid';
import type { Cell, SectionsLayoutConfig } from './models';
import {
  detectSectionOverlaps,
  autoAdjustSectionPositions,
} from './collision-detection';

/**
 * Generate cells for a multi-section layout with automatic section overlap prevention
 */
export function createSectionsLayout(config: SectionsLayoutConfig): Cell[] {
  const {
    blocks: originalBlocks,
    autoPreventSectionOverlaps = true,
    minSectionSpacing = 20,
    sectionLayoutStrategy = 'compact',
    sectionLayoutDirection = 'horizontal',
  } = config;

  let blocks = originalBlocks;

  // Auto-adjust section positions if enabled
  if (autoPreventSectionOverlaps && blocks.length > 1) {
    const overlaps = detectSectionOverlaps(blocks, minSectionSpacing);

    if (overlaps.hasOverlaps) {
      console.info(
        `[Zonetrix] Detected ${overlaps.overlappingPairs.length} section overlap(s). Auto-adjusting positions using '${sectionLayoutStrategy}' strategy...`
      );

      // Log which sections overlap
      overlaps.overlappingPairs.forEach(pair => {
        const name1 = pair.section1.name || pair.section1.id;
        const name2 = pair.section2.name || pair.section2.id;
        console.info(`  - "${name1}" overlaps with "${name2}"`);
      });

      blocks = autoAdjustSectionPositions(blocks, minSectionSpacing, {
        strategy: sectionLayoutStrategy,
        preferredDirection: sectionLayoutDirection,
      });

      // Verify adjustment was successful
      const finalCheck = detectSectionOverlaps(blocks, minSectionSpacing);
      if (finalCheck.hasOverlaps) {
        console.warn(
          '[Zonetrix] Warning: Could not completely resolve all section overlaps'
        );
      } else {
        console.info(
          `[Zonetrix] ✓ Section positions auto-adjusted successfully. All sections now have minimum ${minSectionSpacing}px spacing.`
        );
      }
    }
  }

  // Generate cells for each section using adjusted positions
  const allCells: Cell[] = [];

  for (const block of blocks) {
    // Create grid for this block with auto-overlap prevention for seats within the section
    const blockCells = createGridLayout({
      type: 'grid',
      rows: block.rows,
      cols: block.cols,
      cellSize: block.cellSize,
      gap: block.gap,
      origin: block.origin, // Use adjusted origin
      numbering: block.numbering,
      labelPrefix: block.labelPrefix,
      autoPreventOverlap: block.autoPreventOverlap,
      minSpacing: block.minSpacing,
    });

    // Add section ID to each cell
    for (const cell of blockCells) {
      cell.id.sectionId = block.id;
      allCells.push(cell);
    }
  }

  return allCells;
}
