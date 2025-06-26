import { INamedXObject } from './INamedXObject.js';
import { TextSpan } from './TextSpan.js';
import { XName } from './XName.js';
import { XNode } from './XNode.js';

export class XAttribute extends XNode implements INamedXObject {
  private name: XName;
  private value: string;
  constructor(span: number | TextSpan, name?: XName, value?: string) {
    super(span);
    this.name = name ?? XName.Empty;
    this.value = value ?? '';
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
  get Value(): string {
    return this.value;
  }
  set Value(value: string) {
    this.value = value;
  }
}
