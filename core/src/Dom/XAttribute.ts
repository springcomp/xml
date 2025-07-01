import { INamedXObject } from './INamedXObject.js';
import { TextSpan } from './TextSpan.js';
import { XName } from './XName.js';
import { XNode } from './XNode.js';

export class XAttribute extends XNode implements INamedXObject {
  private name: XName;
  private value: string | null = null;
  private valueOffset: number | null = null;
  constructor(span: number | TextSpan, name?: XName) {
    super(span);
    this.name = name ?? XName.Empty;
  }
  get IsComplete(): boolean {
    return this.IsEnded && this.IsNamed;
  }
  get IsNamed(): boolean {
    return this.name.IsValid;
  }
  get Name(): XName {
    return this.name;
  }
  set Name(name: XName) {
    this.name = name;
  }
  get Value(): string | null {
    return this.value;
  }
  get ValueOffset(): number | null {
    return this.valueOffset;
  }
  setValue(offset: number, value: string) {
    this.valueOffset = offset;
    this.value = value;
  }
}
