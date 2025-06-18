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
    expect(document?.FirstChild?.as(XElement)).not.toBeNull();
  });
  it.each(['<a><b/></a>', '<a><b></b></a>'])('should parse simple matching tags document', xml => {
    const parser = new XmlParser(createRootState());
    const [document, _] = parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
    expect(document?.FirstChild?.as(XElement).Name.Name).toBe('a');
    expect(document?.FirstChild?.as(XElement)?.FirstChild?.as(XElement).Name.Name).toBe('b');
  });
  it.each(['<a><b>text</b></a>', '<a><b>text</b><c/></a>'])('should parse simple XML document', xml => {
    const parser = new XmlParser(createRootState());
    const [document, _] = parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
    expect(document?.FirstChild?.as(XElement).Name.Name).toBe('a');
    expect(document?.FirstChild?.as(XElement)?.FirstChild?.as(XElement).Name.Name).toBe('b');
  });
  it.each(['<!-- comment --><r />', '<a><!-- comment --></a>'])('should parse document with comments', xml => {
    const parser = new XmlParser(createRootState());
    const [_, __] = parser.parseXml(xml);
    parser.assertDiagnosticCount(0);
  });
});
