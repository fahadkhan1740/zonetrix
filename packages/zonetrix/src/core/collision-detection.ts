import type { Cell, SectionBlock } from './models';

/**
 * Represents a rectangular bounding box
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Configuration for overlap detection
 */
export interface OverlapDetectionConfig {
  /**
   * Minimum spacing between cells (in pixels)
   * @default 2
   */
  minSpacing?: number;

  /**
   * Whether to account for cell rotation when detecting overlaps
   * @default false
   */
  accountForRotation?: boolean;
}

/**
 * Result of overlap detection
 */
export interface OverlapResult {
  hasOverlaps: boolean;
  overlappingPairs: Array<{ cell1: Cell; cell2: Cell }>;
  overlapCount: number;
}

/**
 * Converts a Cell to a Rectangle for collision detection
 * Cells use center-based positioning, so we need to convert to top-left based rectangles
 */
export function cellToRectangle(cell: Cell, padding: number = 0): Rectangle {
  return {
    x: cell.x - cell.w / 2 - padding,
    y: cell.y - cell.h / 2 - padding,
    width: cell.w + padding * 2,
    height: cell.h + padding * 2,
  };
}

/**
 * Checks if two rectangles intersect
 */
export function rectanglesIntersect(rect1: Rectangle, rect2: Rectangle): boolean {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  );
}

/**
 * Checks if two cells overlap
 */
export function cellsOverlap(
  cell1: Cell,
  cell2: Cell,
  minSpacing: number = 2
): boolean {
  // Convert cells to rectangles with spacing buffer
  const rect1 = cellToRectangle(cell1, minSpacing / 2);
  const rect2 = cellToRectangle(cell2, minSpacing / 2);

  return rectanglesIntersect(rect1, rect2);
}

/**
 * Detects all overlapping cells in a layout
 */
export function detectOverlaps(
  cells: Cell[],
  config: OverlapDetectionConfig = {}
): OverlapResult {
  const { minSpacing = 2 } = config;
  const overlappingPairs: Array<{ cell1: Cell; cell2: Cell }> = [];

  // Check each pair of cells
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      if (cellsOverlap(cells[i], cells[j], minSpacing)) {
        overlappingPairs.push({
          cell1: cells[i],
          cell2: cells[j],
        });
      }
    }
  }

  return {
    hasOverlaps: overlappingPairs.length > 0,
    overlappingPairs,
    overlapCount: overlappingPairs.length,
  };
}

/**
 * Calculates the minimum gap needed to prevent overlaps in a grid layout
 */
export function calculateMinimumGridGap(
  _cellWidth: number,
  _cellHeight: number,
  minSpacing: number = 2
): number {
  // Minimum gap is just the minimum spacing between cells
  return Math.max(0, minSpacing);
}

/**
 * Calculates the minimum radius needed to prevent overlaps in an arc layout
 */
export function calculateMinimumArcRadius(
  seatCount: number,
  cellWidth: number,
  sweepDegrees: number,
  minSpacing: number = 2
): number {
  if (seatCount <= 1) return cellWidth;

  // Convert sweep to radians
  const sweepRadians = (sweepDegrees * Math.PI) / 180;

  // Calculate angular spacing between seats
  const angularSpacing = sweepRadians / (seatCount - 1);

  // Using the chord length formula to find minimum radius
  // chord = 2 * r * sin(angle/2)
  // We want chord length >= cellWidth + minSpacing
  const minChordLength = cellWidth + minSpacing;
  const minRadius = minChordLength / (2 * Math.sin(angularSpacing / 2));

  // Add extra buffer for cell height
  return Math.max(minRadius, cellWidth) + cellWidth / 2;
}

/**
 * Adjusts grid layout parameters to prevent overlaps
 */
export function adjustGridLayoutForOverlaps(
  _rows: number,
  _cols: number,
  cellWidth: number,
  cellHeight: number,
  currentGap: number,
  minSpacing: number = 2
): { gap: number; cellSize?: number; scaleFactor: number } {
  const minGap = calculateMinimumGridGap(cellWidth, cellHeight, minSpacing);

  if (currentGap >= minGap) {
    return { gap: currentGap, scaleFactor: 1 };
  }

  // Increase gap to minimum
  return { gap: minGap, scaleFactor: 1 };
}

