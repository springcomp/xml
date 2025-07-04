import { XmlParserContext } from './XmlParserContext.js';
import { Ref } from '../Utils/Ref.js';

export abstract class XmlParserState {
  private name: string;
  private parent: XmlParserState | null = null;
  protected constructor(stateName: string) {
    this.name = stateName;
  }
  public get Name(): string {
    return this.name;
  }
  public get Parent(): XmlParserState {
    // biome-ignore lint: lint/style/noNonNullAssertion
    return this.parent!;
  }
  public Adopt<TChild extends XmlParserState>(child: TChild): TChild {
    if (child.Parent !== null) {
      throw new Error(
        `Cannot adopt child state '${child.Name}' because it already has a parent '${child.Parent.Name}'.`,
      );
    }
    child.parent = this;
    return child;
  }
  public pushChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState | null {
    //console.log(`${this.name}.pushChar: ${c} at position ${context.Position}; StateTag: ${context.StateTag}`);
    const nextState = this.onChar(c, context, replayCharacter, isEndOfFile);
    //if (nextState !== context.CurrentState) {
    //  console.log('STATE CHANGED');
    //}
    return nextState;
  }
  protected abstract onChar(
    _c: string,
    _context: XmlParserContext,
    _replayCharacter: Ref<boolean>,
    _isEndOfFile: boolean,
  ): XmlParserState | null;
}
