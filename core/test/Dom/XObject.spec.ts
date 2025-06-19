import { describe, it, expect } from 'vitest';
import { XElement } from '../../src/Dom/XElement.js';
import { XObject } from '../../src/Dom/XObject.js';
import { XText } from '../../src/Dom/XText.js';
import { TypeCastException } from '../../src/Utils/TypeCastException.js';

describe('XObject', () => {
  it('should cast as concrete type from the hierarchy', () => {
    const element: XObject = new XElement(0);
    expect(() => {
      element.as(XElement);
    }).not.toThrow();
  });
  it('should throw an exception on unexpected type', () => {
    const element: XObject = new XElement(0);
    expect(() => {
      element.as(XText);
    }).toThrowError(TypeCastException);
  });
});
