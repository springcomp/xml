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
        const name = context.KeywordBuilder.toString();
        const colonIndex = name.indexOf(':');
        if (colonIndex < 0) {
          named.Name = new XName(name);
        } else if (colonIndex === 0) {
          context.addDiagnostic(XmlCoreDiagnostics.ZeroLengthNamespace, context.Position);
          named.Name = new XName(name.substring(1));
        } else if (colonIndex === name.length - 1) {
          context.addDiagnostic(XmlCoreDiagnostics.ZeroLengthNameWithNamespace, context.Position);
          named.Name = new XName(name.substring(0, colonIndex));
        } else {
          named.Name = new XName(name.substring(colonIndex + 1), name.substring(0, colonIndex));
        }
      }
      return this.Parent;
    }

    if (c === ':') {
      const name = context.KeywordBuilder.toString();
      const colonIndex = name.indexOf(':');
      if (colonIndex != -1) {
        context.addDiagnostic(XmlCoreDiagnostics.MultipleNamespaceSeparators, context.Position);
      }
      context.KeywordBuilder.append(c);
      return this;
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
