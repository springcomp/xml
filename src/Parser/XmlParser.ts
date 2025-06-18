import { XmlDiagnostic } from '../Diagnostics/XmlDiagnostic.js';
import { XDocument } from '../Dom/XDocument.js';
import { Ref } from '../Utils/Ref.js';
import { TypeCastException } from '../Utils/TypeCastException.js';
import { InvalidParserStateException } from './ParserStateExceptions.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlRootState } from './XmlRootState.js';

export type ParseResult = [XDocument | null, XmlDiagnostic[]];

export class XmlTreeParser {
  private static readonly REPLAY_LIMIT_PER_CHARACTER = 10;
  private context = new XmlParserContext();
  private rootState: XmlRootState;
  constructor(rootState?: XmlRootState) {
    this.rootState = rootState ?? new XmlRootState();
  }
  public parse(xml: string): ParseResult {
    this.reset();

    const chars = xml.split('');
    chars.forEach(this.push, this);
    return this.endAllNodes();
  }
  protected getContext(): XmlParserContext {
    return this.context;
  }
  protected endAllNodes(): ParseResult {
    this.context.Position++;
    this.context.IsAtEndOfFile = true;

    const nodes = this.context.Nodes;

    console.log(`ENDALLNODES ${nodes.count()}`);

    try {
      let loopMax = nodes.count() * XmlTreeParser.REPLAY_LIMIT_PER_CHARACTER;
      while (nodes.count() >= 1 && loopMax-- > 0) {
        const replayCharacter = Ref.wrap(false);
        const nextState = this.context.CurrentState.pushChar('\0', this.context, replayCharacter, true);
        if (this.context.CurrentState === nextState) {
          break;
        }
        this.context.CurrentState = nextState;
      }
    } catch (exception: unknown) {
      if (exception instanceof TypeCastException) {
        throw new InvalidParserStateException(exception.message);
      }
      throw exception;
    }

    if (nodes.count() != 1 || !nodes.peek().is(XDocument)) {
      throw new InvalidParserStateException('Malformed state stack when ending all nodes');
    }

    const document = nodes.pop().as(XDocument);
    if (document != null) {
      document.end(this.context.Position);
    }

    // for (const node of nodes) {
    //   if (!node.IsEnded) {
    //     throw new InvalidParserStateException(`Parser states did not end '{node}' node`);
    //   }
    // }

    return [document, this.context.Diagnostics];
  }
  protected push(c: string): void {
    let done = false;
    do {
      for (let loopLimit = 0; loopLimit < XmlTreeParser.REPLAY_LIMIT_PER_CHARACTER; loopLimit++) {
        const replayCharacter = Ref.wrap(false);
        const nextState = this.context.CurrentState.pushChar(c, this.context, replayCharacter, false);

        if (nextState === this.context.CurrentState) {
          this.context.pulseParsingState();
          done = true;
          break;
        }

        // state changed
        this.context.PreviousState = this.context.CurrentState;
        this.context.CurrentState = nextState;
        this.context.StateTag = 0;

        this.context.KeywordBuilder.clear();
        this.context.resetParsingState();

        if (!replayCharacter.Value) {
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
  protected reset(): void {
    this.context.CurrentState = this.rootState;
    this.context.PreviousState = this.rootState;
    this.context.Nodes.clear();
    this.context.Nodes.push(this.rootState.createDocument());
  }
}
