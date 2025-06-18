import { describe, it, expect } from 'vitest';
import { XName } from '../../src/Dom/XName.js';

describe('XmlChar.IsWhitespace', () => {
  it('should return true for identical names', () => {
    expect(new XName('a').equals(new XName('a'))).toBe(true);
    expect(new XName('ns:a').equals(new XName('ns:a'))).toBe(true);
  });
  it('should return false for different names', () => {
    expect(new XName('a').equals(new XName('b'))).toBe(false);
    expect(new XName('ns0:a').equals(new XName('ns1:a'))).toBe(false);
  });
});