/**
 * Adjusts arc layout parameters to prevent overlaps
 */
export function adjustArcLayoutForOverlaps(
  seatCount: number,
  cellWidth: number,
  _cellHeight: number,
  currentRadius: number,
  sweepDegrees: number,
  minSpacing: number = 2
): { radius: number; scaleFactor: number } {
  const minRadius = calculateMinimumArcRadius(
    seatCount,
    cellWidth,
    sweepDegrees,
    minSpacing
  );

  if (currentRadius >= minRadius) {
    return { radius: currentRadius, scaleFactor: 1 };
  }

  // Increase radius to minimum
  const scaleFactor = minRadius / currentRadius;
  return { radius: minRadius, scaleFactor };
}

/**
 * Checks if a cell is within bounds of a container
 */
export function isCellInBounds(
  cell: Cell,
  bounds: { minX: number; minY: number; maxX: number; maxY: number }
): boolean {
  const rect = cellToRectangle(cell);

  return (
    rect.x >= bounds.minX &&
    rect.y >= bounds.minY &&
    rect.x + rect.width <= bounds.maxX &&
    rect.y + rect.height <= bounds.maxY
  );
}

/**
 * Calculates optimal scaling to fit all cells within a given viewport
 */
export function calculateOptimalScale(
  cells: Cell[],
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 20
): number {
  if (cells.length === 0) return 1;

  // Find bounding box of all cells
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  cells.forEach(cell => {
    const rect = cellToRectangle(cell);
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  });

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;

  // Calculate scale factors for width and height
  const scaleX = (viewportWidth - padding * 2) / contentWidth;
  const scaleY = (viewportHeight - padding * 2) / contentHeight;

  // Return the smaller scale to ensure everything fits
  return Math.min(scaleX, scaleY, 1); // Never scale up beyond 1
}

// ============================================================================
// SECTION OVERLAP DETECTION AND AUTO-ADJUSTMENT
// ============================================================================

/**
 * Calculate the bounding box for an entire section
 */
export function calculateSectionBounds(
  block: SectionBlock,
  minSectionSpacing: number = 20
): Rectangle {
  const gap = block.gap || 0;

  // Calculate total dimensions of the section
  const totalWidth = block.cols * (block.cellSize + gap);
  const totalHeight = block.rows * (block.cellSize + gap);

  // Add spacing buffer around the section
  const spacing = minSectionSpacing;

  return {
    x: block.origin.x - spacing / 2,
    y: block.origin.y - spacing / 2,
    width: totalWidth + spacing,
    height: totalHeight + spacing,
  };
}

/**
 * Check if two sections overlap
 */
export function sectionsOverlap(
  block1: SectionBlock,
  block2: SectionBlock,
  minSectionSpacing: number = 20
): boolean {
  const bounds1 = calculateSectionBounds(block1, minSectionSpacing);
  const bounds2 = calculateSectionBounds(block2, minSectionSpacing);
  return rectanglesIntersect(bounds1, bounds2);
}

/**
 * Result of section overlap detection
 */
export interface SectionOverlapResult {
  hasOverlaps: boolean;
  overlappingPairs: Array<{
    section1: SectionBlock;
    section2: SectionBlock;
    section1Bounds: Rectangle;
    section2Bounds: Rectangle;
  }>;
  overlapCount: number;
}

/**
 * Detect all overlapping sections in a layout
 */
export function detectSectionOverlaps(
  blocks: SectionBlock[],
  minSectionSpacing: number = 20
): SectionOverlapResult {
  const overlappingPairs: SectionOverlapResult['overlappingPairs'] = [];

  // Check each pair of sections
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (sectionsOverlap(blocks[i], blocks[j], minSectionSpacing)) {
        overlappingPairs.push({
          section1: blocks[i],
          section2: blocks[j],
          section1Bounds: calculateSectionBounds(blocks[i], minSectionSpacing),
          section2Bounds: calculateSectionBounds(blocks[j], minSectionSpacing),
        });
      }
    }
  }

  return {
    hasOverlaps: overlappingPairs.length > 0,
    overlappingPairs,
    overlapCount: overlappingPairs.length,
  };
}

