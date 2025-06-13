import { XDocument } from '../Dom/XDocument.js';

abstract class XmlParser {}

export class XmlTreeParser implements XmlParser {
  public parse(_: string): XDocument {
    return new XDocument();
  }
}
