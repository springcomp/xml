import { Readable, Transform, TransformCallback } from 'node:stream';
import { XmlTreeParser } from './Parser/XmlParser.js';

export function sum(left: number, right: number): number {
  return left + right;
}

export function read(): void {
  const xml = '<root />';
  const stream = new Stream(xml);
  const transform = new T();

  stream
    .pipe(transform)
    .on('data', (chunk: string) => {
      console.log(`Received chunk: ${chunk}`);
    })
    .on('error', _ => {})
    .on('finish', () => {});
}

class Stream extends Readable {
  private chars: string[] = [];
  constructor(text: string) {
    super({});
    this.chars = text.split('');
  }
  _read(_: number) {
    this.push(this.chars.shift() || null);
  }
}

class T extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk: unknown, _: BufferEncoding, next: TransformCallback): void {
    const c = String(chunk);
    this.push(c.toUpperCase());
    next();
  }
}

const parser = new XmlTreeParser();
const document = parser.parse('<r />');
const fix = fixCircularReferences(document);
console.log(`doc: ${JSON.stringify(document, fix, 2)}`);
console.log(`context: ${parser._getContext().KeywordBuilder.toString()}`);

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
