import { XNode } from './XNode.js';

export abstract class XContainer extends XNode {
  private firstChild: XNode | null = null;
  private lastChild: XNode | null = null;
  addChildNode(newChild: XNode) {
    newChild.Parent = this;
    if (this.lastChild != null) {
      this.lastChild.NextSibling = newChild;
    }
    if (this.firstChild == null) {
      this.firstChild = newChild;
    }
    this.lastChild = newChild;
  }
  get FirstChild(): XNode | null {
    return this.firstChild;
  }
  set FirstChild(node: XNode) {
    this.firstChild = node;
  }
  get LastChild(): XNode | null {
    return this.lastChild;
  }
  set LastChild(node: XNode) {
    this.lastChild = node;
  }
}
