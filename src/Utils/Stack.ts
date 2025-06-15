import { EmptyStackException } from './StackException.js';

/**
 * A generic stack (LIFO) data structure implementation.
 * Provides standard stack operations such as push, pop, peek, clear, and isEmpty.
 * Throws EmptyStackException when attempting to pop from an empty stack.
 * @typeParam T - The type of elements stored in the stack.
 */
export class Stack<T> {
  private array: T[] = [];

  /**
   * Removes all elements from the stack.
   */
  public clear(): void {
    this.array = [];
  }

  /**
   * Returns the number of items in the stack.
   * @returns the number of items.
   */
  public count(): number {
    return this.array.length;
  }

  /**
   * Checks if the stack is empty.
   * @returns True if the stack is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.array.length === 0;
  }

  /**
   * Returns the top element of the stack without removing it.
   * @returns The top element.
   */
  public peek(): T {
    if (this.isEmpty()) {
      throw new EmptyStackException();
    }
    return this.array[this.array.length - 1];
  }

  /**
   * Removes and returns the top element of the stack.
   * @throws EmptyStackException if the stack is empty.
   * @returns The top element.
   */
  public pop(): T {
    if (this.isEmpty()) {
      throw new EmptyStackException();
    }
    // biome-ignore lint: lint/style/noNonNullAssertion
    return this.array.pop()!;
  }

  /**
   * Adds an element to the top of the stack.
   * @param item - The element to add.
   */
  public push(item: T): void {
    this.array.push(item);
  }
}
