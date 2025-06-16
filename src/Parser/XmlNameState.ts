import { INamedXObject, isINamedXObject } from '../Dom/INamedXObject.js';
import { Ref } from '../Utils/Ref.js';
import { XmlChar } from './XmlChar.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { XName } from '../Dom/XName.js';
import { InvalidParserStateException } from './ParserStateExceptions.js';
import { XmlCoreDiagnostics } from '../Diagnostics/XmlCoreDiagnostics.js';

export class XmlNameState extends XmlParserState {
  public static readonly StateName = 'XmlNameState';
  constructor() {
    super(XmlNameState.StateName);
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState {
    const node = context.Nodes.peek();
    if (isINamedXObject(node)) {
      if (node.Name.HasPrefix || node.Name.IsValid) {
        throw new InvalidParserStateException('XmlNameState can only operate on an INamedXObject without a name');
      }
    } else {
      throw new InvalidParserStateException('XmlNameState can only operate on an INamedXObject');
    }

    const named = <INamedXObject>(<unknown>node);
    if (isEndOfFile || XmlChar.IsWhitespace(c) || ['<', '>', '/', '='].includes(c)) {
      replayCharacter.Value = true;
      if (context.KeywordBuilder.byteLength === 0) {
        named.Name = XName.Empty;
      } else {
        // TODO: handle ':' and prefix
        const name = context.KeywordBuilder.toString();
        named.Name = new XName(name);
      }
      return this.Parent;
    }

    if (XmlChar.IsNameChar(c)) {
      context.KeywordBuilder.append(c);
      return this;
    }

    replayCharacter.Value = true;
    context.addDiagnostic(XmlCoreDiagnostics.InvalidNameCharacter, context.Position, c);
    return this.Parent;
  }
}
