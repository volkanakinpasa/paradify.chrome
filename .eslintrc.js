module.exports = {
  env: {
    browser: true,
    es6: true,
    es2020: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    // project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {},
};
