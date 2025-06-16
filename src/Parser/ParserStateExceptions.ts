/**
 * Exception thrown by the parser
 * Extends Error.
 */
export class ParserStateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParserStateException';
    Object.setPrototypeOf(this, ParserStateException.prototype);
  }
}

/**
 * Exception thrown when the parser is in an invalid state
 * Extends ParserStateException.
 */
export class InvalidParserStateException extends ParserStateException {
  constructor(message = 'Invalid parser state exception') {
    super(message);
    this.name = 'InvalidParserStateException';
    Object.setPrototypeOf(this, InvalidParserStateException.prototype);
  }
}
