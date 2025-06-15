import { XElement } from '../Dom/XDocument.js';
import { Ref } from '../Utils/Ref.js';
import { XmlNameState } from './XmlNameState.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlTagState extends XmlParserState {
  // states
  //private static readonly STARTOFFSET = 1; // <

  private nameState: XmlNameState;
  constructor(nameState?: XmlNameState) {
    super('XmlTagState');
    this.nameState = this.Adopt(nameState ?? new XmlNameState());
  }
  public onChar(_c: string, context: XmlParserContext, _replayCharacter: Ref<boolean>): XmlParserState {
    const peekedNode = context.Nodes.peek();
    const element = peekedNode !== null ? (peekedNode as XElement) : null;

    // if the current node on the stack is ended or not an element
    // then it’s the parent and we need to create a new element
    if (element === null) {
      //const parent = peekedNode;
      const element = new XElement(); // context.Position - XmlTagState.STARTOFFSET);
      context.Nodes.push(element);
      //parent.AddChildNode(element);
    }

    return this.nameState;
  }
}
