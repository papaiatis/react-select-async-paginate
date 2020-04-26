module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/__stories__/**/*.js',
    '!src/**/__stories__/**/*.jsx',
    '!src/**/__tests__/**/*.js',
    '!src/**/__tests__/**/*.jsx',
  ],

  coverageReporters: [
    'text',
    'lcov',
    'html',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  setupFiles: [
    '../../setup-jest.js',
  ],
};
