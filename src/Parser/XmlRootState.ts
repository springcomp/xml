import { Ref } from '../Utils/Ref.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { XmlTagState } from './XmlTagState.js';

export class XmlRootState extends XmlParserState {
  // states
  private static FREE = 0 as const;
  private static BRACKET = 1 as const;
  protected static MAXCONST = 1 as const;

  private tagState: XmlTagState;
  constructor(tagState?: XmlTagState) {
    super('XmlRootState');
    this.tagState = this.Adopt(tagState ?? new XmlTagState());
  }
  public onChar(c: string, context: XmlParserContext, _replayCharacter: Ref<boolean>): XmlParserState {
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
        return this.tagState;
    }

    context.StateTag = XmlRootState.FREE;
    return this;
  }
}
