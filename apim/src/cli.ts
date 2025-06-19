import { XmlRootState, XmlTreeParser } from '@springcomp/xml-core/Parser/index.js';

const parser = new XmlTreeParser(new XmlRootState());
const [document, _] = parser.parse('<a>$("w")</a>');
console.log(document);
