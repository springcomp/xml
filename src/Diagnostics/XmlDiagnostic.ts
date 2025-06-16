import { TextSpan } from '../Dom/TextSpan';
import { XmlDiagnosticDescriptor } from './XmlDiagnosticDescriptor';

export class XmlDiagnostic {
  private descriptor: XmlDiagnosticDescriptor;
  private span: TextSpan;
  constructor(descriptor: XmlDiagnosticDescriptor, span: TextSpan) {
    this.descriptor = descriptor;
    this.span = span;
  }
  public get Span(): TextSpan {
    return this.span;
  }
  public GetFormattedMessage(): string {
    return this.descriptor.Title;
  }
}
