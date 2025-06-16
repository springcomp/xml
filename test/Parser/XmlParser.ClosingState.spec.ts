import { describe, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { XmlParser } from './XmlParser';

describe('XmlClosingState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it.each(['<root></root>', '<root></ root>'])('should parse simple XML element', xml => {
    const parser = new XmlParser(createRootState());
    parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
  });
  it('should fail to parse a invalid closing tag', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<root></ root>');
    parser.assertDiagnosticCount(1);
  });
});
