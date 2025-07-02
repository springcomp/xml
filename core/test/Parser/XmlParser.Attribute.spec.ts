import { describe, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { XmlParser } from './XmlParser';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics';

describe('XmlAttributeState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it('should reflect attribute parser state', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml(
      '<r a$ttr=$"value$" />',
      p => p.assertStateIs('XmlNameState'),
      p => p.assertStateIs('XmlAttributeState'),
      p => p.assertStateIs('XmlAttributeValueState'),
    );
    parser.assertDiagnosticCount(0);
  });
  it('should fail on duplicate element attributes', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<r attr="value" attr="other" />');
    parser.assertDiagnostics([XmlCoreDiagnostics.DuplicateAttributeName, 16, 12]);
  });
  it('should report unquoted attribute', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<r attr=value />');
    parser.assertDiagnostics([XmlCoreDiagnostics.UnquotedAttributeValue, 8, 6]);
  });
});
