import { describe, it, expect } from 'vitest';
import { XmlChar } from '../../src/Parser/XmlChar.js';

describe('XmlChar.IsNameChar', () => {
  it('should return true for ASCII digits', () => {
    expect(XmlChar.IsNameChar('0')).toBe(true);
    expect(XmlChar.IsNameChar('1')).toBe(true);
    expect(XmlChar.IsNameChar('2')).toBe(true);
    expect(XmlChar.IsNameChar('3')).toBe(true);
    expect(XmlChar.IsNameChar('4')).toBe(true);
    expect(XmlChar.IsNameChar('5')).toBe(true);
    expect(XmlChar.IsNameChar('6')).toBe(true);
    expect(XmlChar.IsNameChar('7')).toBe(true);
    expect(XmlChar.IsNameChar('8')).toBe(true);
    expect(XmlChar.IsNameChar('9')).toBe(true);
  });
  it('should return true for ASCII letters', () => {
    expect(XmlChar.IsNameChar('a')).toBe(true);
    expect(XmlChar.IsNameChar('Z')).toBe(true);
    expect(XmlChar.IsNameChar('m')).toBe(true);
    expect(XmlChar.IsNameChar('Q')).toBe(true);
    expect(XmlChar.IsNameChar('_')).toBe(true);
  });
  it('should return true for select symbols', () => {
    expect(XmlChar.IsNameChar('-')).toBe(true);
    expect(XmlChar.IsNameChar('.')).toBe(true);
    expect(XmlChar.IsNameChar('·')).toBe(true);
  });
  it('should return false for colon', () => {
    expect(XmlChar.IsNameChar(':')).toBe(false);
  });
  it('should return false for whitespace characters', () => {
    expect(XmlChar.IsNameChar(' ')).toBe(false);
    expect(XmlChar.IsNameChar('\t')).toBe(false);
    expect(XmlChar.IsNameChar('\n')).toBe(false);
    expect(XmlChar.IsNameChar('\r')).toBe(false);
  });
  it('should return false for digits and symbols', () => {
    expect(XmlChar.IsNameChar('!')).toBe(false);
  });
  it('should return false for empty string', () => {
    expect(XmlChar.IsNameChar('')).toBe(false);
  });
  it('should return true for selected valid BMP characters from XML NameStartChar ranges', () => {
    // [#xC0-#xD6]
    expect(XmlChar.IsNameChar('\u00C0')).toBe(true); // U+00C0 LATIN CAPITAL LETTER A WITH GRAVE
    expect(XmlChar.IsNameChar('\u00D6')).toBe(true); // U+00D6 LATIN CAPITAL LETTER O WITH DIAERESIS
    // [#xD8-#xF6]
    expect(XmlChar.IsNameChar('\u00D8')).toBe(true); // U+00D8 LATIN CAPITAL LETTER O WITH STROKE
    expect(XmlChar.IsNameChar('\u00F6')).toBe(true); // U+00F6 LATIN SMALL LETTER O WITH DIAERESIS
    // [#xF8-#x2FF]
    expect(XmlChar.IsNameChar('\u00F8')).toBe(true); // U+00F8 LATIN SMALL LETTER O WITH STROKE
    expect(XmlChar.IsNameChar('\u02FF')).toBe(true); // U+02FF MODIFIER LETTER LOW LEFTHAND CORNER
    // [#x300-#x36F]
    expect(XmlChar.IsNameChar('\u0300')).toBe(true); // U+0300 COMBINING GRAVE ACCENT
    expect(XmlChar.IsNameChar('\u036F')).toBe(true); // U+036F COMBINING LATIN SMALL LETTER X
    // [#x370-#x37D]
    expect(XmlChar.IsNameChar('\u0370')).toBe(true); // U+0370 GREEK CAPITAL LETTER HETA
    expect(XmlChar.IsNameChar('\u037D')).toBe(true); // U+037D GREEK QUESTION MARK
    // [#x37F-#x1FFF]
    expect(XmlChar.IsNameChar('\u037F')).toBe(true); // U+037F GREEK CAPITAL LETTER YOT
    expect(XmlChar.IsNameChar('\u1FFF')).toBe(true); // U+1FFF GREEK CAPITAL REVERSED DOTTED LUNATE SIGMA SYMBOL
    // [#x200C-#x200D]
    expect(XmlChar.IsNameChar('\u200C')).toBe(true); // U+200C ZERO WIDTH NON-JOINER
    expect(XmlChar.IsNameChar('\u200D')).toBe(true); // U+200D ZERO WIDTH JOINER
    // [#x203C-#x2040]
    expect(XmlChar.IsNameChar('\u203F')).toBe(true); // U+203F UNDERTIE
    expect(XmlChar.IsNameChar('\u2040')).toBe(true); // U+2040 CHARACTER TIE
    // [#x2070-#x218F]
    expect(XmlChar.IsNameChar('\u2070')).toBe(true); // U+2070 SUPERSCRIPT ZERO
    expect(XmlChar.IsNameChar('\u218F')).toBe(true); // U+218F ROMAN NUMERAL ONE THOUSAND C D
    // [#x2C00-#x2FEF]
    expect(XmlChar.IsNameChar('\u2C00')).toBe(true); // U+2C00 GLAGOLITIC CAPITAL LETTER AZU
    expect(XmlChar.IsNameChar('\u2FEF')).toBe(true); // U+2FEF CJK RADICAL C-SIMPLIFIED TURTLE
    // [#x3001-#xD7FF]
    expect(XmlChar.IsNameChar('\u3001')).toBe(true); // U+3001 IDEOGRAPHIC COMMA
    expect(XmlChar.IsNameChar('\uD7FF')).toBe(true); // U+D7FF HANGUL JONGSEONG PHIEUPH-THIEUTH
    // [#xF900-#xFDCF]
    expect(XmlChar.IsNameChar('\uF900')).toBe(true); // U+F900 CJK COMPATIBILITY IDEOGRAPH-F900
    expect(XmlChar.IsNameChar('\uFDCF')).toBe(true); // U+FDCF CJK COMPATIBILITY IDEOGRAPH-FDCF
    // [#xFDF0-#xFFFD]
    expect(XmlChar.IsNameChar('\uFDF0')).toBe(true); // U+FDF0 ARABIC LIGATURE SALLALLAHOU ALAYHE WASALLAM
    expect(XmlChar.IsNameChar('\uFFFD')).toBe(true); // U+FFFD REPLACEMENT CHARACTER
  });
  it('should return false for specific BMP characters that are excluded', () => {
    // U+0024 DOLLAR SIGN ($) is not a valid XML NameStartChar character
    expect(XmlChar.IsNameChar('$')).toBe(false);
    // U+00A0 NO-BREAK SPACE is not a valid XML NameStartChar character
    expect(XmlChar.IsNameChar('\u00A0')).toBe(false);
    // U+00D7 MULTIPLICATION SIGN (×) is not a valid XML NameStartChar character
    expect(XmlChar.IsNameChar('\u00D7')).toBe(false);
    // U+00F7 DIVISION SIGN (÷) is not a valid XML NameStartChar character
    expect(XmlChar.IsNameChar('\u00F7')).toBe(false);
  });
  it('should return false for specific range of BMP characters that are excluded [#x00-#x2F]', () => {
    // Control characters and punctuation
    expect(XmlChar.IsNameChar('\u0000')).toBe(false); // U+0000 NULL
    expect(XmlChar.IsNameChar('\u001F')).toBe(false); // U+001F INFORMATION SEPARATOR ONE
    expect(XmlChar.IsNameChar('\u0020')).toBe(false); // U+0020 SPACE
    expect(XmlChar.IsNameChar('\u002F')).toBe(false); // U+002F SOLIDUS
  });
  it('should return false for specific range of BMP characters that are excluded [#x2000-#x200B]', () => {
    const chars = [
      '\u2000', // U+2000 EN QUAD
      '\u2001', // U+2001 EM QUAD
      '\u2002', // U+2002 EN SPACE
      '\u2003', // U+2003 EM SPACE
      '\u2004', // U+2004 THREE-PER-EM SPACE
      '\u2005', // U+2005 FOUR-PER-EM SPACE
      '\u2006', // U+2006 SIX-PER-EM SPACE
      '\u2007', // U+2007 FIGURE SPACE
      '\u2008', // U+2008 PUNCTUATION SPACE
      '\u2009', // U+2009 THIN SPACE
      '\u200A', // U+200A HAIR SPACE
      '\u200B', // U+200B ZERO WIDTH SPACE
    ];
    chars.forEach(ch => {
      expect(XmlChar.IsNameChar(ch)).toBe(false);
    });
  });
  it('should return false for specific range of BMP characters that are excluded [#x2190-#x2BFF]', () => {
    // Arrows and miscellaneous symbols
    expect(XmlChar.IsNameChar('\u2190')).toBe(false); // U+2190 LEFTWARDS ARROW
    expect(XmlChar.IsNameChar('\u2BFF')).toBe(false); // U+2BFF MISCELLANEOUS SYMBOLS AND ARROWS
  });
  it('should return false for specific range of BMP characters that are excluded [#xE000-#xF8FF]', () => {
    // Private Use Area
    expect(XmlChar.IsNameChar('\uE000')).toBe(false); // U+E000 PRIVATE USE AREA
    expect(XmlChar.IsNameChar('\uF8FF')).toBe(false); // U+F8FF PRIVATE USE AREA
  });
  it('should return false for characters outside the BMP', () => {
    // U+1F600 GRINNING FACE (😀)
    expect(XmlChar.IsNameChar('\u{1F600}')).toBe(false);
    // U+10400 DESERET CAPITAL LETTER LONG I (𐐀)
    expect(XmlChar.IsNameChar('\u{10400}')).toBe(false);
  });
});
