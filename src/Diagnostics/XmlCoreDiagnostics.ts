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

  public static MalformedTagOpening = new XmlDiagnosticDescriptor(
    'MalformedTagOpening',
    'Malformed tag',
    XmlDiagnosticSeverity.Error,
    "Tag is malformed due to unexpected character '{0}'.",
  );
  public static MalformedTagClosing = new XmlDiagnosticDescriptor(
    'MalformedTagClosing',
    'Malformed closing tag',
    XmlDiagnosticSeverity.Error,
    "Closing tag is malformed due to unexpected character '{0}'.",
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

  public static UnclosedTag = new XmlDiagnosticDescriptor(
    'UnclosedTag',
    'Unclosed tag',
    XmlDiagnosticSeverity.Error,
    "The tag '{0}' has no matching closing tag",
  );

  public static UnmatchedClosingTag = new XmlDiagnosticDescriptor(
    'UnmatchedClosingTag',
    'Unmatched closing tag',
    XmlDiagnosticSeverity.Error,
    "The closing tag '{0}' does not match any open tag",
  );

  public static IncompleteClosingTag = new XmlDiagnosticDescriptor(
    'IncompleteClosingTag',
    'Incomplete closing tag',
    XmlDiagnosticSeverity.Error,
    "Closing tag is incomplete due to unexpected character '{0}'",
  );

  public static UnnamedClosingTag = new XmlDiagnosticDescriptor(
    'UnnamedClosingTag',
    'Unnamed closing tag',
    XmlDiagnosticSeverity.Error,
    'The closing tag ended without a name',
  );
}
