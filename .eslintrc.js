module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true
    }]
  },
  settings: {
    react: {
      version: 'latest'
    }
  }
};