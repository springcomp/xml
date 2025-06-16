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

  it('should consider two TextSpan objects with same start and length as deeply equal', () => {
    const span1 = new TextSpan(2, 5);
    const span2 = new TextSpan(2, 5);
    expect(span1).toEqual(span2);
    expect(span1.equals(span2)).toBe(true);
  });

  it('should consider two TextSpan objects with different start or length as not deeply equal', () => {
    const span1 = new TextSpan(2, 5);
    const span2 = new TextSpan(3, 5);
    const span3 = new TextSpan(2, 6);
    expect(span1).not.toEqual(span2);
    expect(span1).not.toEqual(span3);
    expect(span1.equals(span2)).toBe(false);
    expect(span1.equals(span3)).toBe(false);
  });
  it('should have a friendly text representation as a range', () => {
    const span = new TextSpan(3);
    expect(span.asRange()).toBe('[3, 3]');
    expect(`${span}`).toBe('[3, 3]');
  });
  it('should have a friendly text representation as a location', () => {
    const span = new TextSpan(3);
    expect(span.asLocation()).toBe('(3, 0)');
  });
});
