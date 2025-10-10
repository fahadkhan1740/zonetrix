/**
 * Tests for grid layout algorithm
 */

import { describe, expect, it } from 'vitest';
import { createGridLayout } from './layout-grid';
import type { GridLayoutConfig } from './models';

describe('createGridLayout', () => {
  it('should create correct number of cells', () => {
    const config: GridLayoutConfig = {
      type: 'grid',
      rows: 5,
      cols: 10,
      cellSize: 20,
      gap: 5,
    };

    const cells = createGridLayout(config);
    expect(cells).toHaveLength(50); // 5 * 10
  });

  it('should position cells correctly with gap', () => {
    const config: GridLayoutConfig = {
      type: 'grid',
      rows: 2,
      cols: 2,
      cellSize: 20,
      gap: 10,
      origin: { x: 0, y: 0 },
    };

    const cells = createGridLayout(config);

    // First cell (0, 0) should be at (10, 10) - centered in its space
    expect(cells[0].x).toBe(10); // cellSize/2
    expect(cells[0].y).toBe(10);

    // Second cell (0, 1) should be at (40, 10) - 20 + 10 gap + 10 center
    expect(cells[1].x).toBe(40); // cellSize + gap + cellSize/2
    expect(cells[1].y).toBe(10);

    // Third cell (1, 0) should be at (10, 40)
    expect(cells[2].x).toBe(10);
    expect(cells[2].y).toBe(40);
  });

  it('should assign correct row and col ids', () => {
    const config: GridLayoutConfig = {
      type: 'grid',
      rows: 3,
      cols: 4,
      cellSize: 20,
    };

    const cells = createGridLayout(config);

    // Check first cell
    expect(cells[0].id.row).toBe(0);
    expect(cells[0].id.col).toBe(0);

    // Check last cell
    expect(cells[11].id.row).toBe(2);
    expect(cells[11].id.col).toBe(3);
  });

  it('should generate row-col labels correctly', () => {
    const config: GridLayoutConfig = {
      type: 'grid',
      rows: 2,
      cols: 3,
      cellSize: 20,
      labelPrefix: 'A',
      numbering: {
        scheme: 'row-col',
        startIndex: 1,
      },
    };

    const cells = createGridLayout(config);

    expect(cells[0].meta?.label).toBe('A11');
    expect(cells[1].meta?.label).toBe('A12');
    expect(cells[2].meta?.label).toBe('A13');
    expect(cells[3].meta?.label).toBe('A21');
    expect(cells[4].meta?.label).toBe('A22');
    expect(cells[5].meta?.label).toBe('A23');
  });

  it('should set all cells as available by default', () => {
    const config: GridLayoutConfig = {
      type: 'grid',
      rows: 2,
      cols: 2,
      cellSize: 20,
    };

    const cells = createGridLayout(config);

    cells.forEach((cell) => {
      expect(cell.meta?.status).toBe('available');
    });
  });

  it('should use correct cell size', () => {
    const config: GridLayoutConfig = {
      type: 'grid',
      rows: 1,
      cols: 1,
      cellSize: 25,
    };

    const cells = createGridLayout(config);

    expect(cells[0].w).toBe(25);
    expect(cells[0].h).toBe(25);
  });
});
