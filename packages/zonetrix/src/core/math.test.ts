/**
 * Tests for math utilities
 */

import { describe, expect, it } from 'vitest';
import { calculateBoundingBox, cartesianToPolar, normalizeAngle, polarToCartesian } from './math';
import type { Cell } from './models';

describe('polarToCartesian', () => {
  it('should convert 0 degrees correctly', () => {
    const result = polarToCartesian(0, 0, 100, 0);
    expect(result.x).toBeCloseTo(100);
    expect(result.y).toBeCloseTo(0);
  });

  it('should convert 90 degrees correctly', () => {
    const result = polarToCartesian(0, 0, 100, 90);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(100);
  });

  it('should convert 180 degrees correctly', () => {
    const result = polarToCartesian(0, 0, 100, 180);
    expect(result.x).toBeCloseTo(-100);
    expect(result.y).toBeCloseTo(0);
  });
});

describe('cartesianToPolar', () => {
  it('should convert back from cartesian', () => {
    const result = cartesianToPolar(0, 0, 100, 0);
    expect(result.radius).toBeCloseTo(100);
    expect(result.angleDegrees).toBeCloseTo(0);
  });
});

describe('calculateBoundingBox', () => {
  it('should calculate correct bounding box', () => {
    const cells: Cell[] = [
      {
        id: { row: 0, col: 0 },
        kind: 'seat',
        x: 10,
        y: 10,
        w: 20,
        h: 20,
      },
      {
        id: { row: 0, col: 1 },
        kind: 'seat',
        x: 40,
        y: 10,
        w: 20,
        h: 20,
      },
    ];

    const bbox = calculateBoundingBox(cells);

    expect(bbox.minX).toBe(0); // 10 - 20/2
    expect(bbox.minY).toBe(0);
    expect(bbox.maxX).toBe(50); // 40 + 20/2
    expect(bbox.maxY).toBe(20); // 10 + 20/2
    expect(bbox.width).toBe(50);
    expect(bbox.height).toBe(20);
  });

  it('should return zeros for empty array', () => {
    const bbox = calculateBoundingBox([]);
    expect(bbox.width).toBe(0);
    expect(bbox.height).toBe(0);
  });
});

describe('normalizeAngle', () => {
  it('should normalize positive angles', () => {
    expect(normalizeAngle(390)).toBe(30);
    expect(normalizeAngle(720)).toBe(0);
  });

  it('should normalize negative angles', () => {
    expect(normalizeAngle(-90)).toBe(270);
    expect(normalizeAngle(-360)).toBe(0);
  });

  it('should keep angles in range', () => {
    expect(normalizeAngle(45)).toBe(45);
    expect(normalizeAngle(180)).toBe(180);
  });
});
