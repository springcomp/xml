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
  public abstract pushChar(c: string, context: XmlParserContext): XmlParserState;
}
export class NullParserState extends XmlParserState {
  /**
   * Singleton instance of NullParserState.
   */
  public static readonly Instance = new NullParserState();

  private constructor() {
    super('null');
  }

  public pushChar(_: string, _context: XmlParserContext): XmlParserState {
    throw new Error('Application Error: NullParserState cannot process characters');
  }
}
