module.exports = {
    plugins: [
      require('postcss-import'),
      require('postcss-nested'),
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