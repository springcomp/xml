import { XmlParserContext, XmlRootState } from '@springcomp/xml-core/Parser';
import type { XmlParserState } from '@springcomp/xml-core/Parser';
import { Ref } from '@springcomp/xml-core/Utils';
import { XmlCSharpExpressionTextState } from './XmlCSharpExpressionTextState';

export class XmlPolicyRootState extends XmlRootState {
  private static readonly _StateName = 'XmlPolicyRootState';
  constructor() {
    super(XmlPolicyRootState._StateName, undefined, undefined, new XmlCSharpExpressionTextState());
    this.Adopt(new XmlCSharpExpressionTextState());
  }
  protected onChar(
    _c: string,
    _context: XmlParserContext,
    _replayCharacter: Ref<boolean>,
    _isEndOfFile: boolean,
  ): XmlParserState {
    return this;
  }
}
