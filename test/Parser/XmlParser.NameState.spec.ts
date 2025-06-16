import { describe, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { XmlParser } from './XmlParser';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics';

describe('XmlNameState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
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
