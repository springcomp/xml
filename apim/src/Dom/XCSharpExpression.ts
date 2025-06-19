import { TextSpan, XNode } from '@springcomp/xml-core/Dom/index.js';

export class XCSharpExpression extends XNode {
  private code: string;
  private multiStatement: boolean;
  constructor(span: number | TextSpan, code?: string, multiStatement?: boolean) {
    super(span);
    this.code = code ?? '';
    this.multiStatement = multiStatement ?? false;
  }
  public get Code(): string {
    return this.code;
  }
  public get IsMultiStatementExpression(): boolean {
    return this.multiStatement;
  }
}
