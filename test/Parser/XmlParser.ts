import { XmlDiagnostic } from '../../src/Diagnostics/XmlDiagnostic';
import { XmlDiagnosticDescriptor } from '../../src/Diagnostics/XmlDiagnosticDescriptor';
import { TextSpan } from '../../src/Dom/TextSpan';
import { ParseResult, XmlTreeParser } from '../../src/Parser/XmlParser';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { expect } from 'vitest';
import { StringBuilder } from '../../src/Utils/StringBuilder';
import { XmlDiagnosticSeverity } from '../../src/Diagnostics/XmlDiagnosticSeverity';

export type XmlAssert = (parser: XmlParser) => void;

export class XmlParser extends XmlTreeParser {
  private trigger = '$';
  constructor(rootState?: XmlRootState) {
    super(rootState);
  }
  public parseXml(xml: string, ...asserts: XmlAssert[]): ParseResult {
    this.reset();
    const context = this.getContext();
    expect(context.Position).toBe(0);

    let assertNo = 0;

    const chars = xml.split('');
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (ch == this.trigger) {
        asserts[assertNo++](this);
      }
      this.push(ch);
    }

    expect(assertNo).toBe(asserts.length);
    return this.endAllNodes();
  }

  public assertDiagnosticCount(count: number, filter?: (diag: XmlDiagnostic) => boolean) {
    const diags = this.getContext().Diagnostics;
    XmlAssertions.assertDiagnosticCount(diags, count, filter);
  }
  public assertDiagnostics(...expectedDiags: [desc: XmlDiagnosticDescriptor, start: number, length: number][]) {
    const diags = this.getContext().Diagnostics;
    XmlAssertions.assertDiagnostics(diags, expectedDiags);
  }
  public assertStateIs(stateName: string) {
    const currentState = this.getContext().CurrentState;
    expect(currentState.Name).toBe(stateName);
  }
}
export class XmlAssertions {
  public static assertDiagnosticCount(
    diags: XmlDiagnostic[],
    count: number,
    filter?: (diag: XmlDiagnostic) => boolean,
  ) {
    const diagnostics = diags.filter(filter ?? (_ => true));
    if (diagnostics.length !== count) {
      const builder = new StringBuilder();
      builder.appendLine(`Expected ${count} diagnostics, got ${diagnostics.length}`);
      diagnostics.forEach(diag =>
        builder.appendLine(
          `${XmlDiagnosticSeverity[diag.Descriptor.Severity]}@${diag.Span}: ${diag.getFormattedMessage()}`,
        ),
      );
      expect.fail(builder.toString());
    }
  }
  public static assertDiagnostics(
    diags: XmlDiagnostic[],
    expectedDiags: [desc: XmlDiagnosticDescriptor, start: number, length: number][],
  ) {
    const expected: [XmlDiagnosticDescriptor, TextSpan][] = expectedDiags.map(item => {
      const [diag, start, length] = item;
      return [diag, new TextSpan(start, length)];
    });
    const actual: [XmlDiagnosticDescriptor, TextSpan][] = diags.map(item => [item.Descriptor, item.Span]);

    const missing = expected.filter(x => !actual.some(a => a[1].equals(x[1]) && a[0].equals(x[0])));
    const unexpected = actual.filter(x => !expected.some(a => a[1].equals(x[1]) && a[0].equals(x[0])));

    const builder = new StringBuilder();
    if (missing.length != 0) {
      builder.appendLine('Missing diagnostics:');
    }
    missing.forEach(item => {
      const [descriptor, span] = item;
      builder.appendLine(`  ${descriptor.Id}@${span.Start}+${span.Length}`);
    });
    if (unexpected.length != 0) {
      builder.appendLine('Unexpected diagnostics:');
    }
    unexpected.forEach(item => {
      const [descriptor, span] = item;
      builder.appendLine(`  ${descriptor.Id}@${span.Start}+${span.Length}`);
    });

    if (builder.byteLength != 0) {
      expect.fail(builder.toString());
    }
  }
}
