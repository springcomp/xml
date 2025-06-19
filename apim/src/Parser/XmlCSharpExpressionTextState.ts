import { XmlParserContext } from '@springcomp/xml-core/Parser';
import type { XmlParserState } from '@springcomp/xml-core/Parser';
import { XmlTextState } from '@springcomp/xml-core/types/Parser/XmlTextState';
import { Ref } from '@springcomp/xml-core/Utils';
import { XmlCSharpExpressionState } from './XmlCSharpExpressionState';

export class XmlCSharpExpressionTextState extends XmlTextState {
  private static readonly XmlCSharpExpressionTextStateName = 'XmlCSharpExpressionTextState';
  private cSharpExpressionState: XmlCSharpExpressionState;
  constructor() {
    super(XmlCSharpExpressionTextState.XmlCSharpExpressionTextStateName);
    this.cSharpExpressionState = this.Adopt(new XmlCSharpExpressionState());
  }
  protected onChar(
    _c: string,
    _context: XmlParserContext,
    _replayCharacter: Ref<boolean>,
    _isEndOfFile: boolean,
  ): XmlParserState {
    return this.cSharpExpressionState;
  }
}
