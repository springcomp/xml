export class XName {
  private prefix: string | null = null;
  private name: string;
  public static readonly Empty = new XName('');
  constructor(name: string, prefix?: string) {
    this.prefix = prefix ?? null;
    this.name = name;
  }
  public equals(other: XName): boolean {
    return this.name === other.name && this.prefix === other.Prefix;
  }
  public get HasPrefix(): boolean {
    return this.prefix !== null;
  }
  public get IsValid(): boolean {
    return this.name.length > 0;
  }
  public get Prefix(): string | null {
    return this.prefix;
  }
  public get Name(): string {
    return this.name;
  }
}
