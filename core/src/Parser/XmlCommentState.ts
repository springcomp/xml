import { XmlCoreDiagnostics } from '../Diagnostics/XmlCoreDiagnostics.js';
import { XComment } from '../Dom/XComment.js';
import { Ref } from '../Utils/Ref.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { ensureXContainer } from '../Dom/XContainer.js';

export class XmlCommentState extends XmlParserState {
  public static readonly StateName = 'XmlCommentState';
  // states
  private static readonly STARTOFFSET = 4; // "<!--"

  private static readonly NOMATCH = 0;
  private static readonly SINGLE_DASH = 1;
  private static readonly DOUBLE_DASH = 2;
  constructor() {
    super(XmlCommentState.StateName);
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    _replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState {
    if (context.enteringParsingState()) {
      context.Nodes.push(new XComment(context.Position - XmlCommentState.STARTOFFSET));
    }
    if (isEndOfFile) {
      context.addDiagnostic(XmlCoreDiagnostics.IncompleteCommentEof);
      return this.endAndPop(context);
    }

    if (c === '-') {
      // make sure we know when there are two '-' characters together
      if (context.StateTag === XmlCommentState.NOMATCH) {
        context.StateTag = XmlCommentState.SINGLE_DASH;
      } else {
        context.StateTag = XmlCommentState.DOUBLE_DASH;
      }
    } else if (context.StateTag === XmlCommentState.DOUBLE_DASH) {
      if (c == '>') {
        // if the '--' is followed by a '>', the state has ended
        // so attach a node to the DOM and end the state
        return this.endAndPop(context);
      } else {
        context.addDiagnostic(XmlCoreDiagnostics.IncompleteEndComment);
        context.StateTag = XmlCommentState.NOMATCH;
      }
    } else {
      // not any part of a '-->' so make sure matching is reset
      if (context.StateTag === XmlCommentState.SINGLE_DASH) {
        context.KeywordBuilder.append('-');
      }
      context.StateTag = XmlCommentState.NOMATCH;
      context.KeywordBuilder.append(c);
    }

    return this;
  }
  private endAndPop(context: XmlParserContext): XmlParserState {
    let comment = context.Nodes.pop().as(XComment);
    comment.end(context.Position);
    const parent = context.Nodes.peek();
    if (ensureXContainer(parent)) {
      comment = new XComment(comment.Span, context.KeywordBuilder.toString());
      parent.addChildNode(comment);
    }
    return this.Parent;
  }
}
