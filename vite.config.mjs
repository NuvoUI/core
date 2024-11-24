import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern' // or "modern"
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
        // main: path.resolve(__dirname, 'index.html'),
        main: path.resolve(__dirname, 'src/styles/index.scss'),
        light: path.resolve(__dirname, 'src/styles/themes/_light.scss'),
        dark: path.resolve(__dirname, 'src/styles/themes/_dark.scss')
      },
      output: {
        assetFileNames: '[name].[ext]'
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