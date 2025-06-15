// FROM: https://gist.github.com/marcogrcr/02d049606191a38550dbb3db106cbefc
import { describe, expect, it } from 'vitest';

import { StringBuilder } from '../../src/Utils/StringBuilder.js';

describe('StringBuilder', () => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  describe('constructor', () => {
    it('creates underlying buffer with a default size of 1MB', () => {
      const actual = new StringBuilder().arrayUnsafe.buffer.byteLength;
      expect(actual).toBe(1048576);
    });

    it('creates underlying buffer with specified size', () => {
      const expected = 1;
      const actual = new StringBuilder({ initialSize: expected }).arrayUnsafe.buffer.byteLength;
      expect(actual).toBe(expected);
    });
  });

  describe('append', () => {
    it('append values correctly', () => {
      const sut = new StringBuilder().append('Hello').append(encoder.encode(' World')).append(' 🙃');

      const expected = 'Hello World 🙃';
      expect(sut.byteLength).toBe(encoder.encode(expected).byteLength);
      expect(sut.toString()).toBe(expected);
    });

    describe('resize buffer', () => {
      it('adjusts underyling buffer using growth factor', () => {
        const sut = new StringBuilder({
          initialSize: 1,
          growthFactor: 2, // 200%
        });

        sut.append('H').append('ello World!');

        const expected = 'Hello World!';
        expect(sut.arrayUnsafe.buffer.byteLength).toBe(expected.length * 3);
        expect(sut.toString()).toBe(expected);
      });
    });
  });

  describe('arrayUnsafe', () => {
    it('returns view of underlying buffer', () => {
      const sut = new StringBuilder().append('Hello').append(' World!');

      sut.arrayUnsafe.set(encoder.encode('What is up!?'));

      expect(sut.toString()).toBe('What is up!?');
    });
  });

  describe('clear', () => {
    it('clears underlying buffer', () => {
      const sut = new StringBuilder().append('Hello').append(' World!');

      expect(sut.byteLength).toBe(12);
      expect(sut.toString()).toBe('Hello World!');

      sut.clear();

      expect(sut.byteLength).toBe(0);
      expect(sut.toString()).toBe('');

      sut.append('Goodbye').append(' World!');
      expect(sut.byteLength).toBe(14);
      expect(sut.toString()).toBe('Goodbye World!');
    });
  });

  describe('toArray', () => {
    it('returns copy of underlying buffer', () => {
      const sut = new StringBuilder().append('Hello').append(' World!');

      const actual = sut.toArray();
      expect(decoder.decode(actual)).toBe('Hello World!');

      actual.set(encoder.encode('What is up!?'));

      expect(decoder.decode(actual)).toBe('What is up!?');
      expect(decoder.decode(sut.arrayUnsafe)).toBe('Hello World!');
    });
  });
});
