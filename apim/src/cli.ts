import { XmlTreeParser } from '@springcomp/xml-core/Parser/index.js';
import { XmlPolicyRootState } from './Parser/XmlPolicyRootState.js';

const parser = new XmlTreeParser(new XmlPolicyRootState());
const [document, _] = parser.parse('<a>$("w")</a>');
console.log(document);
