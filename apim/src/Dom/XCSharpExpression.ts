import { TextSpan, XNode } from "@springcomp/xml-core/Dom";

export class XCSharpExpression extends XNode {
	private code: string;
	constructor(span: number | TextSpan, code?: string) {
		super(span);
		this.code = code ?? "";
	}
	public get Code(): string {
		return this.code;
	}
}
