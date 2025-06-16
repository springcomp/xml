// FROM: https://gist.github.com/marcogrcr/02d049606191a38550dbb3db106cbefc
export interface StringBuilderOptions {
  /**
   * The initial size of the underlying buffer in bytes.
   * @default 1048576
   */
  readonly initialSize?: number;

  /**
   * The growth factor of the underlying buffer.
   * @default 20
   */
  readonly growthFactor?: number;
}

/**
 * A memory efficient string concatenation builder.
 * @example
 * const builder = new StringBuilder();
 * builder.append("Hello").append(", world!");
 *
 * // if you need the string
 * const str = builder.toString();
 *
 * // if you don't need the string (more memory efficient)
 * await fetch("https://www.exmaple.com", {
 *   method: "POST",
 *   headers: { "content-type": "text/plain" },
 *   body: builder.arrayUnsafe,
 * });
 */
export class StringBuilder {
  static #decoder = new TextDecoder();
  static #encoder = new TextEncoder();

  #array: Uint8Array;
  #growthFactor: number;
  #len = 0;

  /** Gets a {@link Uint8Array} view of the underlying buffer with the string. */
  get arrayUnsafe(): Uint8Array {
    return new Uint8Array(this.#array.buffer, 0, this.#len);
  }

  /** Gets the current length in bytes of the builder. */
  get byteLength(): number {
    return this.#len;
  }

  /** Creates a new instance of the {@link StringBuilder} class. */
  constructor(options: StringBuilderOptions = {}) {
    const { initialSize = 1048576, growthFactor = 0.2 } = options;

    this.#array = new Uint8Array(initialSize);
    this.#growthFactor = 1 + growthFactor;
  }

  /**
   * Appends a `string` or a {@link Uint8Array} with a `UTF-8`-encoded string.
   * @param value The string to append.
   */
  append(value: string | Uint8Array): StringBuilder {
    const data = typeof value === 'string' ? StringBuilder.#encoder.encode(value) : value;
    this.#checkSize(data);

    this.#array.set(data, this.#len);
    this.#len += data.byteLength;

    return this;
  }

  /**
   * Appends a line of text.
   * @param value The string to append.
   */
  appendLine(text: string): StringBuilder {
    return this.append(`${text}\n`);
  }

  /** Clears the builder instance so that it can be re-used. */
  clear(): void {
    this.#len = 0;
  }

  /** Returns a {@link Uint8Array} with the string. */
  toArray() {
    return this.#array.slice(0, this.#len);
  }

  /** Returns the created string. */
  toString() {
    return StringBuilder.#decoder.decode(this.#array.subarray(0, this.#len));
  }

  /**
   * Resizes the underlying array if necessary.
   * @param data The data to append.
   */
  #checkSize(data: Uint8Array) {
    if (data.byteLength + this.#len > this.#array.byteLength) {
      const array = new Uint8Array(Math.trunc((this.#array.byteLength + data.byteLength) * this.#growthFactor));
      array.set(this.#array);

      this.#array = array;
    }
  }
}
