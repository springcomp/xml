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
console.log(`doc: ${JSON.stringify(document)}`);
console.log(`context: ${parser._getContext().KeywordBuilder.toString()}`);
