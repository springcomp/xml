import { describe, it, expect } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState.js';
import { XElement } from '../../src/Dom/XElement.js';
import { XmlParser } from './XmlParser.js';

describe('XmlParser', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it.each(['<root/>', '<root />'])('should parse self-closing single-element XML document', xml => {
    const parser = new XmlParser(createRootState());
    const [document, _] = parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
    expect(document?.RootElement).not.toBeNull();
  });
  it.each(['<a><b/></a>', '<a><b></b></a>'])('should parse simple matching tags document', xml => {
    const parser = new XmlParser(createRootState());
    const [document, _] = parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
    expect(document?.RootElement?.Name.Name).toBe('a');
    expect(document?.RootElement?.FirstChild?.as(XElement).Name.Name).toBe('b');
  });
  it.each(['<a><b>text</b></a>', '<a><b>text</b><c/></a>'])('should parse simple XML document', xml => {
    const parser = new XmlParser(createRootState());
    const [document, _] = parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
    expect(document?.RootElement?.Name.Name).toBe('a');
    expect(document?.RootElement?.FirstChild?.as(XElement).Name.Name).toBe('b');
  });
  it.each(['<!-- comment --><r />', '<a><!-- comment --></a>'])('should parse document with comments', xml => {
    const parser = new XmlParser(createRootState());
    parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
    // TODO: find comment by looking into nodes
  });
  it('should parse simple XML document with attributes', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<r a="v" b="w" />');
    parser.assertDiagnosticCount(0);
    // TODO: find attributes by looking into nodes
  });
});
