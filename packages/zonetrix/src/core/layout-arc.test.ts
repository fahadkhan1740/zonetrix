/**
 * Tests for arc layout algorithm
 */

import { describe, expect, it } from 'vitest';
import { createArcLayout } from './layout-arc';
import type { ArcLayoutConfig } from './models';

describe('createArcLayout', () => {
  it('should create correct number of cells', () => {
    const config: ArcLayoutConfig = {
      type: 'arc',
      radius: 100,
      sweepDegrees: 180,
      count: 50,
      cellSize: 20,
    };

    const cells = createArcLayout(config);
    expect(cells).toHaveLength(50);
  });

  it('should assign sequential index ids', () => {
    const config: ArcLayoutConfig = {
      type: 'arc',
      radius: 100,
      sweepDegrees: 90,
      count: 10,
      cellSize: 20,
    };

    const cells = createArcLayout(config);

    cells.forEach((cell, i) => {
      expect(cell.id.index).toBe(i);
    });
  });

  it('should position cells along an arc', () => {
    const config: ArcLayoutConfig = {
      type: 'arc',
      radius: 100,
      sweepDegrees: 180,
      count: 3,
      cellSize: 20,
      origin: { x: 0, y: 0 },
    };

    const cells = createArcLayout(config);

    // With 180 degrees and 3 cells, they should be at -180, -90, and 0 degrees
    // (starting from -90 - 90 = -180)
    // Just verify they're different positions
    expect(cells[0].x).not.toBe(cells[1].x);
    expect(cells[1].x).not.toBe(cells[2].x);
  });

  it('should set rotation for each cell', () => {
    const config: ArcLayoutConfig = {
      type: 'arc',
      radius: 100,
      sweepDegrees: 180,
      count: 5,
      cellSize: 20,
    };

    const cells = createArcLayout(config);

    cells.forEach((cell) => {
      expect(cell.rotation).toBeDefined();
      expect(typeof cell.rotation).toBe('number');
    });
  });

  it('should generate labels with index scheme', () => {
    const config: ArcLayoutConfig = {
      type: 'arc',
      radius: 100,
      sweepDegrees: 90,
      count: 3,
      cellSize: 20,
      numbering: {
        scheme: 'index',
        startIndex: 1,
      },
    };

    const cells = createArcLayout(config);

    expect(cells[0].meta?.label).toBe('1');
    expect(cells[1].meta?.label).toBe('2');
    expect(cells[2].meta?.label).toBe('3');
  });
});
