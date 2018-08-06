const { existsSync } = require('fs')
const { join } = require('path')
const resolve = require('resolve')

const hasSetupFile = existsSync(join(process.cwd(), 'test', 'setup.js'))
const { createTypescriptConfigFile } = require('scripts-toolbox')

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', '!src/**/system/**/*'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupTestFrameworkScriptFile: hasSetupFile ? './test/setup.js' : undefined,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost',
  transform: {
    '.(ts|tsx)': resolve.sync('ts-jest', { basedir: __dirname }),
  },
  globals: {
    'ts-jest': {
      tsConfigFile: createTypescriptConfigFile(process.cwd(), require('./tsconfig.json')),
    },
  },
}
