import { XmlCoreDiagnostics } from '../Diagnostics/XmlCoreDiagnostics.js';
import { XmlDiagnostic } from '../Diagnostics/XmlDiagnostic.js';
import { XContainer } from '../Dom/XContainer.js';
import { XElement } from '../Dom/XElement.js';
import { Ref } from '../Utils/Ref.js';
import { InvalidParserStateException } from './ParserStateExceptions.js';
import { XmlChar } from './XmlChar.js';
import { XmlNameState } from './XmlNameState.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlTagState extends XmlParserState {
  public static readonly StateName = 'XmlTagState';
  // states
  private static readonly STARTOFFSET = 1; // <
  private static readonly FREE = 0;
  private static readonly MAYBE_SELF_CLOSING = 1;
  private static readonly ATTEMPT_RECOVERY = 2;
  private static readonly RECOVERY_FOUND_WHITESPACE = 3;

  private nameState: XmlNameState;
  constructor(nameState?: XmlNameState) {
    super(XmlTagState.StateName);
    this.nameState = this.Adopt(nameState ?? new XmlNameState());
  }
  public onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState {
    const peekedNode = context.Nodes.peek() as XContainer;
    let [_, element] = peekedNode.tryAs(XElement);

    // if the current node on the stack is ended or not an element
    // then it’s the parent and we need to create a new element
    if (isEndOfFile) {
      if (element === null) {
        throw new InvalidParserStateException(
          'When entering tag state during EOF, there MUST be an XElement on the stack',
        );
      }
    } else if (element === null || element.IsEnded) {
      const parent = peekedNode;
      element = new XElement(context.Position - XmlTagState.STARTOFFSET);
      context.Nodes.push(element);
      parent.addChildNode(element);
    }

    if (isEndOfFile) {
      context.addDiagnostic(XmlCoreDiagnostics.IncompleteTagEof);
      context.Nodes.pop();
      replayCharacter.Value = true;
      return this.Parent;
    }

    if (c === '>') {
      element.HasEndBracket = true;
      element.end(context.Position);

      if (!element.IsNamed) {
        context.Diagnostics.push(new XmlDiagnostic(XmlCoreDiagnostics.UnnamedTag, element.Span));
      }

      if (context.StateTag === XmlTagState.MAYBE_SELF_CLOSING) {
        element.close(element);
        context.Nodes.pop();
      }
      return this.Parent;
    }

    if (c === '/') {
      context.StateTag = XmlTagState.MAYBE_SELF_CLOSING;
      return this;
    }

    if (context.StateTag === XmlTagState.MAYBE_SELF_CLOSING) {
      context.addDiagnostic(XmlCoreDiagnostics.MalformedSelfClosingTag, context.Position, c);
      return this;
    }

    if (context.StateTag === XmlTagState.ATTEMPT_RECOVERY) {
      if (XmlChar.IsWhitespace(c)) {
        context.StateTag = XmlTagState.RECOVERY_FOUND_WHITESPACE;
      }
      return this;
    }
    if (context.StateTag === XmlTagState.RECOVERY_FOUND_WHITESPACE) {
      if (XmlChar.IsNameStartChar(c)) {
        return this;
      }
    }

    context.StateTag = XmlTagState.FREE;

    if (!element.IsNamed && (XmlChar.IsNameStartChar(c) || c === ':')) {
      replayCharacter.Value = true;
      return this.nameState;
    }

    if (!element.IsNamed && element.Span.Start + XmlTagState.STARTOFFSET === context.Position) {
      context.addDiagnostic(XmlCoreDiagnostics.MalformedTagOpening, context.Position, c);
    }

    if (XmlChar.IsWhitespace(c)) {
      return this;
    }

    // XmlNameState will have reported an error already
    if (context.PreviousState.Name === 'XmlNameState') {
      context.addDiagnostic(XmlCoreDiagnostics.MalformedTag, context.Position, c);
    }

    context.StateTag = XmlTagState.ATTEMPT_RECOVERY;
    return this;
  }
}
