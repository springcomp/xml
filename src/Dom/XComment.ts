import { TextSpan } from './TextSpan.js';
import { XNode } from './XNode.js';

export class XComment extends XNode {
  private rawText: string;
  constructor(span: number | TextSpan, comment?: string) {
    super(span);
    this.rawText = comment ?? '';
  }
  public get RawText(): string {
    return this.rawText;
  }
}
