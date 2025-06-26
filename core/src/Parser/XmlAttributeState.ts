import { Ref } from '../Utils/index.js';
import { XmlAttributeValueState } from './XmlAttributeValueState.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlAttributeState extends XmlParserState {
  private static readonly StateName = 'XAttributeState';
  private attributeValueState: XmlAttributeValueState;
  constructor(attributeValueState?: XmlAttributeValueState) {
    super(XmlAttributeState.StateName);
    this.attributeValueState = this.Adopt(attributeValueState ?? new XmlAttributeValueState());
  }
  protected onChar(
    _c: string,
    _context: XmlParserContext,
    _replayCharacter: Ref<boolean>,
    _isEndOfFile: boolean,
  ): XmlParserState {
    return this.attributeValueState;
  }
}
