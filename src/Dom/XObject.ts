import { asType, isType } from '../Utils/TypeHelpers.js';
import { TextSpan } from './TextSpan.js';

export abstract class XObject {
  private parent: XObject | null = null;
  private textSpan: TextSpan;
  constructor(span: number | TextSpan) {
    if (typeof span === 'number') {
      this.textSpan = new TextSpan(<number>span);
    } else {
      this.textSpan = <TextSpan>span;
    }
  }
  /**
   * casts as an instance of the specified type
   * or returns null.
   * @param ctor
   * @returns
   */
  // biome-ignore lint: lint/suspicious/noExplicitAny
  as<T>(ctor: new (...args: any[]) => T): T | null {
    return asType<T>(this, ctor);
  }
  // biome-ignore lint: lint/suspicious/noExplicitAny
  is<T>(ctor: new (...args: any[]) => T): boolean {
    return isType<T>(this, ctor);
  }
  end(offset: number): void {
    this.textSpan = TextSpan.fromBounds(this.Span.Start, offset);
  }
  /**
   * return whether this node is complete.
   * will be false if it was ended prematurely
   * due to an error or EOF.
   */
  get IsComplete(): boolean {
    return this.IsEnded;
  }
  /**
   * return whether this node is fully parsed (i.e. has an end position)
   */
  get IsEnded(): boolean {
    return this.textSpan.Length != 0;
  }
  get Parent(): XObject | null {
    return this.parent;
  }
  set Parent(parent: XObject | null) {
    this.parent = parent ?? null;
  }
  get Span(): TextSpan {
    return this.textSpan;
  }
}
