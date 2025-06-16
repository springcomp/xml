import { XmlDiagnosticDescriptor } from './XmlDiagnosticDescriptor';
import { XmlDiagnosticSeverity } from './XmlDiagnosticSeverity';

export class XmlCoreDiagnostics {
  public static readonly UnnamedTag = new XmlDiagnosticDescriptor(
    'UnnamedTag',
    'Unnamed tag',
    XmlDiagnosticSeverity.Error,
    'The tag ended without a name.',
  );
}
