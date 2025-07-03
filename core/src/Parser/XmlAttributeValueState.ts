import { XmlCoreDiagnostics } from '../Diagnostics/XmlCoreDiagnostics.js';
import { TextSpan } from '../Dom/TextSpan.js';
import { XAttribute } from '../Dom/XAttribute.js';
import { Ref } from '../Utils/index.js';
import { InvalidParserStateException } from './ParserStateExceptions.js';
import { XmlChar } from './XmlChar.js';
import { XmlParserContext } from './XmlParserContext.js';
import { XmlParserState } from './XmlParserState.js';

export class XmlAttributeValueState extends XmlParserState {
  private static readonly StateName = 'XmlAttributeValueState';
  // state
  //private static FREE = 0 as const;
  private static UNQUOTED = 1 as const;
  //private static SINGLEQUOTE = 2 as const;
  private static DOUBLEQUOTE = 3 as const;

  //derived classes should use these if they need to store info in the tag
  protected static TagMask = 3 as const;
  protected static TagShift = 2 as const;

  constructor(stateName?: string) {
    super(stateName ?? XmlAttributeValueState.StateName);
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState | null {
    const attr = context.Nodes.peek().as(XAttribute);
    if (attr === null) {
      throw new InvalidParserStateException('When parsing attribute value, an XAttribute must be on the stack.');
    }
    if (c === '<') {
      //the parent state should report the error
      attr.setValue(context.Position - context.CurrentStateLength, context.KeywordBuilder.toString());
      replayCharacter.Value = true;
      return this.Parent;
    }

    if (isEndOfFile) {
      //the parent state should report the error
      context.addDiagnostic(XmlCoreDiagnostics.IncompleteAttributeEof, context.Position);
      attr.setValue(context.Position - context.CurrentStateLength, context.KeywordBuilder.toString());
      return this.Parent;
    }

    if (context.enteringParsingState()) {
      if (c == '"') {
        context.StateTag = XmlAttributeValueState.DOUBLEQUOTE;
        return this;
      }
      //if (c == "'") {
      //	context.StateTag = XmlAttributeValueState.SINGLEQUOTE;
      //	return null;
      //}
      context.StateTag = XmlAttributeValueState.UNQUOTED;
    }

    const maskedTag = context.StateTag & XmlAttributeValueState.TagMask;

    if (maskedTag === XmlAttributeValueState.UNQUOTED) {
      return this.buildUnquotedValue(c, context, replayCharacter);
    }

    if (c == '"' && maskedTag == XmlAttributeValueState.DOUBLEQUOTE) {
      //ending the value
      attr.setValue(context.Position - context.KeywordBuilder.byteLength, context.KeywordBuilder.toString());
      return this.Parent;
    }

    context.KeywordBuilder.append(c);
    return this;
  }
  private static isUnquotedValueChar(c: string): boolean {
    return XmlChar.IsLetterOrDigit(c) || c == '_' || c == '.' || c == '-';
  }
  private buildUnquotedValue(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
  ): XmlParserState | null {
    // even though unquoted values aren't legal, attempt to build a value anyway
    if (XmlAttributeValueState.isUnquotedValueChar(c)) {
      context.KeywordBuilder.append(c);
      return null;
    }
    // if first char is not something we can handle as an unquoted char, just reject it for parent to deal with
    if (context.KeywordBuilder.byteLength === 0) {
      if (context.Nodes.peek().is(XAttribute)) {
        const badAttr = context.Nodes.peek().as(XAttribute);
        if (badAttr.Name.IsValid) {
          context.addDiagnostic(
            XmlCoreDiagnostics.IncompleteAttributeValue,
            context.Position,
            badAttr.Name.FullName,
            c,
          );
        }
      }
      replayCharacter.Value = true;
      return this.Parent;
    }

    const attr = context.Nodes.peek().as(XAttribute);
    attr.setValue(context.Position - context.CurrentStateLength, context.KeywordBuilder.toString());

    if (attr.Name.IsValid) {
      const length = attr.Value?.length ?? 0;
      context.addDiagnostic(
        XmlCoreDiagnostics.UnquotedAttributeValue,
        new TextSpan(context.Position - length, length),
        attr.Name.FullName,
      );
    }

    replayCharacter.Value = true;
    return this.Parent;
  }
}
//
// 		XmlParserState? BuildUnquotedValue (char c, XmlParserContext context, ref bool replayCharacter)
// 		{
// 			// even though unquoted values aren't legal, attempt to build a value anyway
// 			if (IsUnquotedValueChar (c)) {
// 				context.KeywordBuilder.Append (c);
// 				return null;
// 			}
//
// 			// if first char is not something we can handle as an unquoted char, just reject it for parent to deal with
// 			if (context.KeywordBuilder.Length == 0) {
// 				if (context.Diagnostics is not null && context.Nodes.Peek () is XAttribute badAtt && badAtt.Name.IsValid) {
// 					context.Diagnostics.Add (XmlCoreDiagnostics.IncompleteAttributeValue, context.Position, badAtt.Name!.FullName, c);
// 				} // 				replayCharacter = true;
// 				return Parent;
// 			}
//
// 			var att = (XAttribute)context.Nodes.Peek ();
// 			att.SetValue (context.Position - context.CurrentStateLength, context.KeywordBuilder.ToString ());
//
// 			if (context.Diagnostics is not null && att.Name.IsValid) {
// 				context.Diagnostics.Add (XmlCoreDiagnostics.UnquotedAttributeValue, new TextSpan (context.Position - att.Value.Length, att.Value.Length), att.Name.FullName);
// 			}
//
// 			replayCharacter = true;
// 			return Parent;
// 		}

// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// using System;
//
// using MonoDevelop.Xml.Analysis;
// using MonoDevelop.Xml.Dom;
//
// namespace MonoDevelop.Xml.Parser
// {
// 	public class XmlAttributeValueState : XmlParserState
// 	{
// 		const int FREE = 0;
// 		const int UNQUOTED = 1;
// 		const int SINGLEQUOTE = 2;
// 		const int DOUBLEQUOTE = 3;
//
// 		//derived classes should use these if they need to store info in the tag
// 		protected const int TagMask = 3;
// 		protected const int TagShift = 2;
//
// 		public override XmlParserState? PushChar (char c, XmlParserContext context, ref bool replayCharacter, bool isEndOfFile)
// 		{
// 			System.Diagnostics.Debug.Assert (((XAttribute) context.Nodes.Peek ()).Value == null);
//
// 			if (c == '<') {
// 				//the parent state should report the error
// 				var att = (XAttribute)context.Nodes.Peek ();
// 				att.SetValue (context.Position - context.CurrentStateLength, context.KeywordBuilder.ToString ());
// 				replayCharacter = true;
// 				return Parent;
// 			}
//
// 			if (isEndOfFile) {
// 				//the parent state should report the error
// 				context.Diagnostics?.Add (XmlCoreDiagnostics.IncompleteAttributeEof, context.PositionBeforeCurrentChar);
// 				var att = (XAttribute)context.Nodes.Peek ();
// 				att.SetValue (context.Position - context.CurrentStateLength, context.KeywordBuilder.ToString ());
// 				return Parent;
// 			}
//
// 			if (context.CurrentStateLength == 0) {
// 				if (c == '"') {
// 					context.StateTag = DOUBLEQUOTE;
// 					return null;
// 				}
// 				if (c == '\'') {
// 					context.StateTag = SINGLEQUOTE;
// 					return null;
// 				}
// 				context.StateTag = UNQUOTED;
// 			}
//
// 			int maskedTag = context.StateTag & TagMask;
//
// 			if (maskedTag == UNQUOTED) {
// 				return BuildUnquotedValue (c, context, ref replayCharacter);
// 			}
//
// 			if ((c == '"' && maskedTag == DOUBLEQUOTE) || c == '\'' && maskedTag == SINGLEQUOTE) {
// 				//ending the value
// 				var att = (XAttribute) context.Nodes.Peek ();
// 				att.SetValue (context.Position - context.KeywordBuilder.Length, context.KeywordBuilder.ToString ());
// 				return Parent;
// 			}
//
// 			context.KeywordBuilder.Append (c);
// 			return null;
// 		}
//
// 		public static bool IsUnquotedValueChar (char c) => char.IsLetterOrDigit (c) || c == '_' || c == '.' || c == '-';
//
// 		XmlParserState? BuildUnquotedValue (char c, XmlParserContext context, ref bool replayCharacter)
// 		{
// 			// even though unquoted values aren't legal, attempt to build a value anyway
// 			if (IsUnquotedValueChar (c)) {
// 				context.KeywordBuilder.Append (c);
// 				return null;
// 			}
//
// 			// if first char is not something we can handle as an unquoted char, just reject it for parent to deal with
// 			if (context.KeywordBuilder.Length == 0) {
// 				if (context.Diagnostics is not null && context.Nodes.Peek () is XAttribute badAtt && badAtt.Name.IsValid) {
// 					context.Diagnostics.Add (XmlCoreDiagnostics.IncompleteAttributeValue, context.Position, badAtt.Name!.FullName, c);
// 				}
// 				replayCharacter = true;
// 				return Parent;
// 			}
//
// 			var att = (XAttribute)context.Nodes.Peek ();
// 			att.SetValue (context.Position - context.CurrentStateLength, context.KeywordBuilder.ToString ());
//
// 			if (context.Diagnostics is not null && att.Name.IsValid) {
// 				context.Diagnostics.Add (XmlCoreDiagnostics.UnquotedAttributeValue, new TextSpan (context.Position - att.Value.Length, att.Value.Length), att.Name.FullName);
// 			}
//
// 			replayCharacter = true;
// 			return Parent;
// 		}
//
// 		public override XmlParserContext TryRecreateState (ref XObject xobject, int position)
// 			=> throw new InvalidOperationException ("State has no corresponding XObject");
//
// 		public static char? GetDelimiterChar (XmlParserContext context)
// 			=> context.CurrentState is XmlAttributeValueState
// 			? (context.StateTag & TagMask) switch {
// 				SINGLEQUOTE => '\'',
// 				DOUBLEQUOTE => '"',
// 				_ => (char?) null
// 			}
// 			: null;
// 	}
// }
