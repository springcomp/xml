import { XmlChar } from './XmlChar.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlNameState extends XmlParserState {
  constructor() {
    super('XmlNameState');
  }
  public onChar(c: string, _context: XmlParserContext): XmlParserState {
    if (XmlChar.IsWhitespace(c) || ['<', '>', '/', '='].includes(c)) {
      return this.Parent;
    }

    if (XmlChar.IsNameChar(c)) {
      return this;
    }

    return this;
  }
}
