import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlNameState extends XmlParserState {
  constructor() {
    super('XmlNameState');
  }
  public onChar(_c: string, _context: XmlParserContext): XmlParserState {
    return this;
  }
}
