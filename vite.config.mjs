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
        main: path.resolve(__dirname, 'index.html'),
        light: path.resolve(__dirname, 'src/styles/themes/_light.scss'),
        dark: path.resolve(__dirname, 'src/styles/themes/_dark.scss')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});