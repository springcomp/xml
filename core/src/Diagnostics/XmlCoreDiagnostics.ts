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

  public static IncompleteAttributeValue = new XmlDiagnosticDescriptor(
    'IncompleteAttributeValue',
    'Incomplete attribute value',
    XmlDiagnosticSeverity.Error,
    "The value of attribute '{0}' ended unexpectedly due to character '{1}'.",
  );

  public static UnquotedAttributeValue = new XmlDiagnosticDescriptor(
    'UnquotedAttributeValue',
    'Unquoted attribute value',
    XmlDiagnosticSeverity.Error,
    "The value of attribute '{0}' is not contained within quote markers.",
  );

  public static DuplicateAttributeName = new XmlDiagnosticDescriptor(
    'DuplicateAttributeName',
    'Duplicate attribute name',
    XmlDiagnosticSeverity.Error,
    "Element has more than one attribute named '{0}'.",
  );

  public static IncompleteAttribute = new XmlDiagnosticDescriptor(
    'IncompleteAttribute',
    'Incomplete attribute',
    XmlDiagnosticSeverity.Error,
    "Attribute is incomplete due to unexpected character '{0}'.",
  );

  public static IncompleteEndComment = new XmlDiagnosticDescriptor(
    'IncompleteEndComment',
    'Incomplete end comment',
    XmlDiagnosticSeverity.Error,
    "The string '--' must not appear in comments except when ending the comment with '-->'.",
  );

  public static IncompleteAttributeEof = new XmlDiagnosticDescriptor(
    'IncompleteAttributeEof',
    'Incomplete attribute',
    XmlDiagnosticSeverity.Error,
    'Incomplete attribute due to unexpected end of file',
  );
  public static IncompleteCommentEof = new XmlDiagnosticDescriptor(
    'IncompleteCommentEof',
    'Incomplete comment',
    XmlDiagnosticSeverity.Error,
    'Incomplete comment due to unexpected end of file',
  );
  public static IncompleteTagEof = new XmlDiagnosticDescriptor(
    'IncompleteTagEof',
    'Incomplete tag',
    XmlDiagnosticSeverity.Error,
    'Incomplete tag due to unexpected end of file',
  );
}
