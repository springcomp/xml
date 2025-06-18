export type TryAsTypeResult<T> = [true, T] | [false, null];
// biome-ignore lint: lint/suspicious/noExplicitAny
export function tryAsType<T>(obj: any, ctor: new (...args: any[]) => T): TryAsTypeResult<T> {
  return isType(obj, ctor) ? [true, obj as T] : [false, null];
}

// biome-ignore lint: lint/suspicious/noExplicitAny
export function isType<T>(obj: any, ctor: new (...args: any[]) => T): boolean {
  return obj instanceof ctor;
}
