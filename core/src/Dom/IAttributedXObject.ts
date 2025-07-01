import { INamedXObject, isINamedXObject } from './INamedXObject.js';
import { XAttributeCollection } from './XAttributeCollection.js';

export interface IAttributedXObject extends INamedXObject {
  get Attributes(): XAttributeCollection;
}

// biome-ignore lint: lint/suspicious/noExplicitAny
export function isIAttributedXObject(obj: any): obj is IAttributedXObject {
  return obj && isINamedXObject(obj) && 'Attributes' in obj;
}
