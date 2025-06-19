import { INamedXObject } from './INamedXObject.js';
import { XName } from './XName.js';
import { XNode } from './XNode.js';

export class XClosingTag extends XNode implements INamedXObject {
  private name: XName;
  constructor(position: number, name?: XName) {
    super(position);
    this.name = name ?? XName.Empty;
  }
  get IsComplete(): boolean {
    return super.IsComplete && this.IsNamed;
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
}
