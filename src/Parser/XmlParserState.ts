import { XmlParserContext } from './XmlParserContext';

export abstract class XmlParserState {
  private name: string;
  private parent: XmlParserState | null = null;
  protected constructor(name: string) {
    this.name = name;
  }
  public get Name(): string {
    return this.name;
  }
  public get Parent(): XmlParserState | null {
    return this.parent;
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
  public pushChar(c: string, context: XmlParserContext): XmlParserState {
    console.log(`${this.name}.pushChar: ${c} at position ${context.Position}; StateTag: ${context.StateTag}`);
    const nextState = this.onChar(c, context);
    if (nextState !== context.CurrentState) {
      console.log('STATE CHANGED');
    }
    return nextState;
  }
  protected abstract onChar(c: string, context: XmlParserContext): XmlParserState;
}
export class NullParserState extends XmlParserState {
  /**
   * Singleton instance of NullParserState.
   */
  public static readonly Instance = new NullParserState();

  private constructor() {
    super('null');
  }

  public onChar(_: string, _context: XmlParserContext): XmlParserState {
    throw new Error('Application Error: NullParserState cannot process characters');
  }
}
