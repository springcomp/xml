import { INamedXObject } from './INamedXObject.js';
import { XContainer } from './XContainer.js';
import { XName } from './XName.js';
import { XNode } from './XNode.js';

export class XElement extends XContainer implements INamedXObject {
  private closingTag: XNode | null = null;
  private hasEndBracket = false;
  private name: XName;
  constructor(position: number, name?: XName) {
    super(position);
    this.name = name ?? XName.Empty;
  }
  close(node: XNode): void {
    this.closingTag = node;
    // if this.closingTag is XClosingTag
    //   this.closingTag.Parent = this.Parent;
  }
  get ClosingTag(): XNode | null {
    return this.closingTag;
  }
  get IsClosed(): boolean {
    return this.closingTag !== null;
  }
  get IsEnded(): boolean {
    return this.hasEndBracket && this.IsNamed;
  }
  get IsNamed(): boolean {
    return this.name.isValid;
  }
  get IsSelfClosing(): boolean {
    return this.closingTag === this;
  }
  get HasEndBracket(): boolean {
    return this.hasEndBracket;
  }
  set HasEndBracket(has: boolean) {
    this.hasEndBracket = has;
  }
  get Name(): XName {
    return this.name;
  }
  set Name(name: XName) {
    this.name = name;
  }
}
