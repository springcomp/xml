import { describe, it, expect } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState.js';
import { XElement } from '../../src/Dom/XElement.js';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics.js';
import { XmlParser } from './XmlParser.js';

describe('XmlParser', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it('should parse self-closing single-element XML document', () => {
    const parser = new XmlParser(createRootState());
    const [document, diagnostics] = parser.parseXml('<root />');
    expect(diagnostics).toHaveLength(0);
    expect(document?.FirstChild?.as(XElement)).not.toBeNull();
  });
  it('< /> should report unnamed tag error', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('< />');
    parser.assertDiagnostics([XmlCoreDiagnostics.UnnamedTag, 0, 3]);
  });
});
