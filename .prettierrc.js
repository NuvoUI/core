module.exports = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.scss',
      options: {
        singleQuote: false,
        printWidth: 1000,
        bracketSpacing: false,
      }
    }
  ]
};