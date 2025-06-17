import { XmlTreeParser } from './Parser/XmlParser.js';

const parser = new XmlTreeParser();
const document = parser.parse('< root></ root >');
const fix = fixCircularReferences(document);
console.log(`doc: ${JSON.stringify(document, fix, 2)}`);

function fixCircularReferences(o: unknown) {
  const weirdTypes = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    BigInt64Array,
    BigUint64Array,
    //Float16Array,
    Float32Array,
    Float64Array,
    ArrayBuffer,
    SharedArrayBuffer,
    DataView,
  ];

  const defs = new Map();
  return (k: unknown, v: unknown) => {
    if (k && v == o) {
      return '[' + k + ' is the same as original object]';
    }
    if (v === undefined) {
      return undefined;
    }
    if (v === null) {
      return null;
    }
    const weirdType = weirdTypes.find(t => v instanceof t);
    if (weirdType) {
      return weirdType.toString();
    }
    if (typeof v == 'function') {
      return v.toString();
    }
    if (v && typeof v == 'object') {
      const def = defs.get(v);
      if (def) {
        return '[' + k + ' is the same as ' + def + ']';
      }
      defs.set(v, k);
    }
    return v;
  };
}
