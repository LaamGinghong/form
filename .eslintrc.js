module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {},
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-use-before-define': 0,
        '@typescript-eslint/no-use-before-define': [
          2,
          {
            classes: true,
            functions: false,
            typedefs: false,
          },
        ],
      },
    },
  ],
}