/**
 * Find the next available position for a section that doesn't overlap with existing sections
 */
function findNextAvailablePosition(
  block: SectionBlock,
  existingBounds: Rectangle[],
  minSpacing: number
): { x: number; y: number } {
  const bounds = calculateSectionBounds(block, 0); // Get section dimensions without spacing
  const searchStep = 50; // Grid step size for searching
  const maxSearchDistance = 5000;

  // Search patterns: start from original position and spiral outward
  const searchOffsets: Array<[number, number]> = [[0, 0]]; // Try original position first

  // Generate search grid in expanding squares
  for (let distance = searchStep; distance <= maxSearchDistance; distance += searchStep) {
    // Top edge
    for (let x = -distance; x <= distance; x += searchStep) {
      searchOffsets.push([x, -distance]);
    }
    // Right edge
    for (let y = -distance + searchStep; y <= distance; y += searchStep) {
      searchOffsets.push([distance, y]);
    }
    // Bottom edge
    for (let x = distance - searchStep; x >= -distance; x -= searchStep) {
      searchOffsets.push([x, distance]);
    }
    // Left edge
    for (let y = distance - searchStep; y > -distance; y -= searchStep) {
      searchOffsets.push([-distance, y]);
    }
  }

  // Try each position
  for (const [dx, dy] of searchOffsets) {
    const testPosition = {
      x: block.origin.x + dx,
      y: block.origin.y + dy,
    };

    const testBounds: Rectangle = {
      x: testPosition.x - minSpacing / 2,
      y: testPosition.y - minSpacing / 2,
      width: bounds.width + minSpacing,
      height: bounds.height + minSpacing,
    };

    // Check if this position overlaps with any existing sections
    const hasOverlap = existingBounds.some(existing =>
      rectanglesIntersect(testBounds, existing)
    );

    if (!hasOverlap) {
      return testPosition;
    }
  }

  // Fallback: place far to the right
  return { x: maxSearchDistance, y: block.origin.y };
}

/**
 * Compact layout strategy: Pack sections tightly without overlaps
 */
function compactLayoutStrategy(
  blocks: SectionBlock[],
  minSpacing: number
): SectionBlock[] {
  if (blocks.length === 0) return [];

  const adjusted: SectionBlock[] = [];
  const placed: Rectangle[] = [];

  // Sort by area (largest first) for better packing
  const sorted = [...blocks].sort((a, b) => {
    const areaA = (a.rows * (a.cellSize + (a.gap || 0))) * (a.cols * (a.cellSize + (a.gap || 0)));
    const areaB = (b.rows * (b.cellSize + (b.gap || 0))) * (b.cols * (b.cellSize + (b.gap || 0)));
    return areaB - areaA;
  });

  for (const block of sorted) {
    const position = findNextAvailablePosition(block, placed, minSpacing);

    adjusted.push({
      ...block,
      origin: position,
    });

    placed.push(calculateSectionBounds({ ...block, origin: position }, minSpacing));
  }

  return adjusted;
}

/**
 * Distribute layout strategy: Evenly distribute sections horizontally or vertically
 */
function distributeLayoutStrategy(
  blocks: SectionBlock[],
  minSpacing: number,
  direction: 'horizontal' | 'vertical' = 'horizontal'
): SectionBlock[] {
  if (blocks.length === 0) return [];

  const adjusted: SectionBlock[] = [];

  if (direction === 'horizontal') {
    let currentX = 0;
    const startY = Math.min(...blocks.map(b => b.origin.y));

    for (const block of blocks) {
      const bounds = calculateSectionBounds(block, 0);

      adjusted.push({
        ...block,
        origin: { x: currentX + minSpacing / 2, y: startY },
      });

      currentX += bounds.width + minSpacing;
    }
  } else {
    // Vertical distribution
    let currentY = 0;
    const startX = Math.min(...blocks.map(b => b.origin.x));

    for (const block of blocks) {
      const bounds = calculateSectionBounds(block, 0);

      adjusted.push({
        ...block,
        origin: { x: startX, y: currentY + minSpacing / 2 },
      });

      currentY += bounds.height + minSpacing;
    }
  }

  return adjusted;
}

