import { describe, it, expect } from 'vitest';
import { XmlChar } from '../../src/Parser/XmlChar.js';

describe('XmlChar.IsWhitespace', () => {
  it("should return true for ' ' (U+0009 TABULATION CHARACTER)", () => {
    expect(XmlChar.IsWhitespace('\t')).toBe(true);
  });
  it("should return true for ' ' (U+000A LINEFEED)", () => {
    expect(XmlChar.IsWhitespace('\n')).toBe(true);
  });
  it("should return true for ' ' (U+000D CARRIAGE RETURN)", () => {
    expect(XmlChar.IsWhitespace('\r')).toBe(true);
  });
  it("should return true for ' ' (U+0020 SPACE)", () => {
    expect(XmlChar.IsWhitespace(' ')).toBe(true);
  });
  it('should return false for invalid code points', () => {
    expect(XmlChar.IsWhitespace('')).toBe(false);
  });
});
