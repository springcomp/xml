export class TypeCastException extends Error {
  constructor(message: string, _typeName: string) {
    super(message);
    this.name = 'TypeCastException';
    Object.setPrototypeOf(this, TypeCastException.prototype);
  }
}
