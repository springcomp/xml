import { XmlCharTables } from './XmlCharTables.js';

export class XmlChar {
  private static readonly whitespaceChars = [
    0x09, // U+0009 CHARACTER TABULATION (TAB)
    0x0a, // U+000A LINE FEED (LF)
    0x0d, // U+000D CARRIAGE RETURN (CR)
    0x20, // U+0020 SPACE
  ];

  private static colon = 0x3a; // ':' U+003A COLON

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

    // We also exclude characters outside the BMP (Basic Multilingual Plane) for now

    if (ch > 0xffff && ch <= 0x10ffff) {
      return false;
    }

    // characters in the BMP (Basic Multilingual Plane) are valid
    // if they are in the NameStartChar set

    if (ch <= 0xffff) {
      const page = ch >> 8; // high byte
      const logicalIndex = XmlCharTables.FirstNamePages[page]; // logical page index
      const offset = logicalIndex << 3; // page offset
      const selector = (ch >> 5) & 0x07; // selector within page
      const bitPos = ch & 0x1f; // bit position within selected number
      const bitMask = 1 << bitPos;
      return (XmlCharTables.FirstNameBitmap[offset + selector] & bitMask) != 0;
    }

    return false;
  }
  static IsNameChar(c: string): boolean {
    const ch = c.codePointAt(0) ?? -1;
    if (ch < 0 || ch > 0x10ffff) {
      return false; // Invalid code point
    }

    // Names containing a colon are valid according to the spec,
    // but the spec also recommends that they only be used for namespaces.
    // To allow proper error recovery we simplify and do not accept
    // colons in names.
    // https://www.w3.org/TR/xml/#NT-NameChar

    if (ch == XmlChar.colon) {
      return false;
    }

    // We also exclude characters outside the BMP (Basic Multilingual Plane) for now

    if (ch > 0xffff && ch <= 0x10ffff) {
      return false;
    }

    // characters in the BMP (Basic Multilingual Plane) are valid
    // if they are in the NameChar set

    if (ch <= 0xffff) {
      const page = ch >> 8; // high byte
      const logicalIndex = XmlCharTables.NamePages[page]; // logical page index
      const offset = logicalIndex << 3; // page offset
      const selector = (ch >> 5) & 0x07; // selector within page
      const bitPos = ch & 0x1f; // bit position within selected number
      const bitMask = 1 << bitPos;
      return (XmlCharTables.NameBitmap[offset + selector] & bitMask) != 0;
    }

    return false;
  }
}
