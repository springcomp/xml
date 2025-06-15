import { XName } from './XName.js';

export interface INamedXObject {
  get Name(): XName;
  set Name(name: XName);
  get IsNamed(): boolean;
}

// biome-ignore lint: lint/suspicious/noExplicitAny
export function isINamedXObject(obj: any): obj is INamedXObject {
  return obj && typeof obj === 'object' && 'Name' in obj && 'IsNamed' in obj;
}
