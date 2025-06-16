import { describe, it, expect } from 'vitest';
import { Ref } from '../../src/Utils/Ref.js';

describe('Ref', () => {
  it('should wrap a value and expose it via Value getter', () => {
    const ref = Ref.wrap(42);
    expect(ref.Value).toBe(42);
  });

  it('should allow updating the value via Value setter', () => {
    const ref = Ref.wrap('hello');
    ref.Value = 'world';
    expect(ref.Value).toBe('world');
  });

  it('should allow direct access to the value property', () => {
    const ref = Ref.wrap(true);
    expect(ref.value).toBe(true);
    ref.value = false;
    expect(ref.value).toBe(false);
  });

  it('should support wrapping objects', () => {
    const obj = { a: 1 };
    const ref = Ref.wrap(obj);
    expect(ref.Value).toEqual({ a: 1 });
    ref.Value.a = 2;
    expect(ref.Value.a).toBe(2);
  });
});
