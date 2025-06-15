import { XDocument } from '../Dom/XDocument.js';
import { Ref } from '../Utils/Ref.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { XmlRootState } from './XmlRootState.js';

export class XmlTreeParser {
  private static readonly REPLAY_LIMIT_PER_CHARACTER = 10;
  private context = new XmlParserContext();
  private rootState: XmlParserState;
  constructor(rootState?: XmlRootState) {
    this.rootState = rootState ?? new XmlRootState();
  }
  // TODO: REMOVE the _getContext method
  public _getContext(): XmlParserContext {
    return this.context;
  }
  public parse(xml: string): XDocument {
    this.reset();

    const chars = xml.split('');
    chars.forEach(this.push, this);
    return new XDocument();
  }
  public reset(): void {
    this.context.CurrentState = this.rootState;
    this.context.PreviousState = this.rootState;
    this.context.Nodes.clear();
  }
  private push(c: string): void {
    let done = false;
    do {
      for (let loopLimit = 0; loopLimit < XmlTreeParser.REPLAY_LIMIT_PER_CHARACTER; loopLimit++) {
        const replayCharacter = Ref.wrap(false);
        const nextState = this.context.CurrentState.pushChar(c, this.context, replayCharacter);

        if (nextState === this.context.CurrentState) {
          done = true;
          break;
        }

        // state changed
        this.context.PreviousState = this.context.CurrentState;
        this.context.CurrentState = nextState;

        if (!replayCharacter.value) {
          done = true;
          break;
        }
      }
    } while (false);

    if (!done) {
      throw new Error(
        `Too many state changes for char '${c}'. Current state is '${this.context.CurrentState}' at position ${this.context.Position}.`,
      );
    }

    this.context.Position++;
  }
}
