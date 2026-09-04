const interop = (m) => m && m.__esModule ? m.default : m;

module.exports = {
    plugins: [
      interop(require('postcss-import')),
      interop(require('postcss-nested')),
      require('cssnano')({
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true
            }
          }
        ]
      })
    ]
  };