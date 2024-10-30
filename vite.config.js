import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern' // or "modern"
      }
    },
    plugins: [
                  require('postcss-import'),
                  require('postcss-nested'),
                  require('postcss-apply'),
                  require('autoprefixer'),
                  require('cssnano')({
                      preset: 'default'
                  })
              ]
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