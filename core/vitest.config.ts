import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    coverage: {
      exclude: [...configDefaults.exclude, '**/index.ts'],
    },
  },
});
