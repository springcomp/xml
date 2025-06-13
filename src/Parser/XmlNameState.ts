import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlNameState extends XmlParserState {
  constructor() {
    super('XmlNameState');
  }
  public pushChar(c: string, context: XmlParserContext): XmlParserState {
    console.log(`XmlNameTag.pushChar: ${c} at position ${context.Position}; StateTag: ${context.StateTag}`);
    return this;
  }
}
