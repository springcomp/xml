import { XDocument } from '../Dom/XDocument.js';
import { Ref } from '../Utils/Ref.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlRootState } from './XmlRootState.js';

type ParseResult = [XDocument | null, null];

export class XmlTreeParser {
  private static readonly REPLAY_LIMIT_PER_CHARACTER = 10;
  private context = new XmlParserContext();
  private rootState: XmlRootState;
  constructor(rootState?: XmlRootState) {
    this.rootState = rootState ?? new XmlRootState();
  }
  // TODO: REMOVE the _getContext method
  public _getContext(): XmlParserContext {
    return this.context;
  }
  public parse(xml: string): ParseResult {
    this.reset();

    const chars = xml.split('');
    chars.forEach(this.push, this);
    return this.endAllNodes();
  }
  private endAllNodes(): ParseResult {
    this.context.Position++;
    this.context.IsAtEndOfFile = true;

    const nodes = this.context.Nodes;
    if (nodes.count() != 1 || nodes.peek().as(XDocument) === null) {
      // TODO throw new InvalidParserStateException ("Malformed state stack when ending all nodes");
    }

    const document = nodes.pop().as(XDocument);
    if (document != null) {
      document.end(this.context.Position);
    }

    //for (int i = nodes.Length - 1; i >= 0; i--) {
    //	var node = nodes[i];
    //	if (!node.IsEnded) {
    //		throw new InvalidParserStateException ($"Parser states did not end '{node}' node");
    //	}

    return [document, null];
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
  private reset(): void {
    this.context.CurrentState = this.rootState;
    this.context.PreviousState = this.rootState;
    this.context.Nodes.clear();
    this.context.Nodes.push(this.rootState.createDocument());
  }
}
