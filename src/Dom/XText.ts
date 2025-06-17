import { TextSpan } from './TextSpan.js';
import { XNode } from './XNode.js';

export class XText extends XNode {
  private text: string;
  constructor(span: number | TextSpan, text?: string) {
    super(span);
    this.text = text ?? '';
  }
  public get Text(): string {
    return this.text;
  }
}
