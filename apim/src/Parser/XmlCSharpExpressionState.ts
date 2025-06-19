import { Ref, Stack } from "@springcomp/xml-core/Utils";
import type { XmlParserContext } from "@springcomp/xml-core/Parser";
import { XmlParserState } from "@springcomp/xml-core/Parser";
import { XCSharpExpression } from "../Dom/XCSharpExpression.js";
import { XmlCoreDiagnostics } from "../Diagnostics/XmlCoreDiagnostics.js";

export class XmlCSharpExpressionState extends XmlParserState {
	public static readonly StateName = "XmlCSharpExpressionState";
	private static ESCAPED_CHARS = ["\\", '"', "t", "r", "n"];
	private unmatchedQuotes = new Stack<number>();
	private unmatchedParens = new Stack<number>();
	private unmatchedBraces = new Stack<number>();
	private states = new Stack<CSharpCodeState>();
	protected onChar(
		c: string,
		context: XmlParserContext,
		_replayCharacter: Ref<boolean>,
		isEndOfFile: boolean,
	): XmlParserState | null {
		if (context.enteringParsingState()) {
			const statement = new XCSharpExpression(context.Position);
			context.Nodes.push(statement);
			context.StateTag = CSharpCodeState.FREE;
		}
		if (isEndOfFile) {
			// the parent state should report the error
			return this.end(context, isEndOfFile);
		}
		switch (context.StateTag) {
			case CSharpCodeState.FREE:
				if (c === '"') {
					this.states.push(context.StateTag);
					this.unmatchedQuotes.push(context.Position);
					context.StateTag = CSharpCodeState.MATCH_QUOTE;
				}
				if (c === "(") {
					this.states.push(context.StateTag);
					this.unmatchedParens.push(context.Position);
					context.StateTag = CSharpCodeState.MATCH_PARENS;
				}
				if (c === "{") {
					this.states.push(context.StateTag);
					this.unmatchedBraces.push(context.Position);
					context.StateTag = CSharpCodeState.MATCH_BRACES;
				}
				if (c === ")") {
					if (this.unmatchedParens.count() > 0) {
						this.unmatchedParens.pop();
						context.StateTag = this.states.pop();
					} else {
						return this.end(context);
					}
				}
				if (c === "}") {
					if (this.unmatchedBraces.count() > 0) {
						this.unmatchedBraces.pop();
						context.StateTag = this.states.pop();
					} else {
						return this.end(context);
					}
				}
				break;
			case CSharpCodeState.MATCH_QUOTE:
				if (c === "\\") {
					this.states.push(CSharpCodeState.ESCPAPE);
				}
				if (c === '"') {
					this.unmatchedQuotes.pop();
					context.StateTag = this.states.pop();
				}
				break;
			case CSharpCodeState.ESCPAPE:
				if (XmlCSharpExpressionState.ESCAPED_CHARS.includes(c)) {
					// TODO: error
					// TODO: \uXXXX unicode
					// TODO: \xXXXX
					context.StateTag = this.states.pop();
				}
				break;
		}

		context.KeywordBuilder.append(c);
		return this;
	}
	private end(
		context: XmlParserContext,
		isEndOfFile?: boolean,
	): XmlParserState {
		const rawText = context.KeywordBuilder.toString();
		const code = rawText.trim();
		const statement = context.Nodes.pop().as(XCSharpExpression);
		statement.end(statement.Span.Start + rawText.length);
		context.Nodes.push(new XCSharpExpression(statement.Span, code));
		if (isEndOfFile ?? false) {
			context.addDiagnostic(XmlCoreDiagnostics.IncompleteCSharpExpressionEof);
		}
		if (code.length === 0) {
			context.addDiagnostic(XmlCoreDiagnostics.EmptyCSharpExpression);
		}
		return this.Parent;
	}
}
enum CSharpCodeState {
	FREE = 0,
	MATCH_QUOTE = 1,
	MATCH_PARENS = 2,
	MATCH_BRACES = 3,
	ESCPAPE = 4,
}
