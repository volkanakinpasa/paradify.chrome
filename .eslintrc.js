module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {},
};
