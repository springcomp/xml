import { XElement } from '../Dom/XElement.js';
import { XText } from '../Dom/XText.js';
import { Ref } from '../Utils/Ref.js';
import { XmlChar } from './XmlChar.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlTextState extends XmlParserState {
  private static readonly StateName = 'XmlTextState';
  constructor(stateName?: string) {
    super(stateName ?? XmlTextState.StateName);
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState {
    // FIXME: handle entities
    if (context.enteringParsingState()) {
      context.Nodes.push(new XText(context.Position));
    }
    if (c === '<' || isEndOfFile) {
      replayCharacter.Value = true;
      // trim the text down to the last non-whitespace character
      const node = context.Nodes.pop().as(XText);
      const length = context.StateTag - node?.Span.Start + 1;
      context.KeywordBuilder.byteLength = length;
      const text = new XText(node.Span.Start, context.KeywordBuilder.toString());
      const element = context.Nodes.peek().as(XElement);
      element.addChildNode(text);
      return this.Parent;
    }
    if (!XmlChar.IsWhitespace(c)) {
      // StateTag is tracking the last non-whitespace character
      context.StateTag = context.Position;
    }

    context.KeywordBuilder.append(c);
    return this;
  }
}
