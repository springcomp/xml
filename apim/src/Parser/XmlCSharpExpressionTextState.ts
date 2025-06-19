import { isXContainer, XText } from '@springcomp/xml-core/Dom/index.js';
import { XmlChar, XmlParserContext, XmlTextState } from '@springcomp/xml-core/Parser/index.js';
import type { XmlParserState } from '@springcomp/xml-core/Parser/index.js';
import { Ref } from '@springcomp/xml-core/Utils/index.js';
import { XmlCSharpExpressionState } from './XmlCSharpExpressionState.js';
import { XCSharpExpression } from '../Dom/XCSharpExpression.js';

export class XmlCSharpExpressionTextState extends XmlTextState {
  private static readonly XmlCSharpExpressionTextStateName = 'XmlCSharpExpressionTextState';

  private previousStateTag = CSharpTextState.NONE;
  private stateTag = CSharpTextState.FREE;
  private multiStatement = false;

  private cSharpExpressionState: XmlCSharpExpressionState;
  constructor() {
    super(XmlCSharpExpressionTextState.XmlCSharpExpressionTextStateName);
    this.cSharpExpressionState = this.Adopt(new XmlCSharpExpressionState());
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState {
    if (context.Nodes.tryPeek()?.is(XText)) {
      console.log('ON XText');
      return super.onChar(c, context, replayCharacter, isEndOfFile);
    }
    this.popState(context);

    console.log('XmlCSharpExpressionTextState:: Parsing C# expression');
    console.log(`XmlCSharpExpressionTextState:: StateTag = ${context.StateTag}`);

    switch (context.StateTag) {
      case CSharpTextState.FREE:
        if (c === '@') {
          context.StateTag = CSharpTextState.AT;
        }
        break;
      case CSharpTextState.AT:
        if (c === '(') {
          context.StateTag = CSharpTextState.LPAREN;
          this.pushState(context);
          this.multiStatement = false;
          return this.cSharpExpressionState;
        }
        if (c == '{') {
          context.StateTag = CSharpTextState.LBRACE;
          this.pushState(context);
          this.multiStatement = true;
          return this.cSharpExpressionState;
        } else if (XmlChar.IsWhitespace(c)) {
          // ignore white space
          return this;
        } else {
          context.StateTag = CSharpTextState.TEXT;
          super.onChar('@', context, replayCharacter, isEndOfFile);
          return super.onChar(c, context, replayCharacter, isEndOfFile);
        }

      case CSharpTextState.LPAREN:
        console.log('ON RPAREN');
        if (c !== ')') {
          replayCharacter.Value = true;
        }
        return this.endAndPop(context);
      case CSharpTextState.LBRACE:
        if (c !== '}') {
          replayCharacter.Value = true;
        }
        return this.endAndPop(context, this.multiStatement);
    }
    return this;
  }
  private pushState(context: XmlParserContext) {
    this.previousStateTag = context.CurrentStateLength;
    this.stateTag = context.StateTag;
  }
  private popState(context: XmlParserContext) {
    if (this.previousStateTag == CSharpTextState.NONE) {
      return;
    }

    context.StateTag = this.stateTag;
    context.resetParsingState(this.previousStateTag);

    this.stateTag = CSharpTextState.NONE;
    this.previousStateTag = CSharpTextState.NONE;
  }
  private endAndPop(context: XmlParserContext, multiStatement?: boolean): XmlParserState {
    console.log('XmlCSharpExpressionState::endAnPop');
    const statement = context.Nodes.pop().as(XCSharpExpression);
    statement.end(context.Position);
    const parent = context.Nodes.peek();
    if (isXContainer(parent)) {
      parent.addChildNode(new XCSharpExpression(statement.Span, statement.Code, multiStatement));
    }
    return this.Parent;
  }
}
export enum CSharpTextState {
  NONE = -1,
  FREE = 0,
  AT = 1,
  LPAREN = 2,
  LBRACE = 4,
  TEXT = 8,
}
