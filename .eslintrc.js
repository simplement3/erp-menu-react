module.exports = {
  env: { node: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  settings: { react: { version: 'detect' } },
};
