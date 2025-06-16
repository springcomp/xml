import { XmlDiagnosticDescriptor } from './XmlDiagnosticDescriptor.js';
import { XmlDiagnosticSeverity } from './XmlDiagnosticSeverity.js';

export class XmlCoreDiagnostics {
  public static readonly UnnamedTag = new XmlDiagnosticDescriptor(
    'UnnamedTag',
    'Unnamed tag',
    XmlDiagnosticSeverity.Error,
    'The tag ended without a name.',
  );
  public static ZeroLengthNamespace = new XmlDiagnosticDescriptor(
    'ZeroLengthNamespace',
    'Zero-length namespace',
    XmlDiagnosticSeverity.Error,
  );
  public static ZeroLengthNameWithNamespace = new XmlDiagnosticDescriptor(
    'ZeroLengthNameWithNamespace',
    'Zero-length name with non-empty namespace.',
    XmlDiagnosticSeverity.Error,
  );
  public static MultipleNamespaceSeparators = new XmlDiagnosticDescriptor(
    'MultipleNamespaceSeparators',
    'Name has multiple namespace separators',
    XmlDiagnosticSeverity.Error,
  );
  public static InvalidNameCharacter = new XmlDiagnosticDescriptor(
    'InvalidNameCharacter',
    'Name has invalid character',
    XmlDiagnosticSeverity.Error,
    "Name was ended by invalid name character '{0}'",
  );

  public static MalformedTag = new XmlDiagnosticDescriptor(
    'MalformedTag',
    'Malformed tag',
    XmlDiagnosticSeverity.Error,
    "Tag is malformed due to unexpected character '{0}'.",
  );
  public static MalformedSelfClosingTag = new XmlDiagnosticDescriptor(
    'MalformedSelfClosingTag',
    'Malformed tag',
    XmlDiagnosticSeverity.Error,
    "Self-closing tag is malformed due to unexpected character '{0}' after the forward slash.",
  );
}
