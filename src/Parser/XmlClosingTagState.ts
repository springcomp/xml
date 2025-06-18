import { XmlNameState } from './XmlNameState.js';
import { XmlCoreDiagnostics } from '../Diagnostics/XmlCoreDiagnostics.js';
import { isINamedXObject } from '../Dom/INamedXObject.js';
import { XmlChar } from './XmlChar.js';
import { XmlParserState } from './XmlParserState.js';
import { XmlParserContext } from './XmlParserContext.js';
import { Ref } from '../Utils/Ref.js';
import { XClosingTag } from '../Dom/XClosingTag.js';
import { XElement } from '../Dom/XElement.js';
import { isXContainer, XContainer } from '../Dom/XContainer.js';

export class XmlClosingTagState extends XmlParserState {
  public static readonly StateName = 'XmlClosingState';
  private static readonly STARTOFFSET = 2; // </
  private nameState: XmlNameState;
  constructor(nameState?: XmlNameState) {
    super(XmlClosingTagState.StateName);
    this.nameState = this.Adopt(nameState ?? new XmlNameState());
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState {
    let ct = context.Nodes.peek().as(XClosingTag);
    if (ct === null) {
      ct = new XClosingTag(context.Position - XmlClosingTagState.STARTOFFSET);
      context.Nodes.push(ct);
    }

    // if tag closed
    if (c === '>' || isEndOfFile) {
      context.Nodes.pop();
      if (ct.Name.IsValid) {
        ct.end(context.Position + 1);

        // Walk up the stack to find matching element
        let popCount = 0;
        let found = false;
        console.log(context.Nodes);
        for (const node of context.Nodes) {
          popCount++;
          console.log(isINamedXObject(node) ? node.Name.Name : 'not an INamedXObject');
          console.log(isINamedXObject(node) ? `${node.Name.Name} === ${ct.Name.Name}` : 'not an INamedXObject');
          console.log(
            isINamedXObject(node)
              ? `${node.Name.Name} equals ${ct.Name.Name} : ${node.Name.equals(ct.Name)}`
              : 'not an INamedXObject',
          );
          if (isINamedXObject(node) && node.Name && node.Name.equals(ct.Name)) {
            console.log(`XmlClosingTagState: found matching starting element : popCount = ${popCount}`);
            found = true;
            break;
          }
        }
        if (!found) {
          popCount = 0;
        }
        // clean the stack of intermediate unclosed tags
        while (popCount > 1) {
          const element = context.Nodes.pop();
          if (isINamedXObject(element) && element.Name.IsValid) {
            context.addDiagnostic(XmlCoreDiagnostics.UnclosedTag, element.Span, element.Name.Name);
          }
          popCount--;
        }

        // close the start tag if found
        if (popCount > 0) {
          context.Nodes.pop().as(XElement)?.close(ct);
        } else {
          console.log(`XmlClosingTagState: NOT FOUND matching starting element : popCount = ${popCount}`);
          context.addDiagnostic(XmlCoreDiagnostics.UnmatchedClosingTag, ct.Span, ct.Name.Name);
          // add non matching closing tag into the tree anyway so it's accessible
          let parent: XContainer | null = null;
          const container = context.Nodes.tryPeek();
          if (isXContainer(container)) {
            if (container.IsEnded) {
              parent = container;
            } else {
              const container = context.Nodes.tryPeek(1);
              if (isXContainer(container)) {
                parent = container;
              }
            }
            console.log('adding non matching tag to the stack');
            parent?.addChildNode(ct);
          }
        }
      }
      if (isEndOfFile) {
        context.addDiagnostic(XmlCoreDiagnostics.IncompleteClosingTag, context.Position, c);
      } else if (!ct.IsNamed) {
        context.addDiagnostic(XmlCoreDiagnostics.UnnamedClosingTag, ct.Span);
      }
      return this.Parent;
    }
    if (c === '<') {
      context.addDiagnostic(XmlCoreDiagnostics.IncompleteClosingTag, context.Position, '<');
      context.Nodes.pop();
      replayCharacter.Value = true;
      return this.Parent;
    }

    if (!ct.IsNamed && /[A-Za-z_]/.test(c)) {
      replayCharacter.Value = true;
      return this.nameState;
    }

    if (!ct.IsNamed && ct.Span.Start + XmlClosingTagState.STARTOFFSET === context.Position) {
      context.addDiagnostic(XmlCoreDiagnostics.MalformedTagClosing, context.Position, c);
    }

    if (XmlChar.IsWhitespace(c)) {
      return this;
    }

    replayCharacter.Value = true;
    context.addDiagnostic(XmlCoreDiagnostics.IncompleteClosingTag, context.Position, c);
    context.Nodes.pop();
    return this.Parent;
  }
}
