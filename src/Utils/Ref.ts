/*
 * A boxing type used in by-ref parameters
 *
 */
export class Ref<T> {
  public value: T;
  private constructor(t: T) {
    this.value = t;
  }
  static wrap<U>(u: U): Ref<U> {
    return new Ref<U>(u);
  }
  public get Value(): T {
    return this.value;
  }
  public set Value(t: T) {
    this.value = t;
  }
}
