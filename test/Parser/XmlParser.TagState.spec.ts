import { describe, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { XmlParser } from './XmlParser';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics';

describe('XmlTagState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it('< root/> should report malformed opening tag error', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('< root />');
    parser.assertDiagnostics([XmlCoreDiagnostics.MalformedTagOpening, 1, 0]);
  });
  it('<root/ > should report malformed self-closing tag error', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<root/ >');
    parser.assertDiagnostics([XmlCoreDiagnostics.MalformedSelfClosingTag, 6, 0]);
  });
  it('< /> should report unnamed tag error', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('< />');
    parser.assertDiagnostics([XmlCoreDiagnostics.MalformedTagOpening, 1, 0], [XmlCoreDiagnostics.UnnamedTag, 0, 3]);
  });
});
