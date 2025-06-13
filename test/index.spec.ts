import { describe, it, expect } from 'vitest';
import { sum } from '../src';

describe('tests', () => {
  it('test', () => {
    const result = sum(1, 2);
    expect(result).toBe(3);
  });
});
