import { describe, it, expect } from 'vitest';
import { XAttributeCollection } from '../../src/Dom/XAttributeCollection.js';
import { XAttribute } from '../../src/Dom/XAttribute.js';
import { XName } from '../../src/Dom/XName.js';
import { XObject } from '../../src/Dom/XObject.js';
import { XElement } from '../../src/Dom/XElement.js';

describe('XAttributeCollection', () => {
  function createAttribute(name: string, value: string): XAttribute {
    const attr = new XAttribute(0, new XName(name));
    attr.setValue(attr.Span.Start + attr.Span.Length + 2, value);
    return attr;
  }
  function createCollection(parent?: XObject): XAttributeCollection {
    const element = parent ? parent : new XElement(0, new XName('root'));
    return new XAttributeCollection(element);
  }
  it('should hold attributes', () => {
    const collection = createCollection();
    expect(collection.IsEmpty).toBeTruthy();
    expect(collection.Count).toBe(0);

    const attr = createAttribute('attr', 'value');
    collection.addAttribute(attr);

    expect(collection.IsEmpty).toBeFalsy();
    expect(collection.Count).toBe(1);
  });
  it('should hold attributes by name', () => {
    const collection = createCollection();
    const attr = createAttribute('attr', 'value');
    collection.addAttribute(attr);
    // retrieve attribute by name
    expect(collection.get(attr.Name)).not.toBeNull();
    expect(collection.get(new XName('attr'))).not.toBeNull();
  });
  it('should keep track of parent', () => {
    const parent = new XElement(0, new XName('root'));
    const collection = createCollection(parent);
    const attr = createAttribute('attr0', 'value');
    expect(attr.Parent).toBeNull();
    collection.addAttribute(attr);
    expect(attr.Parent).toStrictEqual(parent);
  });
  it('should keep track of next sibling', () => {
    const parent = new XElement(0, new XName('root'));
    const collection = createCollection(parent);
    const first = createAttribute('first', 'value');
    const next = createAttribute('next', 'value');

    collection.addAttribute(first);
    expect(first.NextSibling).toBeNull();
    expect(next.NextSibling).toBeNull();

    collection.addAttribute(next);
    expect(first.NextSibling).toBe(next);
    expect(next.NextSibling).toBeNull();
  });
});
