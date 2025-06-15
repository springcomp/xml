import { Ref } from '../Utils/Ref.js';
import { XmlChar } from './XmlChar.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlNameState extends XmlParserState {
  constructor() {
    super('XmlNameState');
  }
  public onChar(c: string, context: XmlParserContext, _replayCharacter: Ref<boolean>): XmlParserState {
    if (XmlChar.IsWhitespace(c) || ['<', '>', '/', '='].includes(c)) {
      return this.Parent;
    }

    if (XmlChar.IsNameChar(c)) {
      context.KeywordBuilder.append(c);
      return this;
    }

    return this;
  }
}
