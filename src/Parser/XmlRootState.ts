import { XDocument } from '../Dom/XDocument.js';
import { Ref } from '../Utils/Ref.js';
import { XmlChar } from './XmlChar.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { XmlTagState } from './XmlTagState.js';

export class XmlRootState extends XmlParserState {
  public static readonly StateName = 'XmlRootState';
  // states
  private static FREE = 0 as const;
  private static BRACKET = 1 as const;
  protected static MAXCONST = 1 as const;

  private tagState: XmlTagState;
  constructor(tagState?: XmlTagState) {
    super(XmlRootState.StateName);
    this.tagState = this.Adopt(tagState ?? new XmlTagState());
  }
  public createDocument(): XDocument {
    return new XDocument();
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    _isEndOfFile: boolean,
  ): XmlParserState {
    if (c == '<') {
      if (context.StateTag !== XmlRootState.FREE) {
        // TODO: Exception
      }
      context.StateTag = XmlRootState.BRACKET;
      return this;
    }
    switch (context.StateTag) {
      case XmlRootState.FREE:
        break;
      case XmlRootState.BRACKET:
        if (XmlChar.IsNameStartChar(c) || XmlChar.IsWhitespace(c)) {
          replayCharacter.Value = true;
          return this.tagState;
        }
    }

    context.StateTag = XmlRootState.FREE;
    return this;
  }
}
