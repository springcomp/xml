import { describe, it, expect } from 'vitest';
import { XName } from '../../src/Dom/XName.js';

describe('XName', () => {
  it('should compare names', () => {
    const left = new XName('name');
    const right = new XName('name');
    expect(left.equals(right, false)).toBe(true);
  });
  it('should compare names with prefix', () => {
    const left = new XName('name', 'ns0');
    const right = new XName('name', 'ns0');
    expect(left.equals(right, false)).toBe(true);
  });
  it('should compare names (case insensitive)', () => {
    const left = new XName('name');
    const right = new XName('nAmE');
    expect(left.equals(right, true)).toBe(true);
  });
  it('should compare names with prefix (case insensitive)', () => {
    const left = new XName('name', 'ns0');
    const right = new XName('nAme', 'nS0');
    expect(left.equals(right, true)).toBe(true);
  });
});
