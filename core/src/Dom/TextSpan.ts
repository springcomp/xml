export class TextSpan {
  private start: number;
  private length: number;
  constructor(start: number, length?: number) {
    this.start = start;
    this.length = length ?? 0;
  }
  static fromBounds(start: number, end: number): TextSpan {
    return new TextSpan(start, end - start);
  }
  public get Start(): number {
    return this.start;
  }
  public get Length(): number {
    return this.length;
  }
  public get End(): number {
    return this.start + this.length;
  }
  public asLocation(): string {
    return `(${this.start}, ${this.length})`;
  }
  public asRange(): string {
    return `[${this.start}, ${this.End}]`;
  }
  public equals(other: TextSpan): boolean {
    return this.start === other.start && this.length === other.length;
  }
  public toString(): string {
    return this.asRange();
  }
}
