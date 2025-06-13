import { XDocument } from '../Dom/XDocument.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';
import { XmlRootState } from './XmlRootState.js';

export class XmlTreeParser {
  private context = new XmlParserContext();
  private rootState: XmlParserState;
  constructor(rootState?: XmlRootState) {
    this.rootState = rootState ?? new XmlRootState();
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
      const nextState = this.context.CurrentState.pushChar(c, this.context);

      if (nextState === this.context.CurrentState) {
        done = true;
        break;
      }

      console.log('STATE CHANGED');
      // state changed
      this.context.PreviousState = this.context.CurrentState;
      this.context.CurrentState = nextState;

      done = true;
    } while (false);

    if (!done) {
      throw new Error(
        `Too many state changes for char '${c}'. Current state is '${this.context.CurrentState}' at position ${this.context.Position}.`,
      );
    }

    this.context.Position++;
  }
}
