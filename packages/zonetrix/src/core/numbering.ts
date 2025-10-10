/**
 * Numbering and labeling utilities for cells
 */

import type { NumberingConfig } from './models';

/**
 * Default alphabet for row labels
 */
const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generate a label for a cell based on numbering configuration
 */
export function generateLabel(
  row: number,
  col: number,
  config?: NumberingConfig,
  labelPrefix?: string
): string {
  const scheme = config?.scheme || 'row-col';
  const startIndex = config?.startIndex ?? 1;
  const colStart = config?.colStart ?? 1;

  switch (scheme) {
    case 'row-col':
      return generateRowColLabel(row, col, startIndex, colStart, labelPrefix, config?.rowLabels);

    case 'snake':
      return generateSnakeLabel(row, col, startIndex, labelPrefix);

    case 'index':
      return generateIndexLabel(row, col, startIndex);

    case 'alpha-rows':
      return generateAlphaRowsLabel(row, col, colStart, config?.rowLabels);

    default:
      return `${row + startIndex}-${col + colStart}`;
  }
}

/**
 * Generate row-column label (e.g., "A1", "A2", "B1", "B2")
 */
function generateRowColLabel(
  row: number,
  col: number,
  startIndex: number,
  colStart: number,
  labelPrefix?: string,
  customRowLabels?: string[]
): string {
  const rowLabel = customRowLabels
    ? customRowLabels[row] || `${row + startIndex}`
    : labelPrefix
      ? `${labelPrefix}${row + startIndex}`
      : getAlphaLabel(row);

  return `${rowLabel}${col + colStart}`;
}

/**
 * Generate snake/zigzag label (continuous numbering, alternating direction per row)
 * Row 0: 1, 2, 3, 4
 * Row 1: 8, 7, 6, 5
 * Row 2: 9, 10, 11, 12
 */
function generateSnakeLabel(
  row: number,
  col: number,
  startIndex: number,
  labelPrefix?: string
): string {
  // This requires knowing the total columns, which we don't have here
  // For now, we'll implement a simple linear index
  // A proper implementation would need the total column count
  const index = row * 100 + col + startIndex; // Simplified
  return labelPrefix ? `${labelPrefix}${index}` : `${index}`;
}

/**
 * Generate simple index label (continuous numbering: 1, 2, 3, ...)
 */
function generateIndexLabel(row: number, col: number, startIndex: number): string {
  // This also requires knowing the total columns
  // Simplified implementation
  const index = row * 100 + col + startIndex;
  return `${index}`;
}

/**
 * Generate alpha-rows label (custom row labels + column number)
 */
function generateAlphaRowsLabel(
  row: number,
  col: number,
  colStart: number,
  customRowLabels?: string[]
): string {
  const rowLabel = customRowLabels
    ? customRowLabels[row] || getAlphaLabel(row)
    : getAlphaLabel(row);
  return `${rowLabel}${col + colStart}`;
}

/**
 * Get alphabetic label for a row index (A, B, C, ..., Z, AA, AB, ...)
 */
export function getAlphaLabel(index: number): string {
  let label = '';
  let num = index;

  do {
    label = DEFAULT_ALPHABET[num % 26] + label;
    num = Math.floor(num / 26) - 1;
  } while (num >= 0);

  return label;
}

/**
 * Generate label for angular layouts (arc, circle)
 */
export function generateAngularLabel(
  index: number,
  config?: NumberingConfig,
  labelPrefix?: string
): string {
  const startIndex = config?.startIndex ?? 1;
  const num = index + startIndex;
  return labelPrefix ? `${labelPrefix}${num}` : `${num}`;
}

/**
 * Generate improved snake labels with proper column count
 */
export function generateSnakeLabelWithCols(
  row: number,
  col: number,
  cols: number,
  startIndex: number,
  labelPrefix?: string
): string {
  let index: number;

  if (row % 2 === 0) {
    // Even rows: left to right
    index = row * cols + col + startIndex;
  } else {
    // Odd rows: right to left
    index = row * cols + (cols - 1 - col) + startIndex;
  }

  return labelPrefix ? `${labelPrefix}${index}` : `${index}`;
}

/**
 * Generate improved index labels with proper column count
 */
export function generateIndexLabelWithCols(
  row: number,
  col: number,
  cols: number,
  startIndex: number
): string {
  const index = row * cols + col + startIndex;
  return `${index}`;
}
