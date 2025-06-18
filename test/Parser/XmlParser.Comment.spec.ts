import { describe, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState.js';
import { XmlParser } from './XmlParser.js';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics.js';

describe('XmlCommentState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it("should report invalid '--' sequence in comment", () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('<!-- -- --><r />');
    parser.assertDiagnostics([XmlCoreDiagnostics.IncompleteEndComment, 7, 0]);
  });
  it.each([
    ['<r/><!-- --', 12, 0],
    ['<r/><!-- -', 11, 0],
    ['<r/><!-- ', 10, 0],
    ['<r/><!--', 9, 0],
  ])('should report incomplete end comment due to EOF', (xml, start, end) => {
    const parser = new XmlParser(createRootState());
    parser.parseXml(xml);
    parser.assertDiagnostics([XmlCoreDiagnostics.IncompleteCommentEof, start, end]);
  });
});
