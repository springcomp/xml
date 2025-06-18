// biome-ignore lint: lint/suspicious/noExplicitAny
export function asType<T>(obj: any, ctor: new (...args: any[]) => T): T | null {
  return obj instanceof ctor ? (obj as T) : null;
}
// biome-ignore lint: lint/suspicious/noExplicitAny
export function isType<T>(obj: any, ctor: new (...args: any[]) => T): boolean {
  return obj instanceof ctor;
}
