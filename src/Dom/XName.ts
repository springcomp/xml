export class XName {
  private prefix: string | null = null;
  private name: string;
  public static readonly Empty = new XName('');
  constructor(name: string, prefix?: string) {
    this.prefix = prefix ?? null;
    this.name = name;
  }
  public hasPrefix(): boolean {
    return this.prefix !== null;
  }
  public get isValid(): boolean {
    return this.name.length > 0;
  }
  public get Prefix(): string | null {
    return this.prefix;
  }
  public get Name(): string {
    return this.name;
  }
}
