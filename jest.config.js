const { join } = require('path')
const resolve = require('resolve')

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: [resolve.sync('jest-dom/extend-expect')],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  roots: ['src', 'test'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  transform: {
    '^.+\\.[j|t]sx?$': join(__dirname, 'jest-transform.js'),
  },
  watchPlugins: [
    resolve.sync('jest-watch-typeahead/filename', { basedir: __dirname }),
    resolve.sync('jest-watch-typeahead/testname', { basedir: __dirname }),
  ],
}
