const { readFile } = require('fs-extra')
const { join } = require('path')
const resolve = require('resolve')

const createJestConfig = async projectRoot => {
  const ownRoot = join(__dirname, '..', '..')

  const { devDependencies = {} } = JSON.parse(
    await readFile(join(projectRoot, 'package.json', 'utf-8')),
  )

  const hasReactTestingLibrary = Boolean(
    devDependencies['@testing-library/react'],
  )

  const hasJestComponentSnapshot = Boolean(
    devDependencies['jest-component-snapshot'],
  )

  const setupFilesAfterEnv = [
    await resolve('jest-dom/extend-expect'),
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

  return {
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
      resolve.sync('jest-watch-typeahead/filename', { basedir: ownRoot }),
      resolve.sync('jest-watch-typeahead/testname', { basedir: ownRoot }),
    ],
  }
}

module.exports = createJestConfig
