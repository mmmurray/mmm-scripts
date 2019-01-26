const { existsSync } = require('fs')
const { join } = require('path')
const resolve = require('resolve')

const hasSetupFile = existsSync(join(process.cwd(), 'test', 'setup.js'))
const { createTypescriptConfig } = require('scripts-toolbox')

const tsConfig = createTypescriptConfig(
  process.cwd(),
  require('./tsconfig.json'),
)

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/system/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: hasSetupFile ? './test/setup.js' : undefined,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost',
  watchPlugins: [
    resolve.sync('jest-watch-typeahead/filename', { basedir: __dirname }),
    resolve.sync('jest-watch-typeahead/testname', { basedir: __dirname }),
  ],
}
