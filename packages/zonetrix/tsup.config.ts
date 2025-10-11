import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
    options.conditions = options.conditions
      ? Array.from(new Set([...options.conditions, 'style']))
      : ['style'];
  },
  // Output CSS alongside JS bundles (no runtime injection)
  injectStyle: false,
  onSuccess: 'echo "Build completed successfully!"',
});
