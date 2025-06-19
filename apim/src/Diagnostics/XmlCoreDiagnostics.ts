import { XmlDiagnosticDescriptor, XmlDiagnosticSeverity } from '@springcomp/xml-core/Diagnostics';

export class XmlCoreDiagnostics {
  public static EmptyCSharpExpression = new XmlDiagnosticDescriptor(
    'EmptyCSharpExpression',
    'Empty C# expression',
    XmlDiagnosticSeverity.Error,
    'C# expression is invalid',
  );

  public static IncompleteCSharpExpressionEof = new XmlDiagnosticDescriptor(
    'IncompleteCSharpExpressionEof',
    'Incomplete C# expression',
    XmlDiagnosticSeverity.Error,
    'Incomplete C# expression due to unexpected end of file',
  );
}
