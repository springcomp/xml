import { describe, it } from 'vitest';
import { XmlRootState } from '../../src/Parser/XmlRootState';
import { XmlParser } from './XmlParser';
import { XmlCoreDiagnostics } from '../../src/Diagnostics/XmlCoreDiagnostics';

describe('XmlTagState', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it('< /> should report unnamed tag error', () => {
    const parser = new XmlParser(createRootState());
    parser.parseXml('< />');
    parser.assertDiagnostics([XmlCoreDiagnostics.UnnamedTag, 0, 3]);
  });
});
