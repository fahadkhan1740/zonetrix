import type { Cell } from './models';

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
