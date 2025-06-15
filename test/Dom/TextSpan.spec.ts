import { describe, it, expect } from 'vitest';
import { TextSpan } from '../../src/Dom/TextSpan.js';

describe('TextSpan', () => {
  it('should construct with start and length', () => {
    const span = new TextSpan(5, 10);
    expect(span.Start).toBe(5);
    expect(span.Length).toBe(10);
    expect(span.End).toBe(15);
  });

  it('should default length to 0 if not provided', () => {
    const span = new TextSpan(3);
    expect(span.End).toBe(3);
  });

  it('should create span from bounds', () => {
    const span = TextSpan.fromBounds(2, 8);
    expect(span.End).toBe(8);
  });
});
