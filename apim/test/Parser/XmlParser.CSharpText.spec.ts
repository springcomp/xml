import { describe, it } from 'vitest';
import { XmlPolicyRootState } from '../../src/Parser/XmlPolicyRootState.js';
import { XmlRootState } from '@springcomp/xml-core/Parser/index.js';

describe('XmlCSharpExpressionState', () => {
  function createRootState(): XmlRootState {
    return new XmlPolicyRootState();
  }
  it('should handle surrounding whitespaces', () => {
    // TODO
    createRootState();
    const xml = ['<policies> @("")</policies>', '<policies>@("") </policies>'];
    console.log(xml);
  });
  it('should parse quoted strings', () => {
    // TODO
    createRootState();
  });
});
