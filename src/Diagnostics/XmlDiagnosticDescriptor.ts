import { XmlDiagnosticSeverity } from './XmlDiagnosticSeverity';

export class XmlDiagnosticDescriptor {
  private message?: string | null;
  private id: string;
  private severity: XmlDiagnosticSeverity;
  private title: string;
  constructor(id: string, title: string, severity: XmlDiagnosticSeverity, message?: string) {
    this.id = id;
    this.title = title;
    this.severity = severity;
    this.message = message ?? null;
  }
  get Id(): string {
    return this.id;
  }
  get Severity(): XmlDiagnosticSeverity {
    return this.severity;
  }
  get Title(): string {
    return this.title;
  }
}
