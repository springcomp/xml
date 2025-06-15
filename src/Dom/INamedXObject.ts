import { XName } from './XName.js';

export interface INamedXObject {
  get Name(): XName;
  get IsNamed(): boolean;
}
