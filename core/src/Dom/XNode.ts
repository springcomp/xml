import { XObject } from './XObject.js';

export abstract class XNode extends XObject {
  private nextSibling: XNode | null = null;
  get NextSibling(): XNode | null {
    return this.nextSibling;
  }
  set NextSibling(node: XNode) {
    this.nextSibling = node;
  }
}
