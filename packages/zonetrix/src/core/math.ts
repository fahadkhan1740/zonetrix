/**
 * Mathematical utilities for layout calculations
 */

import type { Cell } from './models';

/**
 * Convert polar coordinates to Cartesian
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleDegrees: number
): { x: number; y: number } {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleRadians),
    y: centerY + radius * Math.sin(angleRadians),
  };
}

/**
 * Convert Cartesian coordinates to polar
 */
export function cartesianToPolar(
  centerX: number,
  centerY: number,
  x: number,
  y: number
): { radius: number; angleDegrees: number } {
  const dx = x - centerX;
  const dy = y - centerY;
  const radius = Math.sqrt(dx * dx + dy * dy);
  const angleDegrees = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { radius, angleDegrees };
}

/**
 * Calculate the bounding box for an array of cells
 */
export function calculateBoundingBox(cells: Cell[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (cells.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const cell of cells) {
    const cellMinX = cell.x - cell.w / 2;
    const cellMinY = cell.y - cell.h / 2;
    const cellMaxX = cell.x + cell.w / 2;
    const cellMaxY = cell.y + cell.h / 2;

    minX = Math.min(minX, cellMinX);
    minY = Math.min(minY, cellMinY);
    maxX = Math.max(maxX, cellMaxX);
    maxY = Math.max(maxY, cellMaxY);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Find the nearest neighbor cell in a given direction (for keyboard navigation)
 */
export function findNeighborInDirection(
  cells: Cell[],
  currentCell: Cell,
  direction: 'up' | 'down' | 'left' | 'right',
  rtl = false
): Cell | null {
  // Adjust direction for RTL
  let adjustedDirection = direction;
  if (rtl && (direction === 'left' || direction === 'right')) {
    adjustedDirection = direction === 'left' ? 'right' : 'left';
  }

  let bestCandidate: Cell | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const cell of cells) {
    if (cell === currentCell) continue;

    const dx = cell.x - currentCell.x;
    const dy = cell.y - currentCell.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let isInDirection = false;

    switch (adjustedDirection) {
      case 'up':
        isInDirection = dy < -5 && Math.abs(dx) < Math.abs(dy);
        break;
      case 'down':
        isInDirection = dy > 5 && Math.abs(dx) < Math.abs(dy);
        break;
      case 'left':
        isInDirection = dx < -5 && Math.abs(dy) < Math.abs(dx);
        break;
      case 'right':
        isInDirection = dx > 5 && Math.abs(dy) < Math.abs(dx);
        break;
    }

    if (isInDirection && distance < bestDistance) {
      bestDistance = distance;
      bestCandidate = cell;
    }
  }

  return bestCandidate;
}

/**
 * Find the nearest neighbor by grid position (row, col)
 */
export function findGridNeighbor(
  cells: Cell[],
  currentCell: Cell,
  direction: 'up' | 'down' | 'left' | 'right',
  rtl = false
): Cell | null {
  const currentRow = currentCell.id.row;
  const currentCol = currentCell.id.col;

  if (currentRow === undefined || currentCol === undefined) {
    // Fallback to spatial neighbor finding
    return findNeighborInDirection(cells, currentCell, direction, rtl);
  }

  // Adjust direction for RTL
  let adjustedDirection = direction;
  if (rtl && (direction === 'left' || direction === 'right')) {
    adjustedDirection = direction === 'left' ? 'right' : 'left';
  }

  let targetRow = currentRow;
  let targetCol = currentCol;

  switch (adjustedDirection) {
    case 'up':
      targetRow = currentRow - 1;
      break;
    case 'down':
      targetRow = currentRow + 1;
      break;
    case 'left':
      targetCol = currentCol - 1;
      break;
    case 'right':
      targetCol = currentCol + 1;
      break;
  }

  return (
    cells.find(
      (cell) =>
        cell.id.row === targetRow &&
        cell.id.col === targetCol &&
        cell.id.sectionId === currentCell.id.sectionId
    ) || null
  );
}

/**
 * Find the nearest neighbor in angular layouts (arc, circle)
 */
export function findAngularNeighbor(
  cells: Cell[],
  currentCell: Cell,
  direction: 'left' | 'right' | 'up' | 'down',
  _centerX: number,
  _centerY: number,
  rtl = false
): Cell | null {
  const currentIndex = currentCell.id.index;

  if (currentIndex === undefined) {
    return findNeighborInDirection(cells, currentCell, direction, rtl);
  }

  // For angular layouts, left/right move along the arc
  // up/down are not typically used, but we can handle them spatially
  if (direction === 'up' || direction === 'down') {
    return findNeighborInDirection(cells, currentCell, direction, rtl);
  }

  // Adjust direction for RTL
  let adjustedDirection = direction;
  if (rtl) {
    adjustedDirection = direction === 'left' ? 'right' : 'left';
  }

  const delta = adjustedDirection === 'left' ? -1 : 1;
  const targetIndex = currentIndex + delta;

  return cells.find((cell) => cell.id.index === targetIndex) || null;
}

/**
 * Calculate angle between two points
 */
export function angleBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

/**
 * Normalize angle to [0, 360)
 */
export function normalizeAngle(degrees: number): number {
  let normalized = degrees % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Mirror X coordinate for RTL layouts
 */
export function mirrorXForRTL(x: number, containerWidth: number, rtl: boolean): number {
  return rtl ? containerWidth - x : x;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

/**
 * Transform a point using zoom and pan
 */
export function transformPoint(
  x: number,
  y: number,
  zoom: number,
  panX: number,
  panY: number
): { x: number; y: number } {
  return {
    x: x * zoom + panX,
    y: y * zoom + panY,
  };
}

/**
 * Inverse transform a point (screen to world coordinates)
 */
export function inverseTransformPoint(
  screenX: number,
  screenY: number,
  zoom: number,
  panX: number,
  panY: number
): { x: number; y: number } {
  return {
    x: (screenX - panX) / zoom,
    y: (screenY - panY) / zoom,
  };
}
