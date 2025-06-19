/**
 * Exception thrown for stack-related errors.
 * Extends the built-in Error class for custom stack exceptions.
 */
export class StackException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'StackException';
    Object.setPrototypeOf(this, StackException.prototype);
  }
}

/**
 * Exception thrown when attempting to access or remove an element from an empty stack.
 * Extends StackException.
 */
export class EmptyStackException extends StackException {
  constructor(message = 'Stack is empty') {
    super(message);
    this.name = 'EmptyStackException';
    Object.setPrototypeOf(this, EmptyStackException.prototype);
  }
}
