// biome-ignore lint: lint/suspicious/noExplicitAny
export function asType<T>(obj: any, ctor: new (...args: unknown[]) => T): T | null {
  return obj instanceof ctor ? (obj as T) : null;
}
