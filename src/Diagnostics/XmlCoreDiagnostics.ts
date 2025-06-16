import { XmlDiagnosticDescriptor } from './XmlDiagnosticDescriptor.js';
import { XmlDiagnosticSeverity } from './XmlDiagnosticSeverity.js';

export class XmlCoreDiagnostics {
  public static readonly UnnamedTag = new XmlDiagnosticDescriptor(
    'UnnamedTag',
    'Unnamed tag',
    XmlDiagnosticSeverity.Error,
    'The tag ended without a name.',
  );
  public static InvalidNameCharacter = new XmlDiagnosticDescriptor(
    'InvalidNameCharacter',
    'Name has invalid character',
    XmlDiagnosticSeverity.Error,
    "Name was ended by invalid name character '{0}'",
  );
}
