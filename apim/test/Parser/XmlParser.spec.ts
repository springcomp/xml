import { describe, it } from 'vitest';
import { XmlRootState, XmlTreeParser } from '@springcomp/xml-core/Parser/index.js';
import { XmlPolicyRootState } from '../../src/Parser/XmlPolicyRootState.js';

describe('XmlParser', () => {
  function createRootState(): XmlRootState {
    return new XmlPolicyRootState();
  }
  it('@(…) should parse simple look-alike XML policies', () => {
    const parser = new XmlTreeParser(createRootState());
    parser.parse('<policies>@( "hello, world" )</policies>');
    // TODO parser.assertDiagnosticCount(0);
  });
  it('@{…} should parse simple look-alike XML policies', () => {
    const parser = new XmlTreeParser(createRootState());
    parser.parse('<policies>@{ return "hello, world"; }</policies>');
    // TODO parser.assertDiagnosticCount(0);
  });
});
