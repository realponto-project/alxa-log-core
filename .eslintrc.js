module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true
  },
  extends: ['prettier', 'standard', 'prettier-standard', 'plugin:jest/all'],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'jest/prefer-expect-assertions': [
      'warn',
      { onlyFunctionsWithAsyncKeyword: true }
    ],
    'jest/no-hooks': ['error', { allow: ['beforeAll', 'afterAll', 'beforeEach'] }],
    camelcase: 0
  },
  plugins: ['jest']
}
