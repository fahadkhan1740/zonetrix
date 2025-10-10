/**
 * Tests for numbering utilities
 */

import { describe, expect, it } from 'vitest';
import { generateAngularLabel, getAlphaLabel } from './numbering';

describe('getAlphaLabel', () => {
  it('should generate single letter labels', () => {
    expect(getAlphaLabel(0)).toBe('A');
    expect(getAlphaLabel(1)).toBe('B');
    expect(getAlphaLabel(25)).toBe('Z');
  });

  it('should generate double letter labels', () => {
    expect(getAlphaLabel(26)).toBe('AA');
    expect(getAlphaLabel(27)).toBe('AB');
  });
});

describe('generateAngularLabel', () => {
  it('should generate numeric labels', () => {
    expect(generateAngularLabel(0, { scheme: 'index', startIndex: 1 })).toBe('1');
    expect(generateAngularLabel(5, { scheme: 'index', startIndex: 1 })).toBe('6');
  });

  it('should use labelPrefix if provided', () => {
    expect(generateAngularLabel(0, { scheme: 'index', startIndex: 1 }, 'S')).toBe('S1');
    expect(generateAngularLabel(10, { scheme: 'index', startIndex: 1 }, 'S')).toBe('S11');
  });
});
