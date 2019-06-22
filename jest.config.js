const { join } = require('path')
const resolve = require('resolve')

const packageManifest = require(`${process.cwd()}/package.json`)

const hasReactTestingLibrary = Boolean(
  packageManifest.devDependencies['@testing-library/react'],
)

const hasJestComponentSnapshot = Boolean(
  packageManifest.devDependencies['jest-component-snapshot'],
)

const setupFilesAfterEnv = [
  resolve.sync('jest-dom/extend-expect'),
  ...(hasReactTestingLibrary
    ? ['@testing-library/react/cleanup-after-each']
    : []),
  ...(hasJestComponentSnapshot
    ? ['jest-component-snapshot/extend-expect']
    : []),
]

const globalProperties = hasJestComponentSnapshot
  ? {
      globalSetup: 'jest-component-snapshot/setup',
      globalTeardown: 'jest-component-snapshot/teardown',
    }
  : {}

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
  ...globalProperties,
  setupFilesAfterEnv,
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
