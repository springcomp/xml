import { XAttribute } from './XAttribute.js';
import { XName } from './XName.js';
import { XObject } from './XObject.js';

export class XAttributeCollection {
  private parent: XObject;
  private first: XAttribute | null = null;
  private last: XAttribute | null = null;
  private count = 0;
  constructor(parent: XObject) {
    this.parent = parent;
  }
  public addAttribute(attr: XAttribute) {
    attr.Parent = this.parent;
    if (this.last !== null) {
      this.last.NextSibling = attr;
    }
    this.first ??= attr;
    this.last = attr;
    this.count++;
  }

  public get(name: XName, ignoreCase?: boolean): XAttribute | null {
    let current = this.first;
    while (current !== null) {
      if (current.Name.equals(name, ignoreCase)) {
        return current;
      }
      current = current.NextSibling as XAttribute;
    }
    return null;
  }

  public get IsEmpty(): boolean {
    return this.first === null;
  }
  public get Count(): number {
    return this.count;
  }

  [Symbol.iterator](): Iterator<XAttribute> {
    let current = this.first;
    return {
      next: (): IteratorResult<XAttribute> => {
        if (current === null) {
          return { value: undefined, done: true };
        }
        current = current.NextSibling as XAttribute;
        return { value: current, done: current === null };
      },
    };
  }
}

//
// XAttributeCollection.cs
//
// Author:
//   Mikayla Hutchinson <m.j.hutchinson@gmail.com>
//
// Copyright (C) 2008 Novell, Inc (http://www.novell.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

//#nullable enable
//
//using System;
//using System.Collections.Generic;
//using System.Diagnostics.CodeAnalysis;
//
//namespace MonoDevelop.Xml.Dom
//{
//	public class XAttributeCollection : IEnumerable<XAttribute>
//	{
//		readonly XObject parent;
//
//		public XAttribute? Last { get; private set; }
//		public XAttribute? First { get; private set; }
//
//		public int Count { get; private set; }
//
//		[MemberNotNullWhen(false, nameof (First), nameof (Last))]
//		public bool IsEmpty => First == null;
//
//		public XAttributeCollection (XObject parent) => this.parent = parent;
//
//		public Dictionary<XName, XAttribute> ToDictionary ()
//		{
//			var dict = new Dictionary<XName,XAttribute> ();
//			XAttribute? current = First;
//			while (current is not null) {
//				dict.Add (current.Name, current);
//				current = current.NextSibling;
//			}
//			return dict;
//		}
//
//		public XAttribute? this [XName name] {
//			get {
//				XAttribute? current = First;
//				while (current is not null) {
//					if (current.Name == name)
//						return current;
//					current = current.NextSibling;
//				}
//				return null;
//			}
//		}
//
//		public XAttribute? this [int index] {
//			get {
//				XAttribute? current = First;
//				while (current is not null) {
//					if (index == 0)
//						return current;
//					index--;
//					current = current.NextSibling;
//				}
//				throw new IndexOutOfRangeException ();
//			}
//		}
//
//		public XAttribute? Get (XName name, bool ignoreCase = false)
//		{
//			XAttribute? current = First;
//			while (current is not null) {
//				if (current.Name.Equals (name, ignoreCase))
//					return current;
//				current = current.NextSibling;
//			}
//			return null;
//		}
//
//		public string? GetValue (XName name, bool ignoreCase) => Get (name, ignoreCase)?.Value;
//
//		public void AddAttribute (XAttribute newChild)
//		{
//			newChild.Parent = parent;
//			if (Last is not null) {
//				Last.NextSibling = newChild;
//			}
//			First ??= newChild;
//			Last = newChild;
//			Count++;
//		}
//
//		public IEnumerator<XAttribute> GetEnumerator ()
//		{
//			XAttribute? current = First;
//			while (current is not null) {
//				yield return current;
//				current = current.NextSibling;
//			}
//		}
//
//		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator () => GetEnumerator ();
//	}
//}
//