/**
 * Preserve relative positions strategy: Maintain relative positioning while resolving overlaps
 */
function preserveRelativeStrategy(
  blocks: SectionBlock[],
  minSpacing: number
): SectionBlock[] {
  if (blocks.length === 0) return [];

  // Create mutable copies
  let adjusted = blocks.map(block => ({ ...block, origin: { ...block.origin } }));
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const overlaps = detectSectionOverlaps(adjusted, minSpacing);

    if (!overlaps.hasOverlaps) {
      break; // Success!
    }

    // For each overlapping pair, nudge them apart
    for (const overlap of overlaps.overlappingPairs) {
      const { section1, section2, section1Bounds, section2Bounds } = overlap;

      // Find the actual section objects in adjusted array
      const idx1 = adjusted.findIndex(b => b.id === section1.id);
      const idx2 = adjusted.findIndex(b => b.id === section2.id);

      if (idx1 === -1 || idx2 === -1) continue;

      // Calculate overlap amounts
      const overlapX = Math.min(
        section1Bounds.x + section1Bounds.width - section2Bounds.x,
        section2Bounds.x + section2Bounds.width - section1Bounds.x
      );
      const overlapY = Math.min(
        section1Bounds.y + section1Bounds.height - section2Bounds.y,
        section2Bounds.y + section2Bounds.height - section1Bounds.y
      );

      // Shift sections apart in the direction of least overlap
      if (overlapX < overlapY) {
        // Shift horizontally
        const shift = (overlapX / 2) + minSpacing;
        if (adjusted[idx1].origin.x < adjusted[idx2].origin.x) {
          adjusted[idx1].origin.x -= shift;
          adjusted[idx2].origin.x += shift;
        } else {
          adjusted[idx1].origin.x += shift;
          adjusted[idx2].origin.x -= shift;
        }
      } else {
        // Shift vertically
        const shift = (overlapY / 2) + minSpacing;
        if (adjusted[idx1].origin.y < adjusted[idx2].origin.y) {
          adjusted[idx1].origin.y -= shift;
          adjusted[idx2].origin.y += shift;
        } else {
          adjusted[idx1].origin.y += shift;
          adjusted[idx2].origin.y -= shift;
        }
      }
    }

    iterations++;
  }

  return adjusted;
}

/**
 * Configuration for auto-adjusting section positions
 */
export interface SectionAdjustmentConfig {
  strategy?: 'compact' | 'distribute' | 'preserve-relative';
  preferredDirection?: 'horizontal' | 'vertical';
  maxIterations?: number;
}

/**
 * Automatically adjust section positions to prevent overlaps
 */
export function autoAdjustSectionPositions(
  blocks: SectionBlock[],
  minSectionSpacing: number = 20,
  config: SectionAdjustmentConfig = {}
): SectionBlock[] {
  const {
    strategy = 'compact',
    preferredDirection = 'horizontal',
  } = config;

  if (blocks.length === 0) return [];

  // Check if adjustment is needed
  const initialOverlaps = detectSectionOverlaps(blocks, minSectionSpacing);
  if (!initialOverlaps.hasOverlaps) {
    return blocks; // No adjustment needed
  }

  // Apply selected strategy
  let adjusted: SectionBlock[];

  switch (strategy) {
    case 'compact':
      adjusted = compactLayoutStrategy(blocks, minSectionSpacing);
      break;
    case 'distribute':
      adjusted = distributeLayoutStrategy(blocks, minSectionSpacing, preferredDirection);
      break;
    case 'preserve-relative':
      adjusted = preserveRelativeStrategy(blocks, minSectionSpacing);
      break;
    default:
      adjusted = compactLayoutStrategy(blocks, minSectionSpacing);
  }

  return adjusted;
}
