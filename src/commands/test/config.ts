import { join } from 'path'

type Options = {
  jestComponentSnapshot?: boolean
  testDirectories: string[]
  coverageIgnores: string[]
}

const createJestConfig = (options: Options) => {
  const setupFilesAfterEnv = [
    require.resolve('@testing-library/jest-dom/extend-expect'),
    ...(options.jestComponentSnapshot
      ? ['jest-component-snapshot/extend-expect']
      : []),
  ]

  const globalProperties = options.jestComponentSnapshot
    ? {
        globalSetup: 'jest-component-snapshot/setup',
        globalTeardown: 'jest-component-snapshot/teardown',
      }
    : {}

  return {
    clearMocks: true,
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      ...options.coverageIgnores.map((x) => `!${x}`),
    ],
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
    roots: ['src', ...options.testDirectories],
    testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
    transform: {
      '^.+\\.[j|t]sx?$': join(
        __dirname,
        '..',
        '..',
        '..',
        'jest',
        'transform.js',
      ),
    },
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname'),
    ],
  }
}

export { createJestConfig }
