import { Ref } from '../Utils/index.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlAttributeValueState extends XmlParserState {
  private static readonly StateName = 'XAttributeValueState';
  constructor(stateName?: string) {
    super(stateName ?? XmlAttributeValueState.StateName);
  }
  protected onChar(
    _c: string,
    _context: XmlParserContext,
    _replayCharacter: Ref<boolean>,
    _isEndOfFile: boolean,
  ): XmlParserState {
    return this;
  }
}
