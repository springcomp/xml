import { XContainer } from './XContainer.js';
import { XElement } from './XElement.js';
import { XNode } from './XNode.js';

export class XDocument extends XContainer {
  private rootElement: XElement | null = null;
  constructor() {
    super(0);
  }
  public get RootElement(): XElement | null {
    return this.rootElement;
  }
  public addChildNode(newChild: XNode): void {
    if (this.rootElement === null && newChild.is(XElement)) {
      this.rootElement = newChild.as(XElement);
    }
    super.addChildNode(newChild);
  }
}
