import { describe, it } from 'vitest';
import { XmlRootState, XmlTreeParser } from '@springcomp/xml-core/Parser';

describe('XmlParser', () => {
  function createRootState(): XmlRootState {
    return new XmlRootState();
  }
  it('@(…) should parse simple look-alike XML policies', () => {
    const parser = new XmlTreeParser(createRootState());
    parser.parse('<policies>$( "hello, world" )</policies>');
  });
  it('@{…} should parse simple look-alike XML policies', () => {
    const parser = new XmlTreeParser(createRootState());
    parser.parse('<policies>${ return "hello, world"; }</policies>');
  });
});
