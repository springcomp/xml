import { describe, expect, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { XmlParser } from './XmlParser';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics';
import { XElement } from '../../src/Dom/XElement';
import { XmlTagState } from '../../src/Parser/XmlTagState';

describe('XmlNameState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it('should parse simple name', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<root /$>', p => {
      p.assertStateIs(XmlTagState.StateName);
      const object = p.assertPeek(1).as(XElement);
      expect(object).not.toBeNull();
      expect(object?.Name.HasPrefix).toBeFalsy();
      expect(object?.Name.Name).toBe('root');
    });
  });
  it('should parse prefixed name', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<ns:root /$>', p => {
      p.assertStateIs(XmlTagState.StateName);
      const object = p.assertPeek(1).as(XElement);
      expect(object).not.toBeNull();
      expect(object?.Name.Prefix).toBe('ns');
      expect(object?.Name.Name).toBe('root');
    });
  });
  it('should report error for empty prefix', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<:root />');
    parser.assertDiagnostics([XmlCoreDiagnostics.ZeroLengthNamespace, 6, 0]);
  });
  it('should report error for empty local name', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<ns: />');
    parser.assertDiagnostics([XmlCoreDiagnostics.ZeroLengthNameWithNamespace, 4, 0]);
  });
  it('should report error for multiple colons', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<n:s:root />');
    parser.assertDiagnostics([XmlCoreDiagnostics.MultipleNamespaceSeparators, 4, 0]);
  });
  it('<roo| /> should report invalid name chararacter error', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<roo| />');
    parser.assertDiagnostics(
      [XmlCoreDiagnostics.InvalidNameCharacter, 4, 0],
      [XmlCoreDiagnostics.MalformedTag, 4, 0],
      [XmlCoreDiagnostics.UnnamedTag, 0, 7],
    );
  });
});
