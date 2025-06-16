import { INamedXObject, isINamedXObject } from '../Dom/INamedXObject.js';
import { Ref } from '../Utils/Ref.js';
import { XmlChar } from './XmlChar.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { XName } from '../Dom/XName.js';

export class XmlNameState extends XmlParserState {
  public static readonly StateName = 'XmlNameState';
  constructor() {
    super(XmlNameState.StateName);
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    _replayCharacter: Ref<boolean>,
    _isEndOfFile: boolean,
  ): XmlParserState {
    const node = context.Nodes.peek();
    if (!isINamedXObject(node)) {
      // TODO: error
    }

    const named = <INamedXObject>(<unknown>node);
    if (XmlChar.IsWhitespace(c) || ['<', '>', '/', '='].includes(c)) {
      const name = context.KeywordBuilder.toString();
      named.Name = new XName(name);
      return this.Parent;
    }

    if (XmlChar.IsNameChar(c)) {
      context.KeywordBuilder.append(c);
      return this;
    }

    return this;
  }
}
