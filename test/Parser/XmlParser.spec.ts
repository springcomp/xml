import { describe, it, expect } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState.js';
import { XElement } from '../../src/Dom/XElement.js';
import { XmlParser } from './XmlParser.js';

describe('XmlParser', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it('should parse self-closing single-element XML document', () => {
    const parser = new XmlParser(createRootState());
    const [document, _] = parser.parseXml('<root/>');
    parser.assertDiagnosticCount(0);
    expect(document?.FirstChild?.as(XElement)).not.toBeNull();
  });
});
