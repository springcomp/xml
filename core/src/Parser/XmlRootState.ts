import { XComment } from '../Dom/XComment.js';
import { XDocument } from '../Dom/XDocument.js';
import { XElement } from '../Dom/XElement.js';
import { Ref } from '../Utils/Ref.js';
import { InvalidParserStateException } from './ParserStateExceptions.js';
import { XmlChar } from './XmlChar.js';
import { XmlAttributeState } from './XmlAttributeState.js';
import { XmlClosingTagState } from './XmlClosingTagState.js';
import { XmlCommentState } from './XmlCommentState.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { XmlTagState } from './XmlTagState.js';
import { XmlTextState } from './XmlTextState.js';

export class XmlRootState extends XmlParserState {
  public static readonly StateName = 'XmlRootState';
  // states
  private static FREE = 0 as const;
  private static BRACKET = 1 as const;
  private static BRACKET_EXCLAM = 2 as const;
  private static COMMENT = 3 as const;
  protected static MAXCONST = 3 as const;

  private tagState: XmlTagState;
  private textState: XmlTextState;
  private closingTagState: XmlClosingTagState;
  private commentState: XmlCommentState;
  constructor(
    stateName?: string,
    tagState?: XmlTagState,
    closingTagState?: XmlClosingTagState,
    textState?: XmlTextState,
    commentState?: XmlCommentState,
  ) {
    super(stateName ?? XmlRootState.StateName);
    this.tagState = this.Adopt(tagState ?? new XmlTagState());
    this.closingTagState = this.Adopt(closingTagState ?? new XmlClosingTagState());
    this.textState = this.Adopt(textState ?? new XmlTextState());
    this.commentState = this.Adopt(commentState ?? new XmlCommentState());
  }
  public createDocument(): XDocument {
    return new XDocument();
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState | null {
    if (isEndOfFile) {
      const node = context.Nodes.peek();
      if (node.is(XComment)) {
        return this.commentState;
      }
      if (node.is(XElement)) {
        return this.tagState;
      }
      if (node.is(XDocument)) {
        return this.Parent;
      }
      throw new InvalidParserStateException(`RootState could not find state for sending EOF to ${node}`);
    }
    if (c === '<') {
      if (context.StateTag !== XmlRootState.FREE) {
        // TODO: Exception
      }
      context.StateTag = XmlRootState.BRACKET;
      return this;
    }
    console.log(context.StateTag);
    switch (context.StateTag) {
      case XmlRootState.FREE:
        if (!XmlChar.IsWhitespace(c)) {
          replayCharacter.Value = true;
          return this.textState;
        }
        break;
      case XmlRootState.BRACKET:
        if (c === '!') {
          context.StateTag = XmlRootState.BRACKET_EXCLAM;
          console.log(`BRACKET_EXCLAM ${c} --> state ${context.StateTag}`);
          return this;
        } else if (c === '/') {
          return this.closingTagState;
        } else if (XmlChar.IsNameStartChar(c) || XmlChar.IsWhitespace(c) || c === ':') {
          replayCharacter.Value = true;
          return this.tagState;
        }
        break;

      case XmlRootState.BRACKET_EXCLAM:
        switch (c) {
          case '-':
            context.StateTag = XmlRootState.COMMENT;
            console.log('COMMENT!');
            return this;
        }
        break;

      case XmlRootState.COMMENT:
        if (c === '-') {
          return this.commentState;
        }
        break;
    }

    context.StateTag = XmlRootState.FREE;
    return this;
  }
}
