import { XmlCharTables } from './XmlCharTables.js';

export class XmlChar {
  private static readonly whitespaceChars = [
    0x09, // U+0009 CHARACTER TABULATION (TAB)
    0x0a, // U+000A LINE FEED (LF)
    0x0d, // U+000D CARRIAGE RETURN (CR)
    0x20, // U+0020 SPACE
  ];

  private static colon = 0x3a; // ':' U+003A COLON
  private static letter_a = 0x61; // 'a' U+0061 LATIN SMALL LETTER A
  private static letter_z = 0x7a; // 'z' U+007A LATIN SMALL LETTER Z
  private static letter_A = 0x41; // 'A' U+0041 LATIN CAPITAL LETTER A
  private static letter_Z = 0x5a; // 'Z' U+005A LATIN CAPITAL LETTER Z

  static IsWhitespace(c: string): boolean {
    const ch = c.codePointAt(0) ?? -1;
    if (ch < 0 || ch > 0x10ffff) {
      return false; // Invalid code point
    }
    return XmlChar.whitespaceChars.includes(ch);
  }

  static IsFirstNameChar(c: string): boolean {
    const ch = c.codePointAt(0) ?? -1;
    if (ch < 0 || ch > 0x10ffff) {
      return false; // Invalid code point
    }

    // Names starting with a colon are valid according to the spec,
    // but the spec also recommends that they only be used for namespaces.
    // To allow proper error recovery we simplify and do not accept
    // colons in names.
    // https://www.w3.org/TR/xml/#NT-NameStartChar
    if (ch == XmlChar.colon) {
      return false;
    }

    // We also exclude characters outside the BMP (Basic Multilingual Plane) for now,
    if (ch > 0xffff && ch <= 0x10ffff) {
      return false;
    }

    // ASCII letters ([a-z] or [A-Z]) are valid first characters
    if ((ch >= XmlChar.letter_a && ch <= XmlChar.letter_z) || (ch >= XmlChar.letter_A && ch <= XmlChar.letter_Z)) {
      return true;
    }
    // characters in the BMP (Basic Multilingual Plane) are valid if they are in the NameStartChar set
    if (ch <= 0xffff) {
      const hiByte = ch >> 8;
      const loByte = ch & 0xff;
      // for a code point `ch`:
      // `` FirstNamePages[ch >> 8] `` gives a small integer (the "page index") for that high byte.
      const pageIndex = XmlCharTables.FirstNamePages[hiByte];
      // the value returned by `` FirstNamePages[ch >> 8] `` is shifted left by 3 bits (i.e., multiplied by 8)
      // because each "page" of 256 Unicode code points (one for each possible value of the high byte) is represented
      // by 8 entries in the NameBitmap array. This gives the starting index for that page in the bitmap.
      const pageOffset = pageIndex << 3;
      // the low byte of the code point `` (ch & 0xff) `` is divided by 32 to select the correct 32-bit integer within the page.
      const byteSelector = loByte >> 5;
      // the bit within that integer is selected by `` ch & 0x1f `` (the lowest 5 bits).
      const bitMask = 1 << (loByte & 0x1f);
      return (XmlCharTables.NameBitmap[pageOffset + byteSelector] & bitMask) != 0;
    }
    return false;
  }
}
