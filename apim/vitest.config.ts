// filepath: apim/vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@springcomp/xml-core': path.resolve(__dirname, '../core/src'),
    },
  },
});
