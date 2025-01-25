import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  build: {
    rollupOptions: {
      input: {
        nuvoui: path.resolve(__dirname, 'src/styles/index.scss'),
      },
      output: {
        assetFileNames: '[name].min.[ext]'
      }
    }
  },
  // Ensure assets are emitted properly
  assetsInlineLimit: 0,
  // Disable code splitting
  cssCodeSplit: false,
  // // Empty the output directory before building
  emptyOutDir: true,
  server: {
    port: 3000,
    open: true
  }
});