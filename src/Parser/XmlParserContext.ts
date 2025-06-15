import { XNode } from '../Dom/XDocument.js';
import { Stack } from '../Utils/Stack.js';
import { StringBuilder } from '../Utils/StringBuilder.js';
import { NullParserState, XmlParserState } from './XmlParserState.js';

export class XmlParserContext {
  private currentState: XmlParserState = NullParserState.Instance;
  private readonly keywordBuilder = new StringBuilder();
  private position = 0;
  private previousState: XmlParserState = NullParserState.Instance;
  private readonly nodes = new Stack<XNode>();
  private stateTag = 0;
  public get CurrentState(): XmlParserState {
    return this.currentState;
  }
  public get KeywordBuilder(): StringBuilder {
    return this.keywordBuilder;
  }
  public get Nodes(): Stack<XNode> {
    return this.nodes;
  }
  public get Position() {
    return this.position;
  }
  public get PreviousState(): XmlParserState {
    return this.previousState;
  }
  public set CurrentState(state: XmlParserState) {
    this.currentState = state;
  }
  public set Position(position: number) {
    this.position = position;
  }
  public set PreviousState(state: XmlParserState) {
    this.previousState = state;
  }
  public get StateTag(): number {
    return this.stateTag;
  }
  public set StateTag(tag: number) {
    this.stateTag = tag;
  }
}
