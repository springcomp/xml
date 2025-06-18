import { describe, it, expect } from 'vitest';
import { isType } from '../../src/Utils/TypeHelpers';
describe('isType', () => {
  it('should determine whether an instance is of a given type', () => {
    const a = new A(1, 'text');
    const b = new A(1, 'text');
    expect(isType(a, A)).toBe(true);
    expect(isType(b, B)).toBe(false);
  });
  it('should identify correct type from a class hierarchy', () => {
    const b = new B(1, 'text');
    const c = new C(1, 'text');
    const d = new D(1);
    expect(isType(b, B)).toBe(true);
    expect(isType(b, C)).toBe(false);
    expect(isType(b, D)).toBe(false);

    expect(isType(c, B)).toBe(true);
    expect(isType(c, C)).toBe(true);
    expect(isType(c, D)).toBe(false);

    expect(isType(d, B)).toBe(true);
    expect(isType(d, C)).toBe(true);
    expect(isType(d, D)).toBe(true);
  });
});

class A {
  constructor(_a: number, _t: string) {}
}
class B {
  constructor(_a: number, _t: string) {}
}
class C extends B {
  constructor(a: number, t: string) {
    super(a, t);
  }
}
class D extends C {
  constructor(a: number) {
    super(a, '');
  }
}
