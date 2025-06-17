import { describe, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { XmlParser } from './XmlParser';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics';

describe('XmlClosingState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it.each(['<root></root>'])('should parse simple XML element', xml => {
    const parser = new XmlParser(createRootState());
    parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
  });
  it('should report invalid closing tag error', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<root></ root>');
    parser.assertDiagnostics([XmlCoreDiagnostics.MalformedTagClosing, 8, 0]);
  });
});
