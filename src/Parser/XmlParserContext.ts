import { XmlDiagnostic } from '../Diagnostics/XmlDiagnostic.js';
import { XmlDiagnosticDescriptor } from '../Diagnostics/XmlDiagnosticDescriptor.js';
import { TextSpan } from '../Dom/TextSpan.js';
import { XObject } from '../Dom/XObject.js';
import { Stack } from '../Utils/Stack.js';
import { StringBuilder } from '../Utils/StringBuilder.js';
import { NullParserState, XmlParserState } from './XmlParserState.js';

export class XmlParserContext {
  private currentState: XmlParserState = NullParserState.Instance;
  private currentStateLength = 0;
  private diagnostics: XmlDiagnostic[] = [];
  private isAtEndOfFile = false;
  private readonly keywordBuilder = new StringBuilder();
  private position = 0;
  private previousState: XmlParserState = NullParserState.Instance;
  private readonly nodes = new Stack<XObject>();
  private stateTag = 0;
  public get CurrentState(): XmlParserState {
    return this.currentState;
  }
  public get Diagnostics(): XmlDiagnostic[] {
    return this.diagnostics;
  }
  public get IsAtEndOfFile(): boolean {
    return this.isAtEndOfFile;
  }
  public set IsAtEndOfFile(eof: boolean) {
    this.isAtEndOfFile = eof;
  }
  public get KeywordBuilder(): StringBuilder {
    return this.keywordBuilder;
  }
  public get Nodes(): Stack<XObject> {
    return this.nodes;
  }
  public get Position() {
    return this.position;
  }
  public get PreviousState(): XmlParserState {
    return this.previousState;
  }
  public set CurrentState(state: XmlParserState) {
    this.currentState = state;
  }
  public set Position(position: number) {
    this.position = position;
  }
  public set PreviousState(state: XmlParserState) {
    this.previousState = state;
  }
  public get StateTag(): number {
    return this.stateTag;
  }
  public set StateTag(tag: number) {
    this.stateTag = tag;
  }

  public addDiagnostic(descriptor: XmlDiagnosticDescriptor, positionOrSpan?: number | TextSpan, ...args: unknown[]) {
    if (positionOrSpan === undefined) {
      positionOrSpan = this.Position;
    }
    const span = typeof positionOrSpan === 'number' ? new TextSpan(<number>positionOrSpan) : <TextSpan>positionOrSpan;
    const diag = new XmlDiagnostic(descriptor, span, args);
    this.diagnostics.push(diag);
  }
  /**
   * Returns whether parsing is entering the current state
   * for the first time.
   * @returns true if this is the first time entering the state.
   */
  public enteringParsingState(): boolean {
    return this.currentStateLength === 0;
  }
  public pulseParsingState(): void {
    this.currentStateLength++;
  }
  public resetParsingState(): void {
    this.currentStateLength = 0;
  }
}
