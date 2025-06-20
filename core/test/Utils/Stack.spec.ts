import { describe, it, expect } from 'vitest';
import { Stack } from '../../src/Utils/Stack.js';
import { EmptyStackException } from '../../src/Utils/StackException.js';

describe('Stack', () => {
  it('count() should return the number of items', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.count()).toBe(3);
  });
  it('should peek the top element in the stack', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.peek()).toBe(3);
  });
  it('should push and pop elements in LIFO order', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
  });

  it('should throw EmptyStackException when popping an empty stack', () => {
    const stack = new Stack<object>();
    expect(() => stack.peek()).toThrow(EmptyStackException);
    expect(() => stack.pop()).toThrow(EmptyStackException);
  });

  it('should return false for isEmpty when stack has elements', () => {
    const stack = new Stack<number>();
    stack.push(42);
    expect(stack.isEmpty()).toBe(false);
  });

  it('should return true for isEmpty when stack is empty', () => {
    const stack = new Stack<number>();
    expect(stack.isEmpty()).toBe(true);
  });

  it('should clear the stack', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.isEmpty()).toBe(true);
  });
  it('tryPeek() should return the top element or null if empty', () => {
    const stack = new Stack<number>();
    expect(stack.tryPeek()).toBeNull();
    stack.push(10);
    expect(stack.tryPeek()).toBe(10);
    stack.push(20);
    expect(stack.tryPeek()).toBe(20);
    expect(stack.tryPeek(1)).toBe(10);
    stack.pop();
    expect(stack.tryPeek()).toBe(10);
    stack.pop();
    expect(stack.tryPeek()).toBeNull();
  });
  it('tryPeek() should return null if depth is greater than stack length', () => {
    const stack = new Stack<number>();
    expect(stack.tryPeek(1)).toBeNull();
    stack.push(10);
    expect(stack.tryPeek(2)).toBeNull();
  });
  it('should allow iterating over the values', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect([...stack]).toStrictEqual([2, 1]);
  });
});
