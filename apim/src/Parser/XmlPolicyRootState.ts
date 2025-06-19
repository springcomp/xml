import { XmlParserContext, XmlRootState } from '@springcomp/xml-core/Parser/index.js';
import type { XmlParserState } from '@springcomp/xml-core/Parser/index.js';
import { Ref } from '@springcomp/xml-core/Utils/index.js';
import { XmlCSharpExpressionTextState } from './XmlCSharpExpressionTextState.js';

export class XmlPolicyRootState extends XmlRootState {
  private static readonly _StateName = 'XmlPolicyRootState';
  constructor() {
    super(XmlPolicyRootState._StateName, undefined, undefined, new XmlCSharpExpressionTextState());
    this.Adopt(new XmlCSharpExpressionTextState());
  }
  protected onChar(
    c: string,
    context: XmlParserContext,
    replayCharacter: Ref<boolean>,
    isEndOfFile: boolean,
  ): XmlParserState | null {
    return super.onChar(c, context, replayCharacter, isEndOfFile);
  }
}
