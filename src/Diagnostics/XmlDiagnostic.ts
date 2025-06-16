import { TextSpan } from '../Dom/TextSpan';
import { XmlDiagnosticDescriptor } from './XmlDiagnosticDescriptor';

export class XmlDiagnostic {
  private descriptor: XmlDiagnosticDescriptor;
  private span: TextSpan;
  private args: unknown[];
  constructor(descriptor: XmlDiagnosticDescriptor, span: TextSpan, args?: unknown[]) {
    this.descriptor = descriptor;
    this.span = span;
    this.args = args ?? [];
  }
  public get Descriptor(): XmlDiagnosticDescriptor {
    return this.descriptor;
  }
  public get Span(): TextSpan {
    return this.span;
  }
  public getFormattedMessage(): string {
    return this.descriptor.getFormattedMessage(this.args);
  }
}
